import { webRtcPlayer } from './webRtcPlayer';
import { ajax } from './request';
// Copyright Epic Games, Inc. All Rights Reserved.

// Window events for a gamepad connecting
let haveEvents = 'GamepadEvent' in window;
let haveWebkitEvents = 'WebKitGamepadEvent' in window;
let controllers = {};
let rAF = window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.requestAnimationFrame;
let kbEvent = document.createEvent("KeyboardEvent");
let initMethod = typeof kbEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";


let webRtcPlayerObj = null;
let print_stats = false;
let print_inputs = false;
let connect_on_load = false;
let is_reconnection = false;
let ws;
const WS_OPEN_STATE = 1;

let qualityController = true;
let matchViewportResolution = true;
// TODO: Remove this - workaround because of bug causing UE to crash when switching resolutions too quickly
let lastTimeResized = new Date().getTime();
let resizeTimeout;

let onDataChannelConnected;
let responseEventListeners = new Map();

let freezeFrameOverlay = null;
let shouldShowPlayOverlay = true;
// A freeze frame is a still JPEG image shown instead of the video.
let freezeFrame = {
    receiving: false,
    size: 0,
    jpeg: undefined,
    height: 0,
    width: 0,
    valid: false
};
let bLog = true;
let file = {
    mimetype: "",
    extension: "",
    receiving: false,
    size: 0,
    data: [],
    valid: false,
    timestampStart: undefined
};

// Optionally detect if the user is not interacting (AFK) and disconnect them.
let afk = {
    enabled: true,   // Set to true to enable the AFK system.
    warnTimeout: 120,   // The time to elapse before warning the user they are inactive.
    closeTimeout: 30,   // The time after the warning when we disconnect the user.

    active: false,   // Whether the AFK system is currently looking for inactivity.
    overlay: undefined,   // The UI overlay warning the user that they are inactive.
    warnTimer: undefined,   // The timer which waits to show the inactivity warning overlay.
    countdown: 0,   // The inactivity warning overlay has a countdown to show time until disconnect.
    countdownTimer: undefined,   // The timer used to tick the seconds shown on the inactivity warning overlay.
}

// If the user focuses on a UE4 input widget then we show them a button to open
// the on-screen keyboard. JavaScript security means we can only show the
// on-screen keyboard in response to a user interaction.
let editTextButton = undefined;

// A hidden input text box which is used only for focusing and opening the
// on-screen keyboard.
let hiddenInput = undefined;

let t0 = Date.now();

function log(str) {
    console.log(`${Math.floor(Date.now() - t0)}: ` + str);
}

function scanGamepads() {
    let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && (gamepads[i].index in controllers)) {
            controllers[gamepads[i].index].currentState = gamepads[i];
        }
    }
}


function updateStatus() {
    scanGamepads();
    // Iterate over multiple controllers in the case the mutiple gamepads are connected
    for (j in controllers) {
        let controller = controllers[j];
        let currentState = controller.currentState;
        let prevState = controller.prevState;
        // Iterate over buttons
        for (let i = 0; i < currentState.buttons.length; i++) {
            let currButton = currentState.buttons[i];
            let prevButton = prevState.buttons[i];
            // Button 6 is actually the left trigger, send it to UE as an analog axis
            // Button 7 is actually the right trigger, send it to UE as an analog axis
            // The rest are normal buttons. Treat as such
            if (currButton.pressed && !prevButton.pressed) {
                // New press
                if (i == 6) {
                    emitControllerAxisMove(j, 5, currButton.value);
                } else if (i == 7) {
                    emitControllerAxisMove(j, 6, currButton.value);
                } else {
                    emitControllerButtonPressed(j, i, 0);
                }
            } else if (!currButton.pressed && prevButton.pressed) {
                // release
                if (i == 6) {
                    emitControllerAxisMove(j, 5, 0);
                } else if (i == 7) {
                    emitControllerAxisMove(j, 6, 0);
                } else {
                    emitControllerButtonReleased(j, i);
                }
            } else if (currButton.pressed && prevButton.pressed) {
                // repeat press / hold
                if (i == 6) {
                    emitControllerAxisMove(j, 5, currButton.value);
                } else if (i == 7) {
                    emitControllerAxisMove(j, 6, currButton.value);
                } else {
                    emitControllerButtonPressed(j, i, 1);
                }
            }
            // Last case is button isn't currently pressed and wasn't pressed before. This doesn't need an else block
        }
        // Iterate over gamepad axes
        for (let i = 0; i < currentState.axes.length; i += 2) {
            let x = parseFloat(currentState.axes[i].toFixed(4));
            // https://w3c.github.io/gamepad/#remapping Gamepad broweser side standard mapping has positive down, negative up. This is downright disgusting. So we fix it.
            let y = -parseFloat(currentState.axes[i + 1].toFixed(4));
            if (i === 0) {
                // left stick
                // axis 1 = left horizontal
                emitControllerAxisMove(j, 1, x);
                // axis 2 = left vertical
                emitControllerAxisMove(j, 2, y);
            } else if (i === 2) {
                // right stick
                // axis 3 = right horizontal
                emitControllerAxisMove(j, 3, x);
                // axis 4 = right vertical
                emitControllerAxisMove(j, 4, y);
            }
        }
        controllers[j].prevState = currentState;
    }
    rAF(updateStatus);
}

function emitControllerButtonPressed(controllerIndex, buttonIndex, isRepeat) {
    Data = new DataView(new ArrayBuffer(4));
    Data.setUint8(0, MessageType.GamepadButtonPressed);
    Data.setUint8(1, controllerIndex);
    Data.setUint8(2, buttonIndex);
    Data.setUint8(3, isRepeat);
}

function emitControllerButtonReleased(controllerIndex, buttonIndex) {
    Data = new DataView(new ArrayBuffer(3));
    Data.setUint8(0, MessageType.GamepadButtonReleased);
    Data.setUint8(1, controllerIndex);
    Data.setUint8(2, buttonIndex);
}

function emitControllerAxisMove(controllerIndex, axisIndex, analogValue) {
    Data = new DataView(new ArrayBuffer(11));
    Data.setUint8(0, MessageType.GamepadAnalog);
    Data.setUint8(1, controllerIndex);
    Data.setUint8(2, axisIndex);
    Data.setFloat64(3, analogValue, true);
    sendInputData(Data.buffer);
}

function gamepadConnectHandler(e) {
    console.log("Gamepad connect handler");
    gamepad = e.gamepad;
    controllers[gamepad.index] = {};
    controllers[gamepad.index].currentState = gamepad;
    controllers[gamepad.index].prevState = gamepad;
    console.log("gamepad: " + gamepad.id + " connected");
    rAF(updateStatus);
}

function gamepadDisconnectHandler(e) {
    console.log("Gamepad disconnect handler");
    console.log("gamepad: " + e.gamepad.id + " disconnected");
    delete controllers[e.gamepad.index];
}

function setupHtmlEvents() {
    //Window events
    window.addEventListener('resize', resizePlayerStyle, true);
    window.addEventListener('orientationchange', onOrientationChange);

    //Gamepad events
    if (haveEvents) {
        window.addEventListener("gamepadconnected", gamepadConnectHandler);
        window.addEventListener("gamepaddisconnected", gamepadDisconnectHandler);
    } else if (haveWebkitEvents) {
        window.addEventListener("webkitgamepadconnected", gamepadConnectHandler);
        window.addEventListener("webkitgamepaddisconnected", gamepadDisconnectHandler);
    }

}

function setupToggleWithUrlParams(toggleId, urlParameterKey) {
    let toggleElem = document.getElementById(toggleId);
    if (toggleElem) {
        toggleElem.checked = new URLSearchParams(window.location.search).has(urlParameterKey);
        toggleElem.addEventListener('change', (event) => {
            const urlParams = new URLSearchParams(window.location.search);
            if (event.currentTarget.checked) {
                urlParams.set(urlParameterKey, "true");
            } else {
                urlParams.delete(urlParameterKey);
            }
            window.history.replaceState({}, '', urlParams.toString() !== "" ? `${location.pathname}?${urlParams}` : `${location.pathname}`);
        });
    }
}

var streamTrackSource = null;



