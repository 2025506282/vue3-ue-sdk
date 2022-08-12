function _regeneratorRuntime() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */

  _regeneratorRuntime = function () {
    return exports;
  };

  var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }

  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
    return generator._invoke = function (innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");

        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }

        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);

          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }

          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }(innerFn, self, context), generator;
  }

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  exports.wrap = wrap;
  var ContinueSentinel = {};

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {}

  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if ("throw" !== record.type) {
        var result = record.arg,
            value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }

      reject(record.arg);
    }

    var previousPromise;

    this._invoke = function (method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    };
  }

  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (undefined === method) {
      if (context.delegate = null, "throw" === context.method) {
        if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }

  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;

          return next.value = undefined, next.done = !0, next;
        };

        return next.next = next;
      }
    }

    return {
      next: doneResult
    };
  }

  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }

  return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (object) {
    var keys = [];

    for (var key in object) keys.push(key);

    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }

      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;

      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
            record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      }

      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function webRtcPlayer(parOptions) {
    parOptions = typeof parOptions !== 'undefined' ? parOptions : {};
    var self = this;
    var urlParams = new URLSearchParams(window.location.search);
    this.cfg = typeof parOptions.peerConnectionOptions !== 'undefined' ? parOptions.peerConnectionOptions : {};
    this.cfg.sdpSemantics = 'unified-plan';
    this.cfg.offerExtmapAllowMixed = false;
    this.forceTURN = urlParams.has('ForceTURN');
    if (this.forceTURN) {
        console.log('Forcing TURN usage by setting ICE Transport Policy in peer connection config.');
        this.cfg.iceTransportPolicy = 'relay';
    }
    this.cfg.bundlePolicy = 'balanced';
    this.forceMaxBundle = urlParams.has('ForceMaxBundle');
    if (this.forceMaxBundle) {
        this.cfg.bundlePolicy = 'max-bundle';
    }
    this.pcClient = null;
    this.dcClient = null;
    this.tnClient = null;
    this.sdpConstraints = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
        voiceActivityDetection: false
    };
    this.dataChannelOptions = { ordered: true };
    this.startVideoMuted = typeof parOptions.startVideoMuted !== 'undefined' ? parOptions.startVideoMuted : false;
    this.autoPlayAudio = typeof parOptions.autoPlayAudio !== 'undefined' ? parOptions.autoPlayAudio : true;
    this.useMic = urlParams.has('useMic');
    if (!this.useMic) {
        console.log('Microphone access is not enabled. Pass ?useMic in the url to enable it.');
    }
    var isLocalhostConnection = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    var isHttpsConnection = location.protocol === 'https:';
    if (this.useMic && !isLocalhostConnection && !isHttpsConnection) {
        this.useMic = false;
        console.error('Microphone access in the browser will not work if you are not on HTTPS or localhost. Disabling mic access.');
        console.error('For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling \'unsafely-treat-insecure-origin-as-secure\'');
    }
    this.preferSFU = urlParams.has('preferSFU');
    console.log(this.preferSFU ? 'The browser will signal it would prefer an SFU connection. Remove ?preferSFU from the url to signal for P2P usage.' : 'The browser will signal for a P2P connection. Pass ?preferSFU in the url to signal for SFU usage.');
    this.latencyTestTimings = {
        TestStartTimeMs: null,
        UEReceiptTimeMs: null,
        UEEncodeMs: null,
        UECaptureToSendMs: null,
        UETransmissionTimeMs: null,
        BrowserReceiptTimeMs: null,
        FrameDisplayDeltaTimeMs: null,
        Reset: function Reset() {
            this.TestStartTimeMs = null;
            this.UEReceiptTimeMs = null;
            this.UEEncodeMs = null, this.UECaptureToSendMs = null, this.UETransmissionTimeMs = null;
            this.BrowserReceiptTimeMs = null;
            this.FrameDisplayDeltaTimeMs = null;
        },
        SetUETimings: function SetUETimings(UETimings) {
            this.UEReceiptTimeMs = UETimings.ReceiptTimeMs;
            this.UEEncodeMs = UETimings.EncodeMs, this.UECaptureToSendMs = UETimings.CaptureToSendMs, this.UETransmissionTimeMs = UETimings.TransmissionTimeMs;
            this.BrowserReceiptTimeMs = Date.now();
            this.OnAllLatencyTimingsReady(this);
        },
        SetFrameDisplayDeltaTime: function SetFrameDisplayDeltaTime(DeltaTimeMs) {
            if (this.FrameDisplayDeltaTimeMs == null) {
                this.FrameDisplayDeltaTimeMs = Math.round(DeltaTimeMs);
                this.OnAllLatencyTimingsReady(this);
            }
        },
        OnAllLatencyTimingsReady: function OnAllLatencyTimingsReady(Timings) {
        }
    };
    this.createWebRtcVideo = function () {
        var video = document.getElementById('streamingVideo');
        video.muted = 'muted';
        video.addEventListener('loadedmetadata', function (e) {
            if (self.onVideoInitialised) {
                self.onVideoInitialised();
            }
        }, true);
        if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
            var onVideoFrameReady = function onVideoFrameReady(now, metadata) {
                if (metadata.receiveTime && metadata.expectedDisplayTime) {
                    var receiveToCompositeMs = metadata.presentationTime - metadata.receiveTime;
                    self.aggregatedStats.receiveToCompositeMs = receiveToCompositeMs;
                }
                video.requestVideoFrameCallback(onVideoFrameReady);
            };
            video.requestVideoFrameCallback(onVideoFrameReady);
        }
        return video;
    };
    this.video = this.createWebRtcVideo();
    this.availableVideoStreams = new Map();
    var onsignalingstatechange = function onsignalingstatechange(state) {
        console.info('Signaling state change. |', state.srcElement.signalingState, '|');
    };
    var oniceconnectionstatechange = function oniceconnectionstatechange(state) {
        console.info('Browser ICE connection |', state.srcElement.iceConnectionState, '|');
    };
    var onicegatheringstatechange = function onicegatheringstatechange(state) {
        console.info('Browser ICE gathering |', state.srcElement.iceGatheringState, '|');
    };
    var handleOnTrack = function handleOnTrack(e) {
        if (e.track) {
            console.log('Got track. | Kind=' + e.track.kind + ' | Id=' + e.track.id + ' | readyState=' + e.track.readyState + ' |');
        }
        if (e.track.kind == 'audio') {
            handleOnAudioTrack(e.streams[0]);
            return;
        } else
            e.track.kind == 'video';
        {
            var _iterator = _createForOfIteratorHelper(e.streams), _step;
            try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    var s = _step.value;
                    if (!self.availableVideoStreams.has(s.id)) {
                        self.availableVideoStreams.set(s.id, s);
                    }
                }
            } catch (err) {
                _iterator.e(err);
            } finally {
                _iterator.f();
            }
            self.video.srcObject = e.streams[0];
            e.track.onunmute = function () {
                self.video.srcObject = e.streams[0];
                self.onNewVideoTrack(e.streams);
            };
        }
    };
    var handleOnAudioTrack = function handleOnAudioTrack(audioMediaStream) {
        if (self.video.srcObject == audioMediaStream) {
            return;
        } else if (self.video.srcObject && self.video.srcObject !== audioMediaStream) {
            var audioElem = document.createElement('Audio');
            audioElem.srcObject = audioMediaStream;
            if (!self.autoPlayAudio) {
                var clickToPlayAudio = function clickToPlayAudio() {
                    audioElem.play();
                    self.video.removeEventListener('click', clickToPlayAudio);
                };
                self.video.addEventListener('click', clickToPlayAudio);
            } else {
                audioElem.play();
            }
            console.log('Created new audio element to play seperate audio stream.');
        }
    };
    var onDataChannel = function onDataChannel(dataChannelEvent) {
        console.log('Data channel created for us by browser as we are a receiving peer.');
        self.dcClient = dataChannelEvent.channel;
        setupDataChannelCallbacks(self.dcClient);
    };
    var createDataChannel = function createDataChannel(pc, label, options) {
        var datachannel = pc.createDataChannel(label, options);
        console.log('Created datachannel ('.concat(label, ')'));
        setupDataChannelCallbacks(datachannel);
        return datachannel;
    };
    var setupDataChannelCallbacks = function setupDataChannelCallbacks(datachannel) {
        try {
            datachannel.binaryType = 'arraybuffer';
            datachannel.onopen = function (e) {
                console.log('Data channel connected');
                if (self.onDataChannelConnected) {
                    self.onDataChannelConnected();
                }
            };
            datachannel.onclose = function (e) {
                console.log('Data channel connected', e);
            };
            datachannel.onmessage = function (e) {
                if (self.onDataChannelMessage) {
                    self.onDataChannelMessage(e.data);
                }
            };
            datachannel.onerror = function (e) {
                console.error('Data channel error', e);
            };
            return datachannel;
        } catch (e) {
            console.warn('No data channel', e);
            return null;
        }
    };
    var onicecandidate = function onicecandidate(e) {
        var candidate = e.candidate;
        if (candidate && candidate.candidate) {
            console.log('%c[Browser ICE candidate]', 'background: violet; color: black', '| Type=', candidate.type, '| Protocol=', candidate.protocol, '| Address=', candidate.address, '| Port=', candidate.port, '|');
            self.onWebRtcCandidate(candidate);
        }
    };
    var handleCreateOffer = function handleCreateOffer(pc) {
        pc.createOffer(self.sdpConstraints).then(function (offer) {
            mungeSDPOffer(offer);
            pc.setLocalDescription(offer);
            if (self.onWebRtcOffer) {
                self.onWebRtcOffer(offer);
            }
        }, function () {
            console.warn('Couldn\'t create offer');
        });
    };
    var mungeSDPOffer = function mungeSDPOffer(offer) {
        offer.sdp = offer.sdp.replace('useinbandfec=1', 'useinbandfec=1;stereo=1;sprop-maxcapturerate=48000');
    };
    var setupPeerConnection = function setupPeerConnection(pc) {
        pc.onsignalingstatechange = onsignalingstatechange;
        pc.oniceconnectionstatechange = oniceconnectionstatechange;
        pc.onicegatheringstatechange = onicegatheringstatechange;
        pc.ontrack = handleOnTrack;
        pc.onicecandidate = onicecandidate;
        pc.ondatachannel = onDataChannel;
    };
    var generateAggregatedStatsFunction = function generateAggregatedStatsFunction() {
        if (!self.aggregatedStats)
            self.aggregatedStats = {};
        return function (stats) {
            var newStat = {};
            stats.forEach(function (stat) {
                if (stat.type == 'inbound-rtp' && !stat.isRemote && (stat.mediaType == 'video' || stat.id.toLowerCase().includes('video'))) {
                    newStat.timestamp = stat.timestamp;
                    newStat.bytesReceived = stat.bytesReceived;
                    newStat.framesDecoded = stat.framesDecoded;
                    newStat.packetsLost = stat.packetsLost;
                    newStat.bytesReceivedStart = self.aggregatedStats && self.aggregatedStats.bytesReceivedStart ? self.aggregatedStats.bytesReceivedStart : stat.bytesReceived;
                    newStat.framesDecodedStart = self.aggregatedStats && self.aggregatedStats.framesDecodedStart ? self.aggregatedStats.framesDecodedStart : stat.framesDecoded;
                    newStat.timestampStart = self.aggregatedStats && self.aggregatedStats.timestampStart ? self.aggregatedStats.timestampStart : stat.timestamp;
                    if (self.aggregatedStats && self.aggregatedStats.timestamp) {
                        if (self.aggregatedStats.bytesReceived) {
                            newStat.bitrate = 8 * (newStat.bytesReceived - self.aggregatedStats.bytesReceived) / (newStat.timestamp - self.aggregatedStats.timestamp);
                            newStat.bitrate = Math.floor(newStat.bitrate);
                            newStat.lowBitrate = self.aggregatedStats.lowBitrate && self.aggregatedStats.lowBitrate < newStat.bitrate ? self.aggregatedStats.lowBitrate : newStat.bitrate;
                            newStat.highBitrate = self.aggregatedStats.highBitrate && self.aggregatedStats.highBitrate > newStat.bitrate ? self.aggregatedStats.highBitrate : newStat.bitrate;
                        }
                        if (self.aggregatedStats.bytesReceivedStart) {
                            newStat.avgBitrate = 8 * (newStat.bytesReceived - self.aggregatedStats.bytesReceivedStart) / (newStat.timestamp - self.aggregatedStats.timestampStart);
                            newStat.avgBitrate = Math.floor(newStat.avgBitrate);
                        }
                        if (self.aggregatedStats.framesDecoded) {
                            newStat.framerate = (newStat.framesDecoded - self.aggregatedStats.framesDecoded) / ((newStat.timestamp - self.aggregatedStats.timestamp) / 1000);
                            newStat.framerate = Math.floor(newStat.framerate);
                            newStat.lowFramerate = self.aggregatedStats.lowFramerate && self.aggregatedStats.lowFramerate < newStat.framerate ? self.aggregatedStats.lowFramerate : newStat.framerate;
                            newStat.highFramerate = self.aggregatedStats.highFramerate && self.aggregatedStats.highFramerate > newStat.framerate ? self.aggregatedStats.highFramerate : newStat.framerate;
                        }
                        if (self.aggregatedStats.framesDecodedStart) {
                            newStat.avgframerate = (newStat.framesDecoded - self.aggregatedStats.framesDecodedStart) / ((newStat.timestamp - self.aggregatedStats.timestampStart) / 1000);
                            newStat.avgframerate = Math.floor(newStat.avgframerate);
                        }
                    }
                }
                if (stat.type == 'track' && (stat.trackIdentifier == 'video_label' || stat.kind == 'video')) {
                    newStat.framesDropped = stat.framesDropped;
                    newStat.framesReceived = stat.framesReceived;
                    newStat.framesDroppedPercentage = stat.framesDropped / stat.framesReceived * 100;
                    newStat.frameHeight = stat.frameHeight;
                    newStat.frameWidth = stat.frameWidth;
                    newStat.frameHeightStart = self.aggregatedStats && self.aggregatedStats.frameHeightStart ? self.aggregatedStats.frameHeightStart : stat.frameHeight;
                    newStat.frameWidthStart = self.aggregatedStats && self.aggregatedStats.frameWidthStart ? self.aggregatedStats.frameWidthStart : stat.frameWidth;
                }
                if (stat.type == 'candidate-pair' && stat.hasOwnProperty('currentRoundTripTime') && stat.currentRoundTripTime != 0) {
                    newStat.currentRoundTripTime = stat.currentRoundTripTime;
                }
            });
            if (self.aggregatedStats.receiveToCompositeMs) {
                newStat.receiveToCompositeMs = self.aggregatedStats.receiveToCompositeMs;
                self.latencyTestTimings.SetFrameDisplayDeltaTime(self.aggregatedStats.receiveToCompositeMs);
            }
            self.aggregatedStats = newStat;
            if (self.onAggregatedStats)
                self.onAggregatedStats(newStat);
        };
    };
    var setupTransceiversAsync = function () {
        var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(pc) {
            var hasTransceivers, audioSendOptions, stream, _iterator2, _step2, transceiver, _iterator3, _step3, track, _iterator4, _step4, _track;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                    case 0:
                        hasTransceivers = pc.getTransceivers().length > 0;
                        pc.addTransceiver('video', { direction: 'recvonly' });
                        if (self.useMic) {
                            _context.next = 6;
                            break;
                        }
                        pc.addTransceiver('audio', { direction: 'recvonly' });
                        _context.next = 11;
                        break;
                    case 6:
                        audioSendOptions = self.useMic ? {
                            autoGainControl: false,
                            channelCount: 1,
                            echoCancellation: false,
                            latency: 0,
                            noiseSuppression: false,
                            sampleRate: 48000,
                            volume: 1
                        } : false;
                        _context.next = 9;
                        return navigator.mediaDevices.getUserMedia({
                            video: false,
                            audio: audioSendOptions
                        });
                    case 9:
                        stream = _context.sent;
                        if (stream) {
                            if (hasTransceivers) {
                                _iterator2 = _createForOfIteratorHelper(pc.getTransceivers());
                                try {
                                    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                                        transceiver = _step2.value;
                                        if (transceiver && transceiver.receiver && transceiver.receiver.track && transceiver.receiver.track.kind === 'audio') {
                                            _iterator3 = _createForOfIteratorHelper(stream.getTracks());
                                            try {
                                                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                                                    track = _step3.value;
                                                    if (track.kind && track.kind == 'audio') {
                                                        transceiver.sender.replaceTrack(track);
                                                        transceiver.direction = 'sendrecv';
                                                    }
                                                }
                                            } catch (err) {
                                                _iterator3.e(err);
                                            } finally {
                                                _iterator3.f();
                                            }
                                        }
                                    }
                                } catch (err) {
                                    _iterator2.e(err);
                                } finally {
                                    _iterator2.f();
                                }
                            } else {
                                _iterator4 = _createForOfIteratorHelper(stream.getTracks());
                                try {
                                    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                                        _track = _step4.value;
                                        if (_track.kind && _track.kind == 'audio') {
                                            pc.addTransceiver(_track, { direction: 'sendrecv' });
                                        }
                                    }
                                } catch (err) {
                                    _iterator4.e(err);
                                } finally {
                                    _iterator4.f();
                                }
                            }
                        } else {
                            pc.addTransceiver('audio', { direction: 'recvonly' });
                        }
                    case 11:
                    case 'end':
                        return _context.stop();
                    }
                }
            }, _callee);
        }));
        return function setupTransceiversAsync(_x) {
            return _ref.apply(this, arguments);
        };
    }();
    this.setVideoEnabled = function (enabled) {
        self.video.srcObject.getTracks().forEach(function (track) {
            return track.enabled = enabled;
        });
    };
    this.startLatencyTest = function (onTestStarted) {
        if (!self.video) {
            return;
        }
        self.latencyTestTimings.Reset();
        self.latencyTestTimings.TestStartTimeMs = Date.now();
        onTestStarted(self.latencyTestTimings.TestStartTimeMs);
    };
    this.handleCandidateFromServer = function (iceCandidate) {
        var candidate = new RTCIceCandidate(iceCandidate);
        console.log('%c[Unreal ICE candidate]', 'background: pink; color: black', '| Type=', candidate.type, '| Protocol=', candidate.protocol, '| Address=', candidate.address, '| Port=', candidate.port, '|');
        if (self.forceTURN) {
            if (candidate.candidate.indexOf('relay') < 0) {
                console.warn('Dropping candidate because it was not TURN relay.', '| Type=', candidate.type, '| Protocol=', candidate.protocol, '| Address=', candidate.address, '| Port=', candidate.port, '|');
                return;
            }
        }
        self.pcClient.addIceCandidate(candidate)['catch'](function (e) {
            console.error('Failed to add ICE candidate', e);
        });
    };
    this.createOffer = function () {
        if (self.pcClient) {
            console.log('Closing existing PeerConnection');
            self.pcClient.close();
            self.pcClient = null;
        }
        self.pcClient = new RTCPeerConnection(self.cfg);
        setupPeerConnection(self.pcClient);
        setupTransceiversAsync(self.pcClient)['finally'](function () {
            self.dcClient = createDataChannel(self.pcClient, 'cirrus', self.dataChannelOptions);
            handleCreateOffer(self.pcClient);
        });
    };
    this.receiveOffer = function (offer) {
        var offerDesc = new RTCSessionDescription(offer);
        if (!self.pcClient) {
            console.log('Creating a new PeerConnection in the browser.');
            self.pcClient = new RTCPeerConnection(self.cfg);
            setupPeerConnection(self.pcClient);
            self.pcClient.setRemoteDescription(offerDesc).then(function () {
                setupTransceiversAsync(self.pcClient)['finally'](function () {
                    self.pcClient.createAnswer().then(function (answer) {
                        return self.pcClient.setLocalDescription(answer);
                    }).then(function () {
                        if (self.onWebRtcAnswer) {
                            self.onWebRtcAnswer(self.pcClient.currentLocalDescription);
                        }
                    }).then(function () {
                        var receivers = self.pcClient.getReceivers();
                        var _iterator5 = _createForOfIteratorHelper(receivers), _step5;
                        try {
                            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                                var receiver = _step5.value;
                                receiver.playoutDelayHint = 0;
                            }
                        } catch (err) {
                            _iterator5.e(err);
                        } finally {
                            _iterator5.f();
                        }
                    })['catch'](function (error) {
                        return console.error('createAnswer() failed:', error);
                    });
                });
            });
        }
    };
    this.receiveAnswer = function (answer) {
        var answerDesc = new RTCSessionDescription(answer);
        self.pcClient.setRemoteDescription(answerDesc);
        var receivers = self.pcClient.getReceivers();
        var _iterator6 = _createForOfIteratorHelper(receivers), _step6;
        try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                var receiver = _step6.value;
                receiver.playoutDelayHint = 0;
            }
        } catch (err) {
            _iterator6.e(err);
        } finally {
            _iterator6.f();
        }
    };
    this.close = function () {
        if (self.pcClient) {
            console.log('Closing existing peerClient');
            self.pcClient.close();
            self.pcClient = null;
        }
        if (self.aggregateStatsIntervalId)
            clearInterval(self.aggregateStatsIntervalId);
    };
    this.send = function (data) {
        if (self.dcClient && self.dcClient.readyState == 'open') {
            self.dcClient.send(data);
        }
    };
    this.getStats = function (onStats) {
        if (self.pcClient && onStats) {
            self.pcClient.getStats(null).then(function (stats) {
                onStats(stats);
            });
        }
    };
    this.aggregateStats = function (checkInterval) {
        var calcAggregatedStats = generateAggregatedStatsFunction();
        var printAggregatedStats = function printAggregatedStats() {
            self.getStats(calcAggregatedStats);
        };
        self.aggregateStatsIntervalId = setInterval(printAggregatedStats, checkInterval);
    };
}