function setOverlay(htmlClass, htmlElement, onClickFunction) {
    let videoPlayOverlay = document.getElementById('videoPlayOverlay');
    if (!videoPlayOverlay) {
        let playerDiv = document.getElementById('player');
        videoPlayOverlay = document.createElement('div');
        videoPlayOverlay.id = 'videoPlayOverlay';
        playerDiv.appendChild(videoPlayOverlay);
    }

    // Remove existing html child elements so we can add the new one
    while (videoPlayOverlay.lastChild) {
        videoPlayOverlay.removeChild(videoPlayOverlay.lastChild);
    }

    if (htmlElement)
        videoPlayOverlay.appendChild(htmlElement);

    if (onClickFunction) {
        videoPlayOverlay.addEventListener('click', function onOverlayClick(event) {
            onClickFunction(event);
            videoPlayOverlay.removeEventListener('click', onOverlayClick);
        });
    }

    // Remove existing html classes so we can set the new one
    let cl = videoPlayOverlay.classList;
    for (let i = cl.length - 1; i >= 0; i--) {
        cl.remove(cl[i]);
    }

    videoPlayOverlay.classList.add(htmlClass);
}

function showConnectOverlay() {
    setTimeout(() => {
        connect();
        startAfkWarningTimer();
    }, 300)
}

function showTextOverlay(text) {
    let textOverlay = document.createElement('div');
    textOverlay.id = 'messageOverlay';
    textOverlay.innerHTML = text ? text : '';
    setOverlay('textDisplayState', textOverlay);
}

function playVideoStream() {
    if (webRtcPlayerObj && webRtcPlayerObj.video) {

        webRtcPlayerObj.video.play().catch(function (onRejectedReason) {
            console.error(onRejectedReason);
            console.log("Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay.")
            showPlayOverlay();
        });

        requestInitialSettings();
        requestQualityControl();
        showFreezeFrameOverlay();
        hideOverlay();
    } else {
        console.error("Could not player video stream because webRtcPlayerObj.video was not valid.")
    }
}

function showPlayOverlay() {
    // let img = document.createElement('img');
    // img.id = 'playButton';
    // img.src = '/images/Play.png';
    // img.alt = 'Start Streaming';
    // setOverlay('clickableState', img, event => {
    //     playVideoStream();
    // });
    // shouldShowPlayOverlay = false;
    setTimeout(() => {
        if (webRtcPlayerObj) {
            playVideoStream();
        }

        // requestQualityControl();
        // showFreezeFrameOverlay();
    }, 500);
}

function updateAfkOverlayText() {
    afk.overlay.innerHTML = '<center>没有检测到活跃状态，自动断开连接计时 ' + afk.countdown + ' s,点击继续连接</center>';
}

function showAfkOverlay() {
    // Pause the timer while the user is looking at the inactivity warning overlay.
    stopAfkWarningTimer();

    // Show the inactivity warning overlay.
    afk.overlay = document.createElement('div');
    afk.overlay.id = 'afkOverlay';
    afk.overlay.style = `position: relative;text-align: center;z-index:1000;`;
    setOverlay('clickableState', afk.overlay, event => {
        // The user clicked so start the timer again and carry on.
        hideOverlay();
        clearInterval(afk.countdownTimer);
        startAfkWarningTimer();
    });

    afk.countdown = afk.closeTimeout;
    updateAfkOverlayText();

    if (inputOptions.controlScheme == ControlSchemeType.LockedMouse) {
        document.exitPointerLock();
    }

    afk.countdownTimer = setInterval(function () {
        afk.countdown--;
        if (afk.countdown == 0) {
            clearInterval(afk.countdownTimer);
            // The user failed to click so disconnect them.
            hideOverlay();
            ws.close();
        } else {
            // Update the countdown message.
            updateAfkOverlayText();
        }
    }, 1000);
}

function hideOverlay() {
    setOverlay('hiddenState');
}

// Start a timer which when elapsed will warn the user they are inactive.
function startAfkWarningTimer() {
    afk.active = afk.enabled;
    resetAfkWarningTimer();
}

// Stop the timer which when elapsed will warn the user they are inactive.
function stopAfkWarningTimer() {
    afk.active = false;
}

// If the user interacts then reset the warning timer.
function resetAfkWarningTimer() {
    if (afk.active) {
        clearTimeout(afk.warnTimer);
        afk.warnTimer = setTimeout(function () {
            showAfkOverlay();
        }, afk.warnTimeout * 1000);
    }
}

function createWebRtcOffer() {
    if (webRtcPlayerObj) {
        console.log('Creating offer');
        showTextOverlay('Starting connection to server, please wait');
        webRtcPlayerObj.createOffer();
    } else {
        console.log('WebRTC player not setup, cannot create offer');
        showTextOverlay('Unable to setup video');
    }
}

function sendInputData(data) {
    if (webRtcPlayerObj) {
        resetAfkWarningTimer();
        webRtcPlayerObj.send(data);
    }
}

function addResponseEventListener(name, listener) {
    responseEventListeners.set(name, listener);
}

function removeResponseEventListener(name) {
    responseEventListeners.remove(name);
}

// Must be kept in sync with PixelStreamingProtocol::EToPlayerMsg C++ enum.
const ToClientMessageType = {
    QualityControlOwnership: 0,
    Response: 1,
    Command: 2,
    FreezeFrame: 3,
    UnfreezeFrame: 4,
    VideoEncoderAvgQP: 5,
    LatencyTest: 6,
    InitialSettings: 7,
    FileExtension: 8,
    FileMimeType: 9,
    FileContents: 10
};

let VideoEncoderQP = "N/A";

function setupWebRtcPlayer(htmlElement, config) {
    webRtcPlayerObj = new webRtcPlayer(config);
    htmlElement.appendChild(webRtcPlayerObj.video);
    htmlElement.appendChild(freezeFrameOverlay);

    webRtcPlayerObj.onWebRtcOffer = function (offer) {
        if (ws && ws.readyState === WS_OPEN_STATE) {
            let offerStr = JSON.stringify(offer);
            console.log("%c[Outbound SS message (offer)]", "background: lightgreen; color: black", offer);
            ws.send(offerStr);
        }
    };

    webRtcPlayerObj.onWebRtcCandidate = function (candidate) {
        if (ws && ws.readyState === WS_OPEN_STATE) {
            ws.send(JSON.stringify({
                type: 'iceCandidate',
                candidate: candidate
            }));
        }
    };

    webRtcPlayerObj.onWebRtcAnswer = function (answer) {
        if (ws && ws.readyState === WS_OPEN_STATE) {
            let answerStr = JSON.stringify(answer);
            console.log("%c[Outbound SS message (answer)]", "background: lightgreen; color: black", answer);
            ws.send(answerStr);
        }
    };

    webRtcPlayerObj.onVideoInitialised = function () {
        if (ws && ws.readyState === WS_OPEN_STATE) {
            if (shouldShowPlayOverlay) {
                showPlayOverlay();
                resizePlayerStyle();
            }
            else {
                resizePlayerStyle();
                playVideoStream();
            }
        }
    };

    webRtcPlayerObj.onDataChannelConnected = function () {
        if (onDataChannelConnected) {
            onDataChannelConnected();
        }
        if (ws && ws.readyState === WS_OPEN_STATE) {
            showTextOverlay('WebRTC data channel connected... waiting for video');
            // requestQualityControl();
        }
    };

    function showFreezeFrame() {
        let base64 = btoa(freezeFrame.jpeg.reduce((data, byte) => data + String.fromCharCode(byte), ''));
        let freezeFrameImage = document.getElementById("freezeFrameOverlay").childNodes[0];
        freezeFrameImage.src = 'data:image/jpeg;base64,' + base64;
        freezeFrameImage.onload = function () {
            freezeFrame.height = freezeFrameImage.naturalHeight;
            freezeFrame.width = freezeFrameImage.naturalWidth;
            resizeFreezeFrameOverlay();
            if (shouldShowPlayOverlay) {
                showPlayOverlay();
                resizePlayerStyle();
            } else {
                showFreezeFrameOverlay();
            }
            webRtcPlayerObj.setVideoEnabled(false);
        };
    }



    function processFileExtension(view) {
        // Reset file if we got a file message and we are not "receiving" it yet
        if (!file.receiving) {
            file.mimetype = "";
            file.extension = "";
            file.receiving = true;
            file.valid = false;
            file.size = 0;
            file.data = [];
            file.timestampStart = (new Date()).getTime();
            console.log('Received first chunk of file');
        }

        let extensionAsString = new TextDecoder("utf-16").decode(view.slice(1));
        console.log(extensionAsString);
        file.extension = extensionAsString;
    }

    function processFileMimeType(view) {
        // Reset file if we got a file message and we are not "receiving" it yet
        if (!file.receiving) {
            file.mimetype = "";
            file.extension = "";
            file.receiving = true;
            file.valid = false;
            file.size = 0;
            file.data = [];
            file.timestampStart = (new Date()).getTime();
            console.log('Received first chunk of file');
        }

        let mimeAsString = new TextDecoder("utf-16").decode(view.slice(1));
        console.log(mimeAsString);
        file.mimetype = mimeAsString;
    }


    function processFileContents(view) {
        // If we haven't received the intial setup instructions, return
        if (!file.receiving) return;

        // Extract the toal size of the file (across all chunks)
        file.size = Math.ceil((new DataView(view.slice(1, 5).buffer)).getInt32(0, true) / 16379 /* The maximum number of payload bits per message*/);

        // Get the file part of the payload
        let fileBytes = view.slice(1 + 4);

        // Append to existing data that holds the file
        file.data.push(fileBytes);

        // Uncomment for debug
        console.log(`Received file chunk: ${file.data.length}/${file.size}`);

        if (file.data.length === file.size) {
            file.receiving = false;
            file.valid = true;
            console.log("Received complete file")
            const transferDuration = ((new Date()).getTime() - file.timestampStart);
            const transferBitrate = Math.round(file.size * 16 * 1024 / transferDuration);
            console.log(`Average transfer bitrate: ${transferBitrate}kb/s over ${transferDuration / 1000} seconds`);

            // File reconstruction
            /**
             * Example code to reconstruct the file
             * 
             * This code reconstructs the received data into the original file based on the mime type and extension provided and then downloads the reconstructed file
             */
            var received = new Blob(file.data, { type: file.mimetype })
            var a = document.createElement('a');
            a.setAttribute('href', URL.createObjectURL(received));
            a.setAttribute('download', `transfer.${file.extension}`);
            var aj = $(a);
            aj.appendTo('body');
            // aj[0].click();
            aj.remove();
        }
        else if (file.data.length > file.size) {
            file.receiving = false;
            console.error(`Received bigger file than advertised: ${file.data.length}/${file.size}`);
        }
    }

    function processFreezeFrameMessage(view) {
        // Reset freeze frame if we got a freeze frame message and we are not "receiving" yet.
        if (!freezeFrame.receiving) {
            freezeFrame.receiving = true;
            freezeFrame.valid = false;
            freezeFrame.size = 0;
            freezeFrame.jpeg = undefined;
        }

        // Extract total size of freeze frame (across all chunks)
        freezeFrame.size = (new DataView(view.slice(1, 5).buffer)).getInt32(0, true);

        // Get the jpeg part of the payload
        let jpegBytes = view.slice(1 + 4);

        // Append to existing jpeg that holds the freeze frame
        if (freezeFrame.jpeg) {
            let jpeg = new Uint8Array(freezeFrame.jpeg.length + jpegBytes.length);
            jpeg.set(freezeFrame.jpeg, 0);
            jpeg.set(jpegBytes, freezeFrame.jpeg.length);
            freezeFrame.jpeg = jpeg;
        }
        // No existing freeze frame jpeg, make one
        else {
            freezeFrame.jpeg = jpegBytes;
            freezeFrame.receiving = true;
            console.log(`received first chunk of freeze frame: ${freezeFrame.jpeg.length}/${freezeFrame.size}`);
        }

        // Uncomment for debug
        //console.log(`Received freeze frame chunk: ${freezeFrame.jpeg.length}/${freezeFrame.size}`);

        // Finished receiving freeze frame, we can show it now
        if (freezeFrame.jpeg.length === freezeFrame.size) {
            freezeFrame.receiving = false;
            freezeFrame.valid = true;
            console.log(`received complete freeze frame ${freezeFrame.size}`);
            showFreezeFrame();
        }
        // We received more data than the freeze frame payload message indicate (this is an error)
        else if (freezeFrame.jpeg.length > freezeFrame.size) {
            console.error(`received bigger freeze frame than advertised: ${freezeFrame.jpeg.length}/${freezeFrame.size}`);
            freezeFrame.jpeg = undefined;
            freezeFrame.receiving = false;
        }
    }

    webRtcPlayerObj.onNewVideoTrack = function (streams) {
        if (webRtcPlayerObj.video && webRtcPlayerObj.video.srcObject && webRtcPlayerObj.onVideoInitialised) {
            webRtcPlayerObj.onVideoInitialised();
        }
    }

    webRtcPlayerObj.onDataChannelMessage = function (data) {
        let view = new Uint8Array(data);
        if (view[0] === ToClientMessageType.Response) {
            let response = new TextDecoder("utf-16").decode(data.slice(1));
            onResponse(response);
        } else if (view[0] === ToClientMessageType.Command) {
            let commandAsString = new TextDecoder("utf-16").decode(data.slice(1));
            console.log(commandAsString);
            let command = JSON.parse(commandAsString);
            if (command.command === 'onScreenKeyboard') {
                showOnScreenKeyboard(command);
            }
        } else if (view[0] === ToClientMessageType.FreezeFrame) {
            processFreezeFrameMessage(view);
        } else if (view[0] === ToClientMessageType.UnfreezeFrame) {
            invalidateFreezeFrameOverlay();
        } else if (view[0] === ToClientMessageType.VideoEncoderAvgQP) {
            VideoEncoderQP = new TextDecoder("utf-16").decode(data.slice(1));
            //console.log(`received VideoEncoderAvgQP ${VideoEncoderQP}`);
        } else if (view[0] == ToClientMessageType.LatencyTest) {
            let latencyTimingsAsString = new TextDecoder("utf-16").decode(data.slice(1));
            console.log("Got latency timings from UE.")
            console.log(latencyTimingsAsString);
            let latencyTimingsFromUE = JSON.parse(latencyTimingsAsString);
            if (webRtcPlayerObj) {
                webRtcPlayerObj.latencyTestTimings.SetUETimings(latencyTimingsFromUE);
            }
        } else if (view[0] == ToClientMessageType.FileExtension) {
            processFileExtension(view);
        } else if (view[0] == ToClientMessageType.FileMimeType) {
            processFileMimeType(view);
        } else if (view[0] == ToClientMessageType.FileContents) {
            processFileContents(view);
        } else {
            console.error(`unrecognized data received, packet ID ${view[0]}`);
        }
    };

    registerInputs(webRtcPlayerObj.video);

    // On a touch device we will need special ways to show the on-screen keyboard.
    if ('ontouchstart' in document.documentElement) {
        createOnScreenKeyboardHelpers(htmlElement);
    }

    //createWebRtcOffer();

    return webRtcPlayerObj.video;
}