function ajax(options) {
    var path = options.path, method = options.method, data = options.data;
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open(method, path);
        request.send(data);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 300) {
                    resolve.call(undefined, JSON.parse(request.responseText));
                } else if (request.status >= 400) {
                    reject.call(undefined, request);
                }
            }
        };
    });
}

var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
var rAF = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;
var kbEvent = document.createEvent('KeyboardEvent');
typeof kbEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent';
var webRtcPlayerObj = null;
var ws;
var WS_OPEN_STATE = 1;
var lastTimeResized = new Date().getTime();
var resizeTimeout;
var onDataChannelConnected;
var responseEventListeners = new Map();
var freezeFrameOverlay = null;
var shouldShowPlayOverlay = true;
var freezeFrame = {
    receiving: false,
    size: 0,
    jpeg: undefined,
    height: 0,
    width: 0,
    valid: false
};
var file = {
    mimetype: '',
    extension: '',
    receiving: false,
    size: 0,
    data: [],
    valid: false,
    timestampStart: undefined
};
var afk = {
    enabled: true,
    warnTimeout: 120,
    closeTimeout: 30,
    active: false,
    overlay: undefined,
    warnTimer: undefined,
    countdown: 0,
    countdownTimer: undefined
};
var editTextButton = undefined;
var hiddenInput = undefined;
function scanGamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [];
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && gamepads[i].index in controllers) {
            controllers[gamepads[i].index].currentState = gamepads[i];
        }
    }
}
function updateStatus() {
    scanGamepads();
    for (j in controllers) {
        var controller = controllers[j];
        var currentState = controller.currentState;
        var prevState = controller.prevState;
        for (var i = 0; i < currentState.buttons.length; i++) {
            var currButton = currentState.buttons[i];
            var prevButton = prevState.buttons[i];
            if (currButton.pressed && !prevButton.pressed) {
                if (i == 6) {
                    emitControllerAxisMove(j, 5, currButton.value);
                } else if (i == 7) {
                    emitControllerAxisMove(j, 6, currButton.value);
                } else {
                    emitControllerButtonPressed(j, i, 0);
                }
            } else if (!currButton.pressed && prevButton.pressed) {
                if (i == 6) {
                    emitControllerAxisMove(j, 5, 0);
                } else if (i == 7) {
                    emitControllerAxisMove(j, 6, 0);
                } else {
                    emitControllerButtonReleased(j, i);
                }
            } else if (currButton.pressed && prevButton.pressed) {
                if (i == 6) {
                    emitControllerAxisMove(j, 5, currButton.value);
                } else if (i == 7) {
                    emitControllerAxisMove(j, 6, currButton.value);
                } else {
                    emitControllerButtonPressed(j, i, 1);
                }
            }
        }
        for (var _i = 0; _i < currentState.axes.length; _i += 2) {
            var x = parseFloat(currentState.axes[_i].toFixed(4));
            var y = -parseFloat(currentState.axes[_i + 1].toFixed(4));
            if (_i === 0) {
                emitControllerAxisMove(j, 1, x);
                emitControllerAxisMove(j, 2, y);
            } else if (_i === 2) {
                emitControllerAxisMove(j, 3, x);
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
    console.log('Gamepad connect handler');
    gamepad = e.gamepad;
    controllers[gamepad.index] = {};
    controllers[gamepad.index].currentState = gamepad;
    controllers[gamepad.index].prevState = gamepad;
    console.log('gamepad: ' + gamepad.id + ' connected');
    rAF(updateStatus);
}
function gamepadDisconnectHandler(e) {
    console.log('Gamepad disconnect handler');
    console.log('gamepad: ' + e.gamepad.id + ' disconnected');
    delete controllers[e.gamepad.index];
}
function setupHtmlEvents() {
    window.addEventListener('resize', resizePlayerStyle, true);
    window.addEventListener('orientationchange', onOrientationChange);
    if (haveEvents) {
        window.addEventListener('gamepadconnected', gamepadConnectHandler);
        window.addEventListener('gamepaddisconnected', gamepadDisconnectHandler);
    } else if (haveWebkitEvents) {
        window.addEventListener('webkitgamepadconnected', gamepadConnectHandler);
        window.addEventListener('webkitgamepaddisconnected', gamepadDisconnectHandler);
    }
}
function setOverlay(htmlClass, htmlElement, onClickFunction) {
    var videoPlayOverlay = document.getElementById('videoPlayOverlay');
    if (!videoPlayOverlay) {
        var playerDiv = document.getElementById('player');
        videoPlayOverlay = document.createElement('div');
        videoPlayOverlay.id = 'videoPlayOverlay';
        playerDiv.appendChild(videoPlayOverlay);
    }
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
    var cl = videoPlayOverlay.classList;
    for (var i = cl.length - 1; i >= 0; i--) {
        cl.remove(cl[i]);
    }
    videoPlayOverlay.classList.add(htmlClass);
}
function showConnectOverlay() {
    setTimeout(function () {
        connect();
        startAfkWarningTimer();
    }, 300);
}
function showTextOverlay(text) {
    var textOverlay = document.createElement('div');
    textOverlay.id = 'messageOverlay';
    textOverlay.innerHTML = text ? text : '';
    setOverlay('textDisplayState', textOverlay);
}
function playVideoStream() {
    if (webRtcPlayerObj && webRtcPlayerObj.video) {
        webRtcPlayerObj.video.play()['catch'](function (onRejectedReason) {
            console.error(onRejectedReason);
            console.log('Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay.');
            showPlayOverlay();
        });
        requestInitialSettings();
        requestQualityControl();
        showFreezeFrameOverlay();
        hideOverlay();
    } else {
        console.error('Could not player video stream because webRtcPlayerObj.video was not valid.');
    }
}
function showPlayOverlay() {
    setTimeout(function () {
        if (webRtcPlayerObj) {
            playVideoStream();
        }
    }, 500);
}
function updateAfkOverlayText() {
    afk.overlay.innerHTML = '<center>没有检测到活跃状态\uFF0C自动断开连接计时 ' + afk.countdown + ' s,点击继续连接</center>';
}
function showAfkOverlay() {
    stopAfkWarningTimer();
    afk.overlay = document.createElement('div');
    afk.overlay.id = 'afkOverlay';
    afk.overlay.style = 'position: relative;text-align: center;z-index:1000;';
    setOverlay('clickableState', afk.overlay, function (event) {
        hideOverlay();
        clearInterval(afk.countdownTimer);
        startAfkWarningTimer();
    });
    afk.countdown = afk.closeTimeout;
    updateAfkOverlayText();
    afk.countdownTimer = setInterval(function () {
        afk.countdown--;
        if (afk.countdown == 0) {
            clearInterval(afk.countdownTimer);
            hideOverlay();
            ws.close();
        } else {
            updateAfkOverlayText();
        }
    }, 1000);
}
function hideOverlay() {
    setOverlay('hiddenState');
}
function startAfkWarningTimer() {
    afk.active = afk.enabled;
    resetAfkWarningTimer();
}
function stopAfkWarningTimer() {
    afk.active = false;
}
function resetAfkWarningTimer() {
    if (afk.active) {
        clearTimeout(afk.warnTimer);
        afk.warnTimer = setTimeout(function () {
            showAfkOverlay();
        }, afk.warnTimeout * 1000);
    }
}
function sendInputData(data) {
    if (webRtcPlayerObj) {
        resetAfkWarningTimer();
        webRtcPlayerObj.send(data);
    }
}
var ToClientMessageType = {
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
function setupWebRtcPlayer(htmlElement, config) {
    webRtcPlayerObj = new webRtcPlayer(config);
    htmlElement.appendChild(webRtcPlayerObj.video);
    htmlElement.appendChild(freezeFrameOverlay);
    webRtcPlayerObj.onWebRtcOffer = function (offer) {
        if (ws && ws.readyState === WS_OPEN_STATE) {
            var offerStr = JSON.stringify(offer);
            console.log('%c[Outbound SS message (offer)]', 'background: lightgreen; color: black', offer);
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
            var answerStr = JSON.stringify(answer);
            console.log('%c[Outbound SS message (answer)]', 'background: lightgreen; color: black', answer);
            ws.send(answerStr);
        }
    };
    webRtcPlayerObj.onVideoInitialised = function () {
        if (ws && ws.readyState === WS_OPEN_STATE) {
            if (shouldShowPlayOverlay) {
                showPlayOverlay();
                resizePlayerStyle();
            } else {
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
        }
    };
    function showFreezeFrame() {
        var base64 = btoa(freezeFrame.jpeg.reduce(function (data, _byte) {
            return data + String.fromCharCode(_byte);
        }, ''));
        var freezeFrameImage = document.getElementById('freezeFrameOverlay').childNodes[0];
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
        if (!file.receiving) {
            file.mimetype = '';
            file.extension = '';
            file.receiving = true;
            file.valid = false;
            file.size = 0;
            file.data = [];
            file.timestampStart = new Date().getTime();
            console.log('Received first chunk of file');
        }
        var extensionAsString = new TextDecoder('utf-16').decode(view.slice(1));
        console.log(extensionAsString);
        file.extension = extensionAsString;
    }
    function processFileMimeType(view) {
        if (!file.receiving) {
            file.mimetype = '';
            file.extension = '';
            file.receiving = true;
            file.valid = false;
            file.size = 0;
            file.data = [];
            file.timestampStart = new Date().getTime();
            console.log('Received first chunk of file');
        }
        var mimeAsString = new TextDecoder('utf-16').decode(view.slice(1));
        console.log(mimeAsString);
        file.mimetype = mimeAsString;
    }
    function processFileContents(view) {
        if (!file.receiving)
            return;
        file.size = Math.ceil(new DataView(view.slice(1, 5).buffer).getInt32(0, true) / 16379);
        var fileBytes = view.slice(1 + 4);
        file.data.push(fileBytes);
        console.log('Received file chunk: '.concat(file.data.length, '/').concat(file.size));
        if (file.data.length === file.size) {
            file.receiving = false;
            file.valid = true;
            console.log('Received complete file');
            var transferDuration = new Date().getTime() - file.timestampStart;
            var transferBitrate = Math.round(file.size * 16 * 1024 / transferDuration);
            console.log('Average transfer bitrate: '.concat(transferBitrate, 'kb/s over ').concat(transferDuration / 1000, ' seconds'));
            var received = new Blob(file.data, { type: file.mimetype });
            var a = document.createElement('a');
            a.setAttribute('href', URL.createObjectURL(received));
            a.setAttribute('download', 'transfer.'.concat(file.extension));
            var aj = $(a);
            aj.appendTo('body');
            aj.remove();
        } else if (file.data.length > file.size) {
            file.receiving = false;
            console.error('Received bigger file than advertised: '.concat(file.data.length, '/').concat(file.size));
        }
    }
    function processFreezeFrameMessage(view) {
        if (!freezeFrame.receiving) {
            freezeFrame.receiving = true;
            freezeFrame.valid = false;
            freezeFrame.size = 0;
            freezeFrame.jpeg = undefined;
        }
        freezeFrame.size = new DataView(view.slice(1, 5).buffer).getInt32(0, true);
        var jpegBytes = view.slice(1 + 4);
        if (freezeFrame.jpeg) {
            var jpeg = new Uint8Array(freezeFrame.jpeg.length + jpegBytes.length);
            jpeg.set(freezeFrame.jpeg, 0);
            jpeg.set(jpegBytes, freezeFrame.jpeg.length);
            freezeFrame.jpeg = jpeg;
        } else {
            freezeFrame.jpeg = jpegBytes;
            freezeFrame.receiving = true;
            console.log('received first chunk of freeze frame: '.concat(freezeFrame.jpeg.length, '/').concat(freezeFrame.size));
        }
        if (freezeFrame.jpeg.length === freezeFrame.size) {
            freezeFrame.receiving = false;
            freezeFrame.valid = true;
            console.log('received complete freeze frame '.concat(freezeFrame.size));
            showFreezeFrame();
        } else if (freezeFrame.jpeg.length > freezeFrame.size) {
            console.error('received bigger freeze frame than advertised: '.concat(freezeFrame.jpeg.length, '/').concat(freezeFrame.size));
            freezeFrame.jpeg = undefined;
            freezeFrame.receiving = false;
        }
    }
    webRtcPlayerObj.onNewVideoTrack = function (streams) {
        if (webRtcPlayerObj.video && webRtcPlayerObj.video.srcObject && webRtcPlayerObj.onVideoInitialised) {
            webRtcPlayerObj.onVideoInitialised();
        }
    };
    webRtcPlayerObj.onDataChannelMessage = function (data) {
        var view = new Uint8Array(data);
        if (view[0] === ToClientMessageType.Response) {
            var response = new TextDecoder('utf-16').decode(data.slice(1));
            onResponse(response);
        } else if (view[0] === ToClientMessageType.Command) {
            var commandAsString = new TextDecoder('utf-16').decode(data.slice(1));
            console.log(commandAsString);
            var command = JSON.parse(commandAsString);
            if (command.command === 'onScreenKeyboard') {
                showOnScreenKeyboard(command);
            }
        } else if (view[0] === ToClientMessageType.FreezeFrame) {
            processFreezeFrameMessage(view);
        } else if (view[0] === ToClientMessageType.UnfreezeFrame) {
            invalidateFreezeFrameOverlay();
        } else if (view[0] === ToClientMessageType.VideoEncoderAvgQP) {
            new TextDecoder('utf-16').decode(data.slice(1));
        } else if (view[0] == ToClientMessageType.LatencyTest) {
            var latencyTimingsAsString = new TextDecoder('utf-16').decode(data.slice(1));
            console.log('Got latency timings from UE.');
            console.log(latencyTimingsAsString);
            var latencyTimingsFromUE = JSON.parse(latencyTimingsAsString);
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
            console.error('unrecognized data received, packet ID '.concat(view[0]));
        }
    };
    registerInputs(webRtcPlayerObj.video);
    if ('ontouchstart' in document.documentElement) {
        createOnScreenKeyboardHelpers(htmlElement);
    }
    return webRtcPlayerObj.video;
}
function setupStats() {
    webRtcPlayerObj.onAggregatedStats = function (aggregatedStats) {
        (aggregatedStats.timestamp - aggregatedStats.timestampStart) / 1000;
    };
    webRtcPlayerObj.aggregateStats(1 * 1000);
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
var styleWidth;
var styleHeight;
var styleTop;
var styleLeft;
var styleCursor = 'default';
var styleAdditional;
var ControlSchemeType = {
    LockedMouse: 0,
    HoveringMouse: 1
};
var inputOptions = {
    controlScheme: ControlSchemeType.HoveringMouse,
    suppressBrowserKeys: true,
    fakeMouseWithTouches: false
};
function resizePlayerStyleToFillWindow(playerElement) {
    var videoElement = playerElement.getElementsByTagName('VIDEO');
    var windowAspectRatio = window.innerHeight / window.innerWidth;
    var playerAspectRatio = playerElement.clientHeight / playerElement.clientWidth;
    var videoAspectRatio = videoElement.videoHeight / videoElement.videoWidth;
    if (isNaN(videoAspectRatio)) {
        styleWidth = window.innerWidth;
        styleHeight = window.innerHeight;
        styleTop = 0;
        styleLeft = 0;
        playerElement.style = 'top: ' + styleTop + 'px; left: ' + styleLeft + 'px; width: ' + styleWidth + 'px; height: ' + styleHeight + 'px; cursor: ' + styleCursor + '; ' + styleAdditional;
    } else if (windowAspectRatio < playerAspectRatio) {
        styleWidth = Math.floor(window.innerHeight / videoAspectRatio);
        styleHeight = window.innerHeight;
        styleTop = 0;
        styleLeft = Math.floor((window.innerWidth - styleWidth) * 0.5);
        playerElement.style = 'top: ' + styleTop + 'px; left: ' + styleLeft + 'px; width: ' + styleWidth + 'px; height: ' + styleHeight + 'px; cursor: ' + styleCursor + '; ' + styleAdditional;
    } else {
        styleWidth = window.innerWidth;
        styleHeight = Math.floor(window.innerWidth * videoAspectRatio);
        styleTop = Math.floor((window.innerHeight - styleHeight) * 0.5);
        styleLeft = 0;
        playerElement.style = 'top: ' + styleTop + 'px; left: ' + styleLeft + 'px; width: ' + styleWidth + 'px; height: ' + styleHeight + 'px; cursor: ' + styleCursor + '; ' + styleAdditional;
    }
}
function resizePlayerStyleToActualSize(playerElement) {
    var videoElement = playerElement.getElementsByTagName('VIDEO');
    if (videoElement.length > 0) {
        styleWidth = videoElement[0].videoWidth;
        styleHeight = videoElement[0].videoHeight;
        var Top = Math.floor((window.innerHeight - styleHeight) * 0.5);
        var Left = Math.floor((window.innerWidth - styleWidth) * 0.5);
        styleTop = Top > 0 ? Top : 0;
        styleLeft = Left > 0 ? Left : 0;
        playerElement.style = 'top: ' + styleTop + 'px; left: ' + styleLeft + 'px; width: ' + styleWidth + 'px; height: ' + styleHeight + 'px; cursor: ' + styleCursor + '; ' + styleAdditional;
    }
}
function resizePlayerStyleToArbitrarySize(playerElement) {
    playerElement.getElementsByTagName('VIDEO');
    playerElement.style = 'top: 0px; left: 0px; width: ' + styleWidth + 'px; height: ' + styleHeight + 'px; cursor: ' + styleCursor + '; ' + styleAdditional;
}
function setupFreezeFrameOverlay() {
    freezeFrameOverlay = document.createElement('div');
    freezeFrameOverlay.id = 'freezeFrameOverlay';
    freezeFrameOverlay.style.display = 'none';
    freezeFrameOverlay.style.pointerEvents = 'none';
    freezeFrameOverlay.style.position = 'absolute';
    freezeFrameOverlay.style.zIndex = '20';
    var freezeFrameImage = document.createElement('img');
    freezeFrameImage.style.position = 'absolute';
    freezeFrameOverlay.appendChild(freezeFrameImage);
}
function showFreezeFrameOverlay() {
    if (freezeFrame.valid) {
        freezeFrameOverlay.classList.add('freezeframeBackground');
        freezeFrameOverlay.style.display = 'block';
    }
}
function invalidateFreezeFrameOverlay() {
    freezeFrameOverlay.style.display = 'none';
    freezeFrame.valid = false;
    freezeFrameOverlay.classList.remove('freezeframeBackground');
    if (webRtcPlayerObj) {
        webRtcPlayerObj.setVideoEnabled(true);
    }
}
function resizeFreezeFrameOverlay() {
    if (freezeFrame.width !== 0 && freezeFrame.height !== 0) {
        var displayWidth = 0;
        var displayHeight = 0;
        var displayTop = 0;
        var displayLeft = 0;
        var checkBox = document.getElementById('enlarge-display-to-fill-window-tgl');
        var playerElement = document.getElementById('player');
        if (checkBox !== null && checkBox.checked) {
            var windowAspectRatio = window.innerWidth / window.innerHeight;
            var videoAspectRatio = freezeFrame.width / freezeFrame.height;
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
            var playerAspectRatio = playerElement.offsetWidth / playerElement.offsetHeight;
            var _videoAspectRatio = freezeFrame.width / freezeFrame.height;
            if (playerAspectRatio < _videoAspectRatio) {
                displayWidth = playerElement.offsetWidth;
                displayHeight = Math.floor(playerElement.offsetWidth / _videoAspectRatio);
                displayTop = Math.floor((playerElement.offsetHeight - displayHeight) * 0.5);
                displayLeft = 0;
            } else {
                displayWidth = Math.floor(playerElement.offsetHeight * _videoAspectRatio);
                displayHeight = playerElement.offsetHeight;
                displayTop = 0;
                displayLeft = Math.floor((playerElement.offsetWidth - displayWidth) * 0.5);
            }
        }
        var freezeFrameImage = document.getElementById('freezeFrameOverlay').childNodes[0];
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
    var playerElement = document.getElementById('player');
    if (!playerElement)
        return;
    updateVideoStreamSize();
    if (playerElement.classList.contains('fixed-size')) {
        setupMouseAndFreezeFrame(playerElement);
        return;
    }
    var checkBox = document.getElementById('enlarge-display-to-fill-window-tgl');
    var windowSmallerThanPlayer = window.innerWidth < playerElement.videoWidth || window.innerHeight < playerElement.videoHeight;
    if (checkBox !== null) {
        if (checkBox.checked || windowSmallerThanPlayer) {
            resizePlayerStyleToFillWindow(playerElement);
        } else {
            resizePlayerStyleToActualSize(playerElement);
        }
    } else {
        resizePlayerStyleToArbitrarySize(playerElement);
    }
    setupMouseAndFreezeFrame(playerElement);
}
function setupMouseAndFreezeFrame(playerElement) {
    playerElement.getBoundingClientRect();
    setupNormalizeAndQuantize();
    resizeFreezeFrameOverlay();
}
function updateVideoStreamSize() {
    var now = new Date().getTime();
    if (now - lastTimeResized > 1000) {
        var playerElement = document.getElementById('player');
        if (!playerElement)
            return;
        var descriptor = { ConsoleCommand: 'setres ' + playerElement.clientWidth + 'x' + playerElement.clientHeight };
        emitCommand(descriptor);
        console.log(descriptor);
        lastTimeResized = new Date().getTime();
    } else {
        console.log('Resizing too often - skipping');
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateVideoStreamSize, 1000);
    }
}
var _orientationChangeTimeout;
function onOrientationChange(event) {
    clearTimeout(_orientationChangeTimeout);
    _orientationChangeTimeout = setTimeout(function () {
        resizePlayerStyle();
    }, 500);
}
var MessageType = {
    IFrameRequest: 0,
    RequestQualityControl: 1,
    FpsRequest: 2,
    AverageBitrateRequest: 3,
    StartStreaming: 4,
    StopStreaming: 5,
    LatencyTest: 6,
    RequestInitialSettings: 7,
    UIInteraction: 50,
    Command: 51,
    KeyDown: 60,
    KeyUp: 61,
    KeyPress: 62,
    MouseEnter: 70,
    MouseLeave: 71,
    MouseDown: 72,
    MouseUp: 73,
    MouseMove: 74,
    MouseWheel: 75,
    TouchStart: 80,
    TouchEnd: 81,
    TouchMove: 82,
    GamepadButtonPressed: 90,
    GamepadButtonReleased: 91,
    GamepadAnalog: 92
};
function emitDescriptor(messageType, descriptor) {
    var descriptorAsString = JSON.stringify(descriptor);
    var data = new DataView(new ArrayBuffer(1 + 2 + 2 * descriptorAsString.length));
    var byteIdx = 0;
    data.setUint8(byteIdx, messageType);
    byteIdx++;
    data.setUint16(byteIdx, descriptorAsString.length, true);
    byteIdx += 2;
    for (var i = 0; i < descriptorAsString.length; i++) {
        data.setUint16(byteIdx, descriptorAsString.charCodeAt(i), true);
        byteIdx += 2;
    }
    sendInputData(data.buffer);
}
function emitUIInteraction(descriptor) {
    emitDescriptor(MessageType.UIInteraction, descriptor);
}
function emitCommand(descriptor) {
    emitDescriptor(MessageType.Command, descriptor);
}
function requestInitialSettings() {
    sendInputData(new Uint8Array([MessageType.RequestInitialSettings]).buffer);
}
function requestQualityControl() {
    {
        sendInputData(new Uint8Array([MessageType.RequestQualityControl]).buffer);
    }
}
var normalizeAndQuantizeUnsigned = undefined;
var normalizeAndQuantizeSigned = undefined;
var unquantizeAndDenormalizeUnsigned = undefined;
function setupNormalizeAndQuantize() {
    var playerElement = document.getElementById('player');
    var videoElement = playerElement.getElementsByTagName('video');
    if (playerElement && videoElement.length > 0) {
        var playerAspectRatio = playerElement.clientHeight / playerElement.clientWidth;
        var videoAspectRatio = videoElement[0].videoHeight / videoElement[0].videoWidth;
        if (playerAspectRatio > videoAspectRatio) {
            var ratio = playerAspectRatio / videoAspectRatio;
            normalizeAndQuantizeUnsigned = function normalizeAndQuantizeUnsigned(x, y) {
                var normalizedX = x / playerElement.clientWidth;
                var normalizedY = ratio * (y / playerElement.clientHeight - 0.5) + 0.5;
                if (normalizedX < 0 || normalizedX > 1 || normalizedY < 0 || normalizedY > 1) {
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
            unquantizeAndDenormalizeUnsigned = function unquantizeAndDenormalizeUnsigned(x, y) {
                var normalizedX = x / 65536;
                var normalizedY = (y / 65536 - 0.5) / ratio + 0.5;
                return {
                    x: normalizedX * playerElement.clientWidth,
                    y: normalizedY * playerElement.clientHeight
                };
            };
            normalizeAndQuantizeSigned = function normalizeAndQuantizeSigned(x, y) {
                var normalizedX = x / (0.5 * playerElement.clientWidth);
                var normalizedY = ratio * y / (0.5 * playerElement.clientHeight);
                return {
                    x: normalizedX * 32767,
                    y: normalizedY * 32767
                };
            };
        } else {
            var _ratio = videoAspectRatio / playerAspectRatio;
            normalizeAndQuantizeUnsigned = function normalizeAndQuantizeUnsigned(x, y) {
                var normalizedX = _ratio * (x / playerElement.clientWidth - 0.5) + 0.5;
                var normalizedY = y / playerElement.clientHeight;
                if (normalizedX < 0 || normalizedX > 1 || normalizedY < 0 || normalizedY > 1) {
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
            unquantizeAndDenormalizeUnsigned = function unquantizeAndDenormalizeUnsigned(x, y) {
                var normalizedX = (x / 65536 - 0.5) / _ratio + 0.5;
                var normalizedY = y / 65536;
                return {
                    x: normalizedX * playerElement.clientWidth,
                    y: normalizedY * playerElement.clientHeight
                };
            };
            normalizeAndQuantizeSigned = function normalizeAndQuantizeSigned(x, y) {
                var normalizedX = _ratio * x / (0.5 * playerElement.clientWidth);
                var normalizedY = y / (0.5 * playerElement.clientHeight);
                return {
                    x: normalizedX * 32767,
                    y: normalizedY * 32767
                };
            };
        }
    }
}
function emitMouseMove(x, y, deltaX, deltaY) {
    var coord = normalizeAndQuantizeUnsigned(x, y);
    var delta = normalizeAndQuantizeSigned(deltaX, deltaY);
    var Data = new DataView(new ArrayBuffer(9));
    Data.setUint8(0, MessageType.MouseMove);
    Data.setUint16(1, coord.x, true);
    Data.setUint16(3, coord.y, true);
    Data.setInt16(5, delta.x, true);
    Data.setInt16(7, delta.y, true);
    sendInputData(Data.buffer);
}
function emitMouseDown(button, x, y) {
    var coord = normalizeAndQuantizeUnsigned(x, y);
    var Data = new DataView(new ArrayBuffer(6));
    Data.setUint8(0, MessageType.MouseDown);
    Data.setUint8(1, button);
    Data.setUint16(2, coord.x, true);
    Data.setUint16(4, coord.y, true);
    sendInputData(Data.buffer);
}
function emitMouseUp(button, x, y) {
    var coord = normalizeAndQuantizeUnsigned(x, y);
    var Data = new DataView(new ArrayBuffer(6));
    Data.setUint8(0, MessageType.MouseUp);
    Data.setUint8(1, button);
    Data.setUint16(2, coord.x, true);
    Data.setUint16(4, coord.y, true);
    sendInputData(Data.buffer);
}
function emitMouseWheel(delta, x, y) {
    var coord = normalizeAndQuantizeUnsigned(x, y);
    var Data = new DataView(new ArrayBuffer(7));
    Data.setUint8(0, MessageType.MouseWheel);
    Data.setInt16(1, delta, true);
    Data.setUint16(3, coord.x, true);
    Data.setUint16(5, coord.y, true);
    sendInputData(Data.buffer);
}
var MouseButton = {
    MainButton: 0,
    AuxiliaryButton: 1,
    SecondaryButton: 2,
    FourthButton: 3,
    FifthButton: 4
};
var MouseButtonsMask = {
    PrimaryButton: 1,
    SecondaryButton: 2,
    AuxiliaryButton: 4,
    FourthButton: 8,
    FifthButton: 16
};
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
        editTextButton.classList.add('hiddenState');
        editTextButton.addEventListener('click', function () {
            hiddenInput.focus();
        });
    }
}
function showOnScreenKeyboard(command) {
    if (command.showOnScreenKeyboard) {
        editTextButton.classList.remove('hiddenState');
        var pos = unquantizeAndDenormalizeUnsigned(command.x, command.y);
        editTextButton.style.top = pos.y.toString() + 'px';
        editTextButton.style.left = (pos.x - 40).toString() + 'px';
    } else {
        editTextButton.classList.add('hiddenState');
        hiddenInput.blur();
    }
}
function registerMouseEnterAndLeaveEvents(playerElement) {
    playerElement.onmouseenter = function (e) {
        var Data = new DataView(new ArrayBuffer(1));
        Data.setUint8(0, MessageType.MouseEnter);
        sendInputData(Data.buffer);
        playerElement.pressMouseButtons(e);
    };
    playerElement.onmouseleave = function (e) {
        var Data = new DataView(new ArrayBuffer(1));
        Data.setUint8(0, MessageType.MouseLeave);
        sendInputData(Data.buffer);
        playerElement.releaseMouseButtons(e);
    };
}
function registerLockedMouseEvents(playerElement) {
    var x = playerElement.width / 2;
    var y = playerElement.height / 2;
    playerElement.requestPointerLock = playerElement.requestPointerLock || playerElement.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    playerElement.onclick = function () {
        playerElement.requestPointerLock();
    };
    document.addEventListener('pointerlockchange', lockStateChange, false);
    document.addEventListener('mozpointerlockchange', lockStateChange, false);
    function lockStateChange() {
        if (document.pointerLockElement === playerElement || document.mozPointerLockElement === playerElement) {
            console.log('Pointer locked');
            document.addEventListener('mousemove', updatePosition, false);
        } else {
            console.log('The pointer lock status is now unlocked');
            document.removeEventListener('mousemove', updatePosition, false);
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
function registerHoveringMouseEvents(playerElement) {
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
    var fingers = [
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
        1,
        0
    ];
    var fingerIds = {};
    function rememberTouch(touch) {
        var finger = fingers.pop();
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
        var data = new DataView(new ArrayBuffer(2 + 7 * touches.length));
        data.setUint8(0, type);
        data.setUint8(1, touches.length);
        var _byte2 = 2;
        for (var t = 0; t < touches.length; t++) {
            var touch = touches[t];
            var x = touch.clientX - playerElement.offsetLeft;
            var y = touch.clientY - playerElement.offsetTop;
            var coord = normalizeAndQuantizeUnsigned(x, y);
            data.setUint16(_byte2, coord.x, true);
            _byte2 += 2;
            data.setUint16(_byte2, coord.y, true);
            _byte2 += 2;
            data.setUint8(_byte2, fingerIds[touch.identifier], true);
            _byte2 += 1;
            data.setUint8(_byte2, 255 * touch.force, true);
            _byte2 += 1;
            data.setUint8(_byte2, coord.inRange ? 1 : 0, true);
            _byte2 += 1;
        }
        sendInputData(data.buffer);
    }
    {
        playerElement.ontouchstart = function (e) {
            for (var t = 0; t < e.changedTouches.length; t++) {
                rememberTouch(e.changedTouches[t]);
            }
            emitTouchData(MessageType.TouchStart, e.changedTouches);
            e.preventDefault();
        };
        playerElement.ontouchend = function (e) {
            emitTouchData(MessageType.TouchEnd, e.changedTouches);
            for (var t = 0; t < e.changedTouches.length; t++) {
                forgetTouch(e.changedTouches[t]);
            }
            e.preventDefault();
        };
        playerElement.ontouchmove = function (e) {
            emitTouchData(MessageType.TouchMove, e.touches);
            e.preventDefault();
        };
    }
}
function isKeyCodeBrowserKey(keyCode) {
    return keyCode >= 112 && keyCode <= 123 || keyCode === 9;
}
var SpecialKeyCodes = {
    BackSpace: 8,
    Shift: 16,
    Control: 17,
    Alt: 18,
    RightShift: 253,
    RightControl: 254,
    RightAlt: 255
};
function getKeyCode(e) {
    if (e.keyCode === SpecialKeyCodes.Shift && e.code === 'ShiftRight')
        return SpecialKeyCodes.RightShift;
    else if (e.keyCode === SpecialKeyCodes.Control && e.code === 'ControlRight')
        return SpecialKeyCodes.RightControl;
    else if (e.keyCode === SpecialKeyCodes.Alt && e.code === 'AltRight')
        return SpecialKeyCodes.RightAlt;
    else
        return e.keyCode;
}
function registerKeyboardEvents() {
    document.onkeydown = function (e) {
        sendInputData(new Uint8Array([
            MessageType.KeyDown,
            getKeyCode(e),
            e.repeat
        ]).buffer);
        if (e.keyCode === SpecialKeyCodes.BackSpace) {
            document.onkeypress({ charCode: SpecialKeyCodes.BackSpace });
        }
        if (isKeyCodeBrowserKey(e.keyCode)) {
            e.preventDefault();
        }
    };
    document.onkeyup = function (e) {
        sendInputData(new Uint8Array([
            MessageType.KeyUp,
            getKeyCode(e)
        ]).buffer);
        if (isKeyCodeBrowserKey(e.keyCode)) {
            e.preventDefault();
        }
    };
    document.onkeypress = function (e) {
        var data = new DataView(new ArrayBuffer(3));
        data.setUint8(0, MessageType.KeyPress);
        data.setUint16(1, e.charCode, true);
        sendInputData(data.buffer);
    };
}
function start() {
    {
        showConnectOverlay();
        invalidateFreezeFrameOverlay();
        shouldShowPlayOverlay = true;
        resizePlayerStyle();
    }
}
function connect() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) {
        alert('Your browser doesn\'t support WebSocket');
        return;
    }
    ws = new WebSocket('ws://' + signalServer);
    ws.onmessage = function (event) {
        var msg = JSON.parse(event.data);
        if (msg.type === 'config') {
            console.log('%c[Inbound SS (config)]', 'background: lightblue; color: black', msg);
            onConfig(msg);
        } else if (msg.type === 'playerCount') {
            console.log('%c[Inbound SS (playerCount)]', 'background: lightblue; color: black', msg);
        } else if (msg.type === 'offer') {
            console.log('%c[Inbound SS (offer)]', 'background: lightblue; color: black', msg);
            onWebRtcOffer(msg);
        } else if (msg.type === 'answer') {
            console.log('%c[Inbound SS (answer)]', 'background: lightblue; color: black', msg);
            onWebRtcAnswer(msg);
        } else if (msg.type === 'iceCandidate') {
            onWebRtcIce(msg.candidate);
        } else if (msg.type === 'warning' && msg.warning) {
            console.warn(msg.warning);
        } else {
            console.error('Invalid SS message type', msg.type);
        }
    };
    ws.onerror = function (event) {
        console.log('WS error: '.concat(JSON.stringify(event)));
    };
    ws.onclose = function (event) {
        console.log('WS closed: '.concat(JSON.stringify(event.code), ' - ').concat(event.reason));
        ws = undefined;
        var playerDiv = document.getElementById('player');
        if (webRtcPlayerObj) {
            playerDiv.removeChild(webRtcPlayerObj.video);
            webRtcPlayerObj.close();
            webRtcPlayerObj = undefined;
        }
        showTextOverlay('Disconnected: '.concat(event.reason));
        setTimeout(start, 4000);
    };
}
function onConfig(config) {
    var playerDiv = document.getElementById('player');
    var playerElement = setupWebRtcPlayer(playerDiv, config);
    resizePlayerStyle();
    switch (inputOptions.controlScheme) {
    case ControlSchemeType.HoveringMouse:
        registerHoveringMouseEvents(playerElement);
        break;
    case ControlSchemeType.LockedMouse:
        registerLockedMouseEvents(playerElement);
        break;
    default:
        console.log('ERROR: Unknown control scheme '.concat(inputOptions.controlScheme));
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
function api_send(proto, data, callback) {
    var jsonData = {
        command: 'event',
        func_name: proto,
        args: data
    };
    {
        console.log('send:', jsonData);
    }
    responseEventListeners.set(proto, callback);
    emitUIInteraction(jsonData);
}
function onResponse(response) {
    console.log(_typeof(response));
    {
        console.log('recv:', response);
    }
    var jsonData = JSON.parse(response);
    if (jsonData.command !== 'event') {
        console.log('unexpected response:', response);
        return;
    }
    var proto = jsonData.func_name;
    var callback = responseEventListeners.get(proto);
    if (callback) {
        callback(jsonData.args);
    }
}
function api_register(proto, callback) {
    responseEventListeners.set(proto, callback);
}
function api_unregister(proto) {
    responseEventListeners['delete'](proto);
}
function app_load(signalServerAddr, onFinish) {
    console.log('ws to signal server: ', signalServerAddr);
    signalServer = signalServerAddr;
    onDataChannelConnected = onFinish;
    load();
}
function app_load2(url, onFinish) {
    ajax({
        path: url,
        method: 'get'
    }).then(function (res) {
        if (res && res.data) {
            app_load(res.data, onFinish);
        }
    });
}

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  _vm._self._c || _h;
  return _vm._m(0)
};
var __vue_staticRenderFns__ = [
  function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { attrs: { id: "playerUI" } }, [
      _c("div", { attrs: { id: "player" } }),
      _vm._v(" "),
      _c("video", {
        staticStyle: {
          width: "100%",
          height: "100%",
          position: "absolute",
          "object-fit": "fill",
        },
        attrs: { id: "streamingVideo", playsinline: "" },
      }),
    ])
  },
];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = "data-v-3b6435f9";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    {},
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

  var __vue_component__$1 = __vue_component__;

var METHOD_TYPE = {
    CHANE_RISK_CHART: 'changeRiskChart',
    CHANE_MONITOR_CHART: 'changeMonitorChart',
    GO_TO_WATER_DETAIL: 'goToWaterDetail',
    GO_TO_FIRE_DETAIL: 'goToFireDetail',
    SWITCH_FIRE: 'switchFire',
    SWITCH_WATER: 'switchWater',
    CHANGE_3D_SCENE: 'change3DScene',
    MARK_SYMBOL: 'markSymbol',
    ON_ENTER_3D_SCENE: 'Enter3DSecene'
};
var SCENE_TYPE = {
    FIRE: 'fire',
    WATER: 'water',
    TECHNOLOGY: 'technology',
    TECHNOLOGY_DETAIL: 'technologyDetail',
    TECHNOLOGY_DETAIL_FIRE: 'technologyDetailFire',
    TECHNOLOGY_DETAIL_WATER: 'technologyDetailWater'
};
var MARK_TYPE = {
    DEFAULT: 'default',
    GAS: 'gas',
    HEAT: 'heat',
    BRIDGE: 'bridge',
    PIPE: 'pipe',
    WATER_SUPPLY: 'waterSupply',
    DRAIN: 'drain',
    SUBWAY_TUNNEL: 'subwayTunnel',
    ELEVATOR: 'elevator',
    FIRE_CONTROL: 'fireControl'
};

export { MARK_TYPE, METHOD_TYPE, SCENE_TYPE, __vue_component__$1 as UEPlayer, api_register, api_send, api_unregister, app_load, app_load2 };