function setupStats() {
    let printInterval = 5 * 60 * 1000; /*Print every 5 minutes*/
    let nextPrintDuration = printInterval;

    webRtcPlayerObj.onAggregatedStats = (aggregatedStats) => {
        // let numberFormat = new Intl.NumberFormat(window.navigator.language, { maximumFractionDigits: 0 });
        // let timeFormat = new Intl.NumberFormat(window.navigator.language, { maximumFractionDigits: 0, minimumIntegerDigits: 2 });

        // Calculate duration of run
        let runTime = (aggregatedStats.timestamp - aggregatedStats.timestampStart) / 1000;
        let timeValues = [];
        let timeDurations = [60, 60];
        for (let timeIndex = 0; timeIndex < timeDurations.length; timeIndex++) {
            timeValues.push(runTime % timeDurations[timeIndex]);
            runTime = runTime / timeDurations[timeIndex];
        }
        timeValues.push(runTime);

        // let receivedBytesMeasurement = 'B';
        // let receivedBytes = aggregatedStats.hasOwnProperty('bytesReceived') ? aggregatedStats.bytesReceived : 0;
        // let dataMeasurements = ['kB', 'MB', 'GB'];
        // for (let index = 0; index < dataMeasurements.length; index++) {
        //     if (receivedBytes < 100 * 1000)
        //         break;
        //     receivedBytes = receivedBytes / 1000;
        //     receivedBytesMeasurement = dataMeasurements[index];
        // }

        if (print_stats) {
            if (aggregatedStats.timestampStart) {
                if ((aggregatedStats.timestamp - aggregatedStats.timestampStart) > nextPrintDuration) {
                    if (ws && ws.readyState === WS_OPEN_STATE) {
                        console.log(`-> SS: stats\n${JSON.stringify(aggregatedStats)}`);
                        ws.send(JSON.stringify({ type: 'stats', data: aggregatedStats }));
                    }
                    nextPrintDuration += printInterval;
                }
            }
        }
    };

    webRtcPlayerObj.aggregateStats(1 * 1000 /*Check every 1 second*/);
}
function onWebRtcOffer(webRTCData) {
    webRtcPlayerObj.receiveOffer(webRTCData);
    setupStats();
}

function onWebRtcAnswer(webRTCData) {
    webRtcPlayerObj.receiveAnswer(webRTCData);
    setupStats();
}

function onWebRtcIce(iceCandidate) {
    if (webRtcPlayerObj) {
        webRtcPlayerObj.handleCandidateFromServer(iceCandidate);
    }
}

let styleWidth;
let styleHeight;
let styleTop;
let styleLeft;
let styleCursor = 'default';
let styleAdditional;

const ControlSchemeType = {
    // A mouse can lock inside the WebRTC player so the user can simply move the
    // mouse to control the orientation of the camera. The user presses the
    // Escape key to unlock the mouse.
    LockedMouse: 0,

    // A mouse can hover over the WebRTC player so the user needs to click and
    // drag to control the orientation of the camera.
    HoveringMouse: 1
};

let inputOptions = {
    // The control scheme controls the behaviour of the mouse when it interacts
    // with the WebRTC player.
    controlScheme: ControlSchemeType.HoveringMouse,

    // Browser keys are those which are typically used by the browser UI. We
    // usually want to suppress these to allow, for example, UE4 to show shader
    // complexity with the F5 key without the web page refreshing.
    suppressBrowserKeys: true,

    // UE4 has a faketouches option which fakes a single finger touch when the
    // user drags with their mouse. We may perform the reverse; a single finger
    // touch may be converted into a mouse drag UE4 side. This allows a
    // non-touch application to be controlled partially via a touch device.
    fakeMouseWithTouches: false
};

function resizePlayerStyleToFillWindow(playerElement) {
    let videoElement = playerElement.getElementsByTagName("VIDEO");

    // Fill the player display in window, keeping picture's aspect ratio.
    let windowAspectRatio = window.innerHeight / window.innerWidth;
    let playerAspectRatio = playerElement.clientHeight / playerElement.clientWidth;
    // We want to keep the video ratio correct for the video stream
    let videoAspectRatio = videoElement.videoHeight / videoElement.videoWidth;
    if (isNaN(videoAspectRatio)) {
        //Video is not initialised yet so set playerElement to size of window
        styleWidth = window.innerWidth;
        styleHeight = window.innerHeight;
        styleTop = 0;
        styleLeft = 0;
        playerElement.style = "top: " + styleTop + "px; left: " + styleLeft + "px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
    } else if (windowAspectRatio < playerAspectRatio) {
        // Window height is the constraining factor so to keep aspect ratio change width appropriately
        styleWidth = Math.floor(window.innerHeight / videoAspectRatio);
        styleHeight = window.innerHeight;
        styleTop = 0;
        styleLeft = Math.floor((window.innerWidth - styleWidth) * 0.5);
        //Video is now 100% of the playerElement, so set the playerElement style
        playerElement.style = "top: " + styleTop + "px; left: " + styleLeft + "px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
    } else {
        // Window width is the constraining factor so to keep aspect ratio change height appropriately
        styleWidth = window.innerWidth;
        styleHeight = Math.floor(window.innerWidth * videoAspectRatio);
        styleTop = Math.floor((window.innerHeight - styleHeight) * 0.5);
        styleLeft = 0;
        //Video is now 100% of the playerElement, so set the playerElement style
        playerElement.style = "top: " + styleTop + "px; left: " + styleLeft + "px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
    }
}

function resizePlayerStyleToActualSize(playerElement) {
    let videoElement = playerElement.getElementsByTagName("VIDEO");

    if (videoElement.length > 0) {
        // Display image in its actual size
        styleWidth = videoElement[0].videoWidth;
        styleHeight = videoElement[0].videoHeight;
        let Top = Math.floor((window.innerHeight - styleHeight) * 0.5);
        let Left = Math.floor((window.innerWidth - styleWidth) * 0.5);
        styleTop = (Top > 0) ? Top : 0;
        styleLeft = (Left > 0) ? Left : 0;
        //Video is now 100% of the playerElement, so set the playerElement style
        playerElement.style = "top: " + styleTop + "px; left: " + styleLeft + "px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
    }
}

function resizePlayerStyleToArbitrarySize(playerElement) {
    let videoElement = playerElement.getElementsByTagName("VIDEO");
    //Video is now 100% of the playerElement, so set the playerElement style
    playerElement.style = "top: 0px; left: 0px; width: " + styleWidth + "px; height: " + styleHeight + "px; cursor: " + styleCursor + "; " + styleAdditional;
}

function setupFreezeFrameOverlay() {
    freezeFrameOverlay = document.createElement('div');
    freezeFrameOverlay.id = 'freezeFrameOverlay';
    freezeFrameOverlay.style.display = 'none';
    freezeFrameOverlay.style.pointerEvents = 'none';
    freezeFrameOverlay.style.position = 'absolute';
    freezeFrameOverlay.style.zIndex = '20';

    let freezeFrameImage = document.createElement('img');
    freezeFrameImage.style.position = 'absolute';
    freezeFrameOverlay.appendChild(freezeFrameImage);
}

function showFreezeFrameOverlay() {
    if (freezeFrame.valid) {
        freezeFrameOverlay.classList.add("freezeframeBackground");
        freezeFrameOverlay.style.display = 'block';
    }
}

function invalidateFreezeFrameOverlay() {
    freezeFrameOverlay.style.display = 'none';
    freezeFrame.valid = false;
    freezeFrameOverlay.classList.remove("freezeframeBackground");

    if (webRtcPlayerObj) {
        webRtcPlayerObj.setVideoEnabled(true);
    }
}

function resizeFreezeFrameOverlay() {
    if (freezeFrame.width !== 0 && freezeFrame.height !== 0) {
        let displayWidth = 0;
        let displayHeight = 0;
        let displayTop = 0;
        let displayLeft = 0;
        let checkBox = document.getElementById('enlarge-display-to-fill-window-tgl');
        let playerElement = document.getElementById('player');
        if (checkBox !== null && checkBox.checked) {
            // We are fitting video to screen, we care about the screen (window) size
            let windowAspectRatio = window.innerWidth / window.innerHeight;
            let videoAspectRatio = freezeFrame.width / freezeFrame.height;
            if (windowAspectRatio < videoAspectRatio) {
                displayWidth = window.innerWidth;
                displayHeight = Math.floor(window.innerWidth / videoAspectRatio);
                displayTop = Math.floor((window.innerHeight - displayHeight) * 0.5);
                displayLeft = 0;
            } else {
                displayWidth = Math.floor(window.innerHeight * videoAspectRatio);
                displayHeight = window.innerHeight;
                displayTop = 0;
                displayLeft = Math.floor((window.innerWidth - displayWidth) * 0.5);
            }
        } else {
            // Video is coming in at native resolution, we care more about the player size
            let playerAspectRatio = playerElement.offsetWidth / playerElement.offsetHeight;
            let videoAspectRatio = freezeFrame.width / freezeFrame.height;
            if (playerAspectRatio < videoAspectRatio) {
                displayWidth = playerElement.offsetWidth;
                displayHeight = Math.floor(playerElement.offsetWidth / videoAspectRatio);
                displayTop = Math.floor((playerElement.offsetHeight - displayHeight) * 0.5);
                displayLeft = 0;
            } else {
                displayWidth = Math.floor(playerElement.offsetHeight * videoAspectRatio);
                displayHeight = playerElement.offsetHeight;
                displayTop = 0;
                displayLeft = Math.floor((playerElement.offsetWidth - displayWidth) * 0.5);
            }
        }
        let freezeFrameImage = document.getElementById("freezeFrameOverlay").childNodes[0];
        freezeFrameOverlay.style.width = playerElement.offsetWidth + 'px';
        freezeFrameOverlay.style.height = playerElement.offsetHeight + 'px';
        freezeFrameOverlay.style.left = 0 + 'px';
        freezeFrameOverlay.style.top = 0 + 'px';

        freezeFrameImage.style.width = displayWidth + 'px';
        freezeFrameImage.style.height = displayHeight + 'px';
        freezeFrameImage.style.left = displayLeft + 'px';
        freezeFrameImage.style.top = displayTop + 'px';
    }
}

function resizePlayerStyle(event) {
    let playerElement = document.getElementById('player');

    if (!playerElement)
        return;

    updateVideoStreamSize();

    if (playerElement.classList.contains('fixed-size')) {
        setupMouseAndFreezeFrame(playerElement)
        return;
    }


    let checkBox = document.getElementById('enlarge-display-to-fill-window-tgl');
    let windowSmallerThanPlayer = window.innerWidth < playerElement.videoWidth || window.innerHeight < playerElement.videoHeight;
    if (checkBox !== null) {
        if (checkBox.checked || windowSmallerThanPlayer) {
            resizePlayerStyleToFillWindow(playerElement);
        } else {
            resizePlayerStyleToActualSize(playerElement);
        }
    } else {
        resizePlayerStyleToArbitrarySize(playerElement);
    }

    setupMouseAndFreezeFrame(playerElement)
}

function setupMouseAndFreezeFrame(playerElement) {
    // Calculating and normalizing positions depends on the width and height of
    // the player.
    playerElementClientRect = playerElement.getBoundingClientRect();
    setupNormalizeAndQuantize();
    resizeFreezeFrameOverlay();
}

function updateVideoStreamSize() {
    if (!matchViewportResolution) {
        return;
    }

    let now = new Date().getTime();
    if (now - lastTimeResized > 1000) {
        let playerElement = document.getElementById('player');
        if (!playerElement)
            return;

        let descriptor = {
            ConsoleCommand: 'setres ' + playerElement.clientWidth + 'x' + playerElement.clientHeight
        };
        emitCommand(descriptor);
        console.log(descriptor);
        lastTimeResized = new Date().getTime();
    } else {
        console.log('Resizing too often - skipping');
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateVideoStreamSize, 1000);
    }
}

// Fix for bug in iOS where windowsize is not correct at instance or orientation change
// https://github.com/dimsemenov/PhotoSwipe/issues/1315
let _orientationChangeTimeout;

function onOrientationChange(event) {
    clearTimeout(_orientationChangeTimeout);
    _orientationChangeTimeout = setTimeout(function () {
        resizePlayerStyle();
    }, 500);
}

// Must be kept in sync with PixelStreamingProtocol::EToUE4Msg C++ enum.
const MessageType = {

    /**********************************************************************/

    /*
     * Control Messages. Range = 0..49.
     */
    IFrameRequest: 0,
    RequestQualityControl: 1,
    FpsRequest: 2,
    AverageBitrateRequest: 3,
    StartStreaming: 4,
    StopStreaming: 5,
    LatencyTest: 6,
    RequestInitialSettings: 7,

    /**********************************************************************/

    /*
     * Input Messages. Range = 50..89.
     */

    // Generic Input Messages. Range = 50..59.
    UIInteraction: 50,
    Command: 51,

    // Keyboard Input Message. Range = 60..69.
    KeyDown: 60,
    KeyUp: 61,
    KeyPress: 62,

    // Mouse Input Messages. Range = 70..79.
    MouseEnter: 70,
    MouseLeave: 71,
    MouseDown: 72,
    MouseUp: 73,
    MouseMove: 74,
    MouseWheel: 75,

    // Touch Input Messages. Range = 80..89.
    TouchStart: 80,
    TouchEnd: 81,
    TouchMove: 82,

    // Gamepad Input Messages. Range = 90..99
    GamepadButtonPressed: 90,
    GamepadButtonReleased: 91,
    GamepadAnalog: 92

    /**************************************************************************/
};

// A generic message has a type and a descriptor.
function emitDescriptor(messageType, descriptor) {
    // Convert the dscriptor object into a JSON string.
    let descriptorAsString = JSON.stringify(descriptor);

    // Add the UTF-16 JSON string to the array byte buffer, going two bytes at
    // a time.
    let data = new DataView(new ArrayBuffer(1 + 2 + 2 * descriptorAsString.length));
    let byteIdx = 0;
    data.setUint8(byteIdx, messageType);
    byteIdx++;
    data.setUint16(byteIdx, descriptorAsString.length, true);
    byteIdx += 2;
    for (let i = 0; i < descriptorAsString.length; i++) {
        data.setUint16(byteIdx, descriptorAsString.charCodeAt(i), true);
        byteIdx += 2;
    }
    sendInputData(data.buffer);
}

// A UI interation will occur when the user presses a button powered by
// JavaScript as opposed to pressing a button which is part of the pixel
// streamed UI from the UE4 client.
function emitUIInteraction(descriptor) {
    emitDescriptor(MessageType.UIInteraction, descriptor);
}

// A build-in command can be sent to UE4 client. The commands are defined by a
// JSON descriptor and will be executed automatically.
// The currently supported commands are:
//
// 1. A command to run any console command:
//    "{ ConsoleCommand: <string> }"
//
// 2. A command to change the resolution to the given width and height.
//    "{ Resolution.Width: <value>, Resolution.Height: <value> } }"
//
function emitCommand(descriptor) {
    emitDescriptor(MessageType.Command, descriptor);
}

function requestInitialSettings() {
    sendInputData(new Uint8Array([MessageType.RequestInitialSettings]).buffer);
}

function requestQualityControl() {
    if (!qualityController) {
        sendInputData(new Uint8Array([MessageType.RequestQualityControl]).buffer);
    }
}

let playerElementClientRect = undefined;
let normalizeAndQuantizeUnsigned = undefined;
let normalizeAndQuantizeSigned = undefined;
let unquantizeAndDenormalizeUnsigned = undefined;

function setupNormalizeAndQuantize() {
    let playerElement = document.getElementById('player');
    let videoElement = playerElement.getElementsByTagName("video");

    if (playerElement && videoElement.length > 0) {
        let playerAspectRatio = playerElement.clientHeight / playerElement.clientWidth;
        let videoAspectRatio = videoElement[0].videoHeight / videoElement[0].videoWidth;

        // Unsigned XY positions are the ratio (0.0..1.0) along a viewport axis,
        // quantized into an uint16 (0..65536).
        // Signed XY deltas are the ratio (-1.0..1.0) along a viewport axis,
        // quantized into an int16 (-32767..32767).
        // This allows the browser viewport and client viewport to have a different
        // size.
        // Hack: Currently we set an out-of-range position to an extreme (65535)
        // as we can't yet accurately detect mouse enter and leave events
        // precisely inside a video with an aspect ratio which causes mattes.
        if (playerAspectRatio > videoAspectRatio) {
            if (print_inputs) {
                console.log('Setup Normalize and Quantize for playerAspectRatio > videoAspectRatio');
            }
            let ratio = playerAspectRatio / videoAspectRatio;
            // Unsigned.
            normalizeAndQuantizeUnsigned = (x, y) => {
                let normalizedX = x / playerElement.clientWidth;
                let normalizedY = ratio * (y / playerElement.clientHeight - 0.5) + 0.5;
                if (normalizedX < 0.0 || normalizedX > 1.0 || normalizedY < 0.0 || normalizedY > 1.0) {
                    return {
                        inRange: false,
                        x: 65535,
                        y: 65535
                    };
                } else {
                    return {
                        inRange: true,
                        x: normalizedX * 65536,
                        y: normalizedY * 65536
                    };
                }
            };
            unquantizeAndDenormalizeUnsigned = (x, y) => {
                let normalizedX = x / 65536;
                let normalizedY = (y / 65536 - 0.5) / ratio + 0.5;
                return {
                    x: normalizedX * playerElement.clientWidth,
                    y: normalizedY * playerElement.clientHeight
                };
            };
            // Signed.
            normalizeAndQuantizeSigned = (x, y) => {
                let normalizedX = x / (0.5 * playerElement.clientWidth);
                let normalizedY = (ratio * y) / (0.5 * playerElement.clientHeight);
                return {
                    x: normalizedX * 32767,
                    y: normalizedY * 32767
                };
            };
        } else {
            if (print_inputs) {
                console.log('Setup Normalize and Quantize for playerAspectRatio <= videoAspectRatio');
            }
            let ratio = videoAspectRatio / playerAspectRatio;
            // Unsigned.
            normalizeAndQuantizeUnsigned = (x, y) => {
                let normalizedX = ratio * (x / playerElement.clientWidth - 0.5) + 0.5;
                let normalizedY = y / playerElement.clientHeight;
                if (normalizedX < 0.0 || normalizedX > 1.0 || normalizedY < 0.0 || normalizedY > 1.0) {
                    return {
                        inRange: false,
                        x: 65535,
                        y: 65535
                    };
                } else {
                    return {
                        inRange: true,
                        x: normalizedX * 65536,
                        y: normalizedY * 65536
                    };
                }
            };
            unquantizeAndDenormalizeUnsigned = (x, y) => {
                let normalizedX = (x / 65536 - 0.5) / ratio + 0.5;
                let normalizedY = y / 65536;
                return {
                    x: normalizedX * playerElement.clientWidth,
                    y: normalizedY * playerElement.clientHeight
                };
            };
            // Signed.
            normalizeAndQuantizeSigned = (x, y) => {
                let normalizedX = (ratio * x) / (0.5 * playerElement.clientWidth);
                let normalizedY = y / (0.5 * playerElement.clientHeight);
                return {
                    x: normalizedX * 32767,
                    y: normalizedY * 32767
                };
            };
        }
    }
}

function emitMouseMove(x, y, deltaX, deltaY) {
    if (print_inputs) {
        console.log(`x: ${x}, y:${y}, dX: ${deltaX}, dY: ${deltaY}`);
    }
    let coord = normalizeAndQuantizeUnsigned(x, y);
    let delta = normalizeAndQuantizeSigned(deltaX, deltaY);
    let Data = new DataView(new ArrayBuffer(9));
    Data.setUint8(0, MessageType.MouseMove);
    Data.setUint16(1, coord.x, true);
    Data.setUint16(3, coord.y, true);
    Data.setInt16(5, delta.x, true);
    Data.setInt16(7, delta.y, true);
    sendInputData(Data.buffer);
}

function emitMouseDown(button, x, y) {
    if (print_inputs) {
        console.log(`mouse button ${button} down at (${x}, ${y})`);
    }
    let coord = normalizeAndQuantizeUnsigned(x, y);
    let Data = new DataView(new ArrayBuffer(6));
    Data.setUint8(0, MessageType.MouseDown);
    Data.setUint8(1, button);
    Data.setUint16(2, coord.x, true);
    Data.setUint16(4, coord.y, true);
    sendInputData(Data.buffer);
}

function emitMouseUp(button, x, y) {
    if (print_inputs) {
        console.log(`mouse button ${button} up at (${x}, ${y})`);
    }
    let coord = normalizeAndQuantizeUnsigned(x, y);
    let Data = new DataView(new ArrayBuffer(6));
    Data.setUint8(0, MessageType.MouseUp);
    Data.setUint8(1, button);
    Data.setUint16(2, coord.x, true);
    Data.setUint16(4, coord.y, true);
    sendInputData(Data.buffer);
}

function emitMouseWheel(delta, x, y) {
    if (print_inputs) {
        console.log(`mouse wheel with delta ${delta} at (${x}, ${y})`);
    }
    let coord = normalizeAndQuantizeUnsigned(x, y);
    let Data = new DataView(new ArrayBuffer(7));
    Data.setUint8(0, MessageType.MouseWheel);
    Data.setInt16(1, delta, true);
    Data.setUint16(3, coord.x, true);
    Data.setUint16(5, coord.y, true);
    sendInputData(Data.buffer);
}

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const MouseButton = {
    MainButton: 0, // Left button.
    AuxiliaryButton: 1, // Wheel button.
    SecondaryButton: 2, // Right button.
    FourthButton: 3, // Browser Back button.
    FifthButton: 4 // Browser Forward button.
};

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
const MouseButtonsMask = {
    PrimaryButton: 1, // Left button.
    SecondaryButton: 2, // Right button.
    AuxiliaryButton: 4, // Wheel button.
    FourthButton: 8, // Browser Back button.
    FifthButton: 16 // Browser Forward button.
};

// If the user has any mouse buttons pressed then release them.
function releaseMouseButtons(buttons, x, y) {
    if (buttons & MouseButtonsMask.PrimaryButton) {
        emitMouseUp(MouseButton.MainButton, x, y);
    }
    if (buttons & MouseButtonsMask.SecondaryButton) {
        emitMouseUp(MouseButton.SecondaryButton, x, y);
    }
    if (buttons & MouseButtonsMask.AuxiliaryButton) {
        emitMouseUp(MouseButton.AuxiliaryButton, x, y);
    }
    if (buttons & MouseButtonsMask.FourthButton) {
        emitMouseUp(MouseButton.FourthButton, x, y);
    }
    if (buttons & MouseButtonsMask.FifthButton) {
        emitMouseUp(MouseButton.FifthButton, x, y);
    }
}

// If the user has any mouse buttons pressed then press them again.
function pressMouseButtons(buttons, x, y) {
    if (buttons & MouseButtonsMask.PrimaryButton) {
        emitMouseDown(MouseButton.MainButton, x, y);
    }
    if (buttons & MouseButtonsMask.SecondaryButton) {
        emitMouseDown(MouseButton.SecondaryButton, x, y);
    }
    if (buttons & MouseButtonsMask.AuxiliaryButton) {
        emitMouseDown(MouseButton.AuxiliaryButton, x, y);
    }
    if (buttons & MouseButtonsMask.FourthButton) {
        emitMouseDown(MouseButton.FourthButton, x, y);
    }
    if (buttons & MouseButtonsMask.FifthButton) {
        emitMouseDown(MouseButton.FifthButton, x, y);
    }
}

function registerInputs(playerElement) {
    if (!playerElement)
        return;

    registerMouseEnterAndLeaveEvents(playerElement);
    registerTouchEvents(playerElement);
}

function createOnScreenKeyboardHelpers(htmlElement) {
    if (document.getElementById('hiddenInput') === null) {
        hiddenInput = document.createElement('input');
        hiddenInput.id = 'hiddenInput';
        hiddenInput.maxLength = 0;
        htmlElement.appendChild(hiddenInput);
    }

    if (document.getElementById('editTextButton') === null) {
        editTextButton = document.createElement('button');
        editTextButton.id = 'editTextButton';
        editTextButton.innerHTML = 'edit text';
        htmlElement.appendChild(editTextButton);

        // Hide the 'edit text' button.
        editTextButton.classList.add('hiddenState');

        editTextButton.addEventListener('click', function () {
            // Show the on-screen keyboard.
            hiddenInput.focus();
        });
    }
}

function showOnScreenKeyboard(command) {
    if (command.showOnScreenKeyboard) {
        // Show the 'edit text' button.
        editTextButton.classList.remove('hiddenState');
        // Place the 'edit text' button near the UE4 input widget.
        let pos = unquantizeAndDenormalizeUnsigned(command.x, command.y);
        editTextButton.style.top = pos.y.toString() + 'px';
        editTextButton.style.left = (pos.x - 40).toString() + 'px';
    } else {
        // Hide the 'edit text' button.
        editTextButton.classList.add('hiddenState');
        // Hide the on-screen keyboard.
        hiddenInput.blur();
    }
}

function registerMouseEnterAndLeaveEvents(playerElement) {
    playerElement.onmouseenter = function (e) {
        if (print_inputs) {
            console.log('mouse enter');
        }
        let Data = new DataView(new ArrayBuffer(1));
        Data.setUint8(0, MessageType.MouseEnter);
        sendInputData(Data.buffer);
        playerElement.pressMouseButtons(e);
    };

    playerElement.onmouseleave = function (e) {
        if (print_inputs) {
            console.log('mouse leave');
        }
        let Data = new DataView(new ArrayBuffer(1));
        Data.setUint8(0, MessageType.MouseLeave);
        sendInputData(Data.buffer);
        playerElement.releaseMouseButtons(e);
    };
}

// A locked mouse works by the user clicking in the browser player and the
// cursor disappears and is locked. The user moves the cursor and the camera
// moves, for example. The user presses escape to free the mouse.
function registerLockedMouseEvents(playerElement) {
    let x = playerElement.width / 2;
    let y = playerElement.height / 2;

    playerElement.requestPointerLock = playerElement.requestPointerLock || playerElement.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

    playerElement.onclick = function () {
        playerElement.requestPointerLock();
    };

    // Respond to lock state change events
    document.addEventListener('pointerlockchange', lockStateChange, false);
    document.addEventListener('mozpointerlockchange', lockStateChange, false);

    function lockStateChange() {
        if (document.pointerLockElement === playerElement ||
            document.mozPointerLockElement === playerElement) {
            console.log('Pointer locked');
            document.addEventListener("mousemove", updatePosition, false);
        } else {
            console.log('The pointer lock status is now unlocked');
            document.removeEventListener("mousemove", updatePosition, false);
        }
    }

    function updatePosition(e) {
        x += e.movementX;
        y += e.movementY;
        if (x > styleWidth) {
            x -= styleWidth;
        }
        if (y > styleHeight) {
            y -= styleHeight;
        }
        if (x < 0) {
            x = styleWidth + x;
        }
        if (y < 0) {
            y = styleHeight - y;
        }
        emitMouseMove(x, y, e.movementX, e.movementY);
    }

    playerElement.onmousedown = function (e) {
        emitMouseDown(e.button, x, y);
    };

    playerElement.onmouseup = function (e) {
        emitMouseUp(e.button, x, y);
    };

    playerElement.onmousewheel = function (e) {
        emitMouseWheel(e.wheelDelta, x, y);
    };

    playerElement.pressMouseButtons = function (e) {
        pressMouseButtons(e.buttons, x, y);
    };

    playerElement.releaseMouseButtons = function (e) {
        releaseMouseButtons(e.buttons, x, y);
    };
}

// A hovering mouse works by the user clicking the mouse button when they want
// the cursor to have an effect over the video. Otherwise the cursor just
// passes over the browser.
function registerHoveringMouseEvents(playerElement) {
    // styleCursor = 'none'; // We will rely on UE4 client's software cursor.
    //styleCursor = 'default';  // Showing cursor

    playerElement.onmousemove = function (e) {
        emitMouseMove(e.offsetX, e.offsetY, e.movementX, e.movementY);
        e.preventDefault();
    };

    playerElement.onmousedown = function (e) {
        emitMouseDown(e.button, e.offsetX, e.offsetY);
        e.preventDefault();
    };

    playerElement.onmouseup = function (e) {
        emitMouseUp(e.button, e.offsetX, e.offsetY);
        e.preventDefault();
    };

    // When the context menu is shown then it is safest to release the button
    // which was pressed when the event happened. This will guarantee we will
    // get at least one mouse up corresponding to a mouse down event. Otherwise
    // the mouse can get stuck.
    // https://github.com/facebook/react/issues/5531
    playerElement.oncontextmenu = function (e) {
        emitMouseUp(e.button, e.offsetX, e.offsetY);
        e.preventDefault();
    };

    if ('onmousewheel' in playerElement) {
        playerElement.onmousewheel = function (e) {
            emitMouseWheel(e.wheelDelta, e.offsetX, e.offsetY);
            e.preventDefault();
        };
    } else {
        playerElement.addEventListener('DOMMouseScroll', function (e) {
            emitMouseWheel(e.detail * -120, e.offsetX, e.offsetY);
            e.preventDefault();
        }, false);
    }

    playerElement.pressMouseButtons = function (e) {
        pressMouseButtons(e.buttons, e.offsetX, e.offsetY);
    };

    playerElement.releaseMouseButtons = function (e) {
        releaseMouseButtons(e.buttons, e.offsetX, e.offsetY);
    };
}

function registerTouchEvents(playerElement) {

    // We need to assign a unique identifier to each finger.
    // We do this by mapping each Touch object to the identifier.
    let fingers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    let fingerIds = {};

    function rememberTouch(touch) {
        let finger = fingers.pop();
        if (finger === undefined) {
            console.log('exhausted touch indentifiers');
        }
        fingerIds[touch.identifier] = finger;
    }

    function forgetTouch(touch) {
        fingers.push(fingerIds[touch.identifier]);
        delete fingerIds[touch.identifier];
    }

    function emitTouchData(type, touches) {
        let data = new DataView(new ArrayBuffer(2 + 7 * touches.length));
        data.setUint8(0, type);
        data.setUint8(1, touches.length);
        let byte = 2;
        for (let t = 0; t < touches.length; t++) {
            let touch = touches[t];
            let x = touch.clientX - playerElement.offsetLeft;
            let y = touch.clientY - playerElement.offsetTop;
            if (print_inputs) {
                console.log(`F${fingerIds[touch.identifier]}=(${x}, ${y})`);
            }
            let coord = normalizeAndQuantizeUnsigned(x, y);
            data.setUint16(byte, coord.x, true);
            byte += 2;
            data.setUint16(byte, coord.y, true);
            byte += 2;
            data.setUint8(byte, fingerIds[touch.identifier], true);
            byte += 1;
            data.setUint8(byte, 255 * touch.force, true); // force is between 0.0 and 1.0 so quantize into byte.
            byte += 1;
            data.setUint8(byte, coord.inRange ? 1 : 0, true); // mark the touch as in the player or not
            byte += 1;
        }

        sendInputData(data.buffer);
    }

    if (inputOptions.fakeMouseWithTouches) {

        let finger = undefined;

        playerElement.ontouchstart = function (e) {
            if (finger === undefined) {
                let firstTouch = e.changedTouches[0];
                finger = {
                    id: firstTouch.identifier,
                    x: firstTouch.clientX - playerElementClientRect.left,
                    y: firstTouch.clientY - playerElementClientRect.top
                };
                // Hack: Mouse events require an enter and leave so we just
                // enter and leave manually with each touch as this event
                // is not fired with a touch device.
                playerElement.onmouseenter(e);
                emitMouseDown(MouseButton.MainButton, finger.x, finger.y);
            }
            e.preventDefault();
        };

        playerElement.ontouchend = function (e) {
            for (let t = 0; t < e.changedTouches.length; t++) {
                let touch = e.changedTouches[t];
                if (touch.identifier === finger.id) {
                    let x = touch.clientX - playerElementClientRect.left;
                    let y = touch.clientY - playerElementClientRect.top;
                    emitMouseUp(MouseButton.MainButton, x, y);
                    // Hack: Manual mouse leave event.
                    playerElement.onmouseleave(e);
                    finger = undefined;
                    break;
                }
            }
            e.preventDefault();
        };

        playerElement.ontouchmove = function (e) {
            for (let t = 0; t < e.touches.length; t++) {
                let touch = e.touches[t];
                if (touch.identifier === finger.id) {
                    let x = touch.clientX - playerElementClientRect.left;
                    let y = touch.clientY - playerElementClientRect.top;
                    emitMouseMove(x, y, x - finger.x, y - finger.y);
                    finger.x = x;
                    finger.y = y;
                    break;
                }
            }
            e.preventDefault();
        };
    } else {
        playerElement.ontouchstart = function (e) {
            // Assign a unique identifier to each touch.
            for (let t = 0; t < e.changedTouches.length; t++) {
                rememberTouch(e.changedTouches[t]);
            }

            if (print_inputs) {
                console.log('touch start');
            }
            emitTouchData(MessageType.TouchStart, e.changedTouches);
            e.preventDefault();
        };

        playerElement.ontouchend = function (e) {
            if (print_inputs) {
                console.log('touch end');
            }
            emitTouchData(MessageType.TouchEnd, e.changedTouches);

            // Re-cycle unique identifiers previously assigned to each touch.
            for (let t = 0; t < e.changedTouches.length; t++) {
                forgetTouch(e.changedTouches[t]);
            }
            e.preventDefault();
        };

        playerElement.ontouchmove = function (e) {
            if (print_inputs) {
                console.log('touch move');
            }
            emitTouchData(MessageType.TouchMove, e.touches);
            e.preventDefault();
        };
    }
}

// Browser keys do not have a charCode so we only need to test keyCode.
function isKeyCodeBrowserKey(keyCode) {
    // Function keys or tab key.
    return keyCode >= 112 && keyCode <= 123 || keyCode === 9;
}

// Must be kept in sync with JavaScriptKeyCodeToFKey C++ array. The index of the
// entry in the array is the special key code given below.
const SpecialKeyCodes = {
    BackSpace: 8,
    Shift: 16,
    Control: 17,
    Alt: 18,
    RightShift: 253,
    RightControl: 254,
    RightAlt: 255
};

// We want to be able to differentiate between left and right versions of some
// keys.
function getKeyCode(e) {
    if (e.keyCode === SpecialKeyCodes.Shift && e.code === 'ShiftRight') return SpecialKeyCodes.RightShift;
    else if (e.keyCode === SpecialKeyCodes.Control && e.code === 'ControlRight') return SpecialKeyCodes.RightControl;
    else if (e.keyCode === SpecialKeyCodes.Alt && e.code === 'AltRight') return SpecialKeyCodes.RightAlt;
    else return e.keyCode;
}

function registerKeyboardEvents() {
    document.onkeydown = function (e) {
        if (print_inputs) {
            console.log(`key down ${e.keyCode}, repeat = ${e.repeat}`);
        }
        sendInputData(new Uint8Array([MessageType.KeyDown, getKeyCode(e), e.repeat]).buffer);
        // Backspace is not considered a keypress in JavaScript but we need it
        // to be so characters may be deleted in a UE4 text entry field.
        if (e.keyCode === SpecialKeyCodes.BackSpace) {
            document.onkeypress({
                charCode: SpecialKeyCodes.BackSpace
            });
        }
        if (inputOptions.suppressBrowserKeys && isKeyCodeBrowserKey(e.keyCode)) {
            e.preventDefault();
        }
    };

    document.onkeyup = function (e) {
        if (print_inputs) {
            console.log(`key up ${e.keyCode}`);
        }
        sendInputData(new Uint8Array([MessageType.KeyUp, getKeyCode(e)]).buffer);
        if (inputOptions.suppressBrowserKeys && isKeyCodeBrowserKey(e.keyCode)) {
            e.preventDefault();
        }
    };

    document.onkeypress = function (e) {
        if (print_inputs) {
            console.log(`key press ${e.charCode}`);
        }
        let data = new DataView(new ArrayBuffer(3));
        data.setUint8(0, MessageType.KeyPress);
        data.setUint16(1, e.charCode, true);
        sendInputData(data.buffer);
    };
}

function onExpandOverlay_Click( /* e */) {
    let overlay = document.getElementById('overlay');
    overlay.classList.toggle("overlay-shown");
}

function start() {
    // update "quality status" to "disconnected" state

    if (!connect_on_load || is_reconnection) {
        showConnectOverlay();
        invalidateFreezeFrameOverlay();
        shouldShowPlayOverlay = true;
        resizePlayerStyle();
    } else {
        connect();
    }
}

function connect() {
    "use strict";

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        alert('Your browser doesn\'t support WebSocket');
        return;
    }

    ws = new WebSocket('ws://' + signalServer);

    ws.onmessage = function (event) {
        let msg = JSON.parse(event.data);
        if (msg.type === 'config') {
            console.log("%c[Inbound SS (config)]", "background: lightblue; color: black", msg);
            onConfig(msg);
        } else if (msg.type === 'playerCount') {
            console.log("%c[Inbound SS (playerCount)]", "background: lightblue; color: black", msg);
        } else if (msg.type === 'offer') {
            console.log("%c[Inbound SS (offer)]", "background: lightblue; color: black", msg);
            onWebRtcOffer(msg);
        } else if (msg.type === 'answer') {
            console.log("%c[Inbound SS (answer)]", "background: lightblue; color: black", msg);
            onWebRtcAnswer(msg);
        } else if (msg.type === 'iceCandidate') {
            onWebRtcIce(msg.candidate);
        } else if (msg.type === 'warning' && msg.warning) {
            console.warn(msg.warning);
        } else {
            console.error("Invalid SS message type", msg.type);
        }
    };

    ws.onerror = function (event) {
        console.log(`WS error: ${JSON.stringify(event)}`);
    };

    ws.onclose = function (event) {
        console.log(`WS closed: ${JSON.stringify(event.code)} - ${event.reason}`);
        ws = undefined;
        is_reconnection = true;

        // destroy `webRtcPlayerObj` if any
        let playerDiv = document.getElementById('player');
        if (webRtcPlayerObj) {
            playerDiv.removeChild(webRtcPlayerObj.video);
            webRtcPlayerObj.close();
            webRtcPlayerObj = undefined;
        }

        showTextOverlay(`Disconnected: ${event.reason}`);
        let reclickToStart = setTimeout(start, 4000);
    };
}

// Config data received from WebRTC sender via the Cirrus web server
function onConfig(config) {
    let playerDiv = document.getElementById('player');
    let playerElement = setupWebRtcPlayer(playerDiv, config);
    resizePlayerStyle();

    switch (inputOptions.controlScheme) {
        case ControlSchemeType.HoveringMouse:
            registerHoveringMouseEvents(playerElement);
            break;
        case ControlSchemeType.LockedMouse:
            registerLockedMouseEvents(playerElement);
            break;
        default:
            console.log(`ERROR: Unknown control scheme ${inputOptions.controlScheme}`);
            registerLockedMouseEvents(playerElement);
            break;
    }
}
var signalServer = 'localhost:80';
onDataChannelConnected = null;
function load() {
    setupHtmlEvents();
    setupFreezeFrameOverlay();
    registerKeyboardEvents();
    start();
}

// 前端发消息给后端，并监听返回
export function api_send(proto, data, callback) {
    let jsonData = { command: 'event', func_name: proto, args: data };
    if (bLog) {
        console.log('send:', jsonData);
    }
    //
    responseEventListeners.set(proto, callback);
    //
    emitUIInteraction(jsonData);
}

function onResponse(response) {
    console.log(typeof (response));
    if (bLog) {
        console.log('recv:', response);
    }
    let jsonData = JSON.parse(response);

    if (jsonData.command !== 'event') {
        console.log('unexpected response:', response);
        return;
    }

    let proto = jsonData.func_name;
    let callback = responseEventListeners.get(proto);
    if (callback) {
        //let args = JSON.parse(jsonData.args);
        callback(jsonData.args);
        // responseEventListeners.delete(proto);
    }
}

// 监听从后端直接发送过来的消息
export function api_register(proto, callback) {
    responseEventListeners.set(proto, callback);
}
export function api_unregister(proto) {
    responseEventListeners.delete(proto);
}
export function app_load(signalServerAddr, onFinish) {
    console.log('ws to signal server: ', signalServerAddr);
    signalServer = signalServerAddr;
    onDataChannelConnected = onFinish;
    load();
}
export function app_load2(url, onFinish) {
    ajax({
        path: url,
        method: 'get',
    }).then((res) => {
        if (res && res.data) {
            app_load(res.data, onFinish)
        }
    })
}

export function app_load3(url, option, onFinish) {
    afk = { ...afk, ...option }
    ajax({
        path: url,
        method: 'get',
    }).then((res) => {
        if (res && res.data) {
            app_load(res.data, onFinish)
        }
    })
}