function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
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
function app_load3(url, option, onFinish) {
    afk = _objectSpread2(_objectSpread2({}, afk), option);
    ajax({
        path: url,
        method: 'get'
    }).then(function (res) {
        if (res && res.data) {
            app_load(res.data, onFinish);
        }
    });
}

function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
}
const GLOBALS_WHITE_LISTED = 'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' + 'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' + 'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt';
const isGloballyWhitelisted = makeMap(GLOBALS_WHITE_LISTED);
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
makeMap(specialBooleanAttrs);
makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,` + `loop,open,required,reversed,scoped,seamless,` + `checked,muted,multiple,selected`);
makeMap(`animation-iteration-count,border-image-outset,border-image-slice,` + `border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,` + `columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,` + `grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,` + `grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,` + `line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,` + `fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,` + `stroke-miterlimit,stroke-opacity,stroke-width`);
makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,` + `autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,` + `border,buffered,capture,challenge,charset,checked,cite,class,code,` + `codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,` + `coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,` + `disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,` + `formaction,formenctype,formmethod,formnovalidate,formtarget,headers,` + `height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,` + `ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,` + `manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,` + `open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,` + `referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,` + `selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,` + `start,step,style,summary,tabindex,target,title,translate,type,usemap,` + `value,width,wrap`);
makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,` + `arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,` + `baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,` + `clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,` + `color-interpolation-filters,color-profile,color-rendering,` + `contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,` + `descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,` + `dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,` + `fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,` + `font-family,font-size,font-size-adjust,font-stretch,font-style,` + `font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,` + `glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,` + `gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,` + `horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,` + `k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,` + `lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,` + `marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,` + `mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,` + `name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,` + `overflow,overline-position,overline-thickness,panose-1,paint-order,path,` + `pathLength,patternContentUnits,patternTransform,patternUnits,ping,` + `pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,` + `preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,` + `rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,` + `restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,` + `specularConstant,specularExponent,speed,spreadMethod,startOffset,` + `stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,` + `strikethrough-position,strikethrough-thickness,string,stroke,` + `stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,` + `stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,` + `systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,` + `text-decoration,text-rendering,textLength,to,transform,transform-origin,` + `type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,` + `unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,` + `v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,` + `vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,` + `writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,` + `xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,` + `xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
function normalizeStyle(value) {
    if (isArray(value)) {
        const res = {};
        for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
            if (normalized) {
                for (const key in normalized) {
                    res[key] = normalized[key];
                }
            }
        }
        return res;
    } else if (isString(value)) {
        return value;
    } else if (isObject(value)) {
        return value;
    }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
    const ret = {};
    cssText.split(listDelimiterRE).forEach(item => {
        if (item) {
            const tmp = item.split(propertyDelimiterRE);
            tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
        }
    });
    return ret;
}
function normalizeClass(value) {
    let res = '';
    if (isString(value)) {
        res = value;
    } else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            const normalized = normalizeClass(value[i]);
            if (normalized) {
                res += normalized + ' ';
            }
        }
    } else if (isObject(value)) {
        for (const name in value) {
            if (value[name]) {
                res += name + ' ';
            }
        }
    }
    return res.trim();
}
const HTML_TAGS = 'html,body,base,head,link,meta,style,title,address,article,aside,footer,' + 'header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,' + 'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' + 'data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,' + 'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' + 'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' + 'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' + 'option,output,progress,select,textarea,details,dialog,menu,' + 'summary,template,blockquote,iframe,tfoot';
const SVG_TAGS = 'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,' + 'defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,' + 'feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,' + 'feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,' + 'feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,' + 'fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,' + 'foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,' + 'mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,' + 'polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,' + 'text,textPath,title,tspan,unknown,use,view';
const VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';
makeMap(HTML_TAGS);
makeMap(SVG_TAGS);
makeMap(VOID_TAGS);
const EMPTY_OBJ = process.env.NODE_ENV !== 'production' ? Object.freeze({}) : {};
const EMPTY_ARR = process.env.NODE_ENV !== 'production' ? Object.freeze([]) : [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = key => onRE.test(key);
const extend = Object.assign;
const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
        arr.splice(i, 1);
    }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = val => toTypeString(val) === '[object Map]';
const isSet = val => toTypeString(val) === '[object Set]';
const isFunction = val => typeof val === 'function';
const isString = val => typeof val === 'string';
const isSymbol = val => typeof val === 'symbol';
const isObject = val => val !== null && typeof val === 'object';
const isPromise = val => {
    return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = value => objectToString.call(value);
const toRawType = value => {
    return toTypeString(value).slice(8, -1);
};
const isPlainObject = val => toTypeString(val) === '[object Object]';
const isIntegerKey = key => isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key;
makeMap(',key,ref,ref_for,ref_key,' + 'onVnodeBeforeMount,onVnodeMounted,' + 'onVnodeBeforeUpdate,onVnodeUpdated,' + 'onVnodeBeforeUnmount,onVnodeUnmounted');
makeMap('bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo');
const cacheStringFunction = fn => {
    const cache = Object.create(null);
    return str => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    };
};
const capitalize = cacheStringFunction(str => str.charAt(0).toUpperCase() + str.slice(1));
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        value
    });
};
let _globalThis;
const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {});
};

function warn$1(msg, ...args) {
    console.warn(`[Vue warn] ${ msg }`, ...args);
}
let activeEffectScope;
function recordEffectScope(effect, scope = activeEffectScope) {
    if (scope && scope.active) {
        scope.effects.push(effect);
    }
}
const createDep = effects => {
    const dep = new Set(effects);
    dep.w = 0;
    dep.n = 0;
    return dep;
};
const wasTracked = dep => (dep.w & trackOpBit) > 0;
const newTracked = dep => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({deps}) => {
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].w |= trackOpBit;
        }
    }
};
const finalizeDepMarkers = effect => {
    const {deps} = effect;
    if (deps.length) {
        let ptr = 0;
        for (let i = 0; i < deps.length; i++) {
            const dep = deps[i];
            if (wasTracked(dep) && !newTracked(dep)) {
                dep.delete(effect);
            } else {
                deps[ptr++] = dep;
            }
            dep.w &= ~trackOpBit;
            dep.n &= ~trackOpBit;
        }
        deps.length = ptr;
    }
};
const targetMap = new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol(process.env.NODE_ENV !== 'production' ? 'iterate' : '');
const MAP_KEY_ITERATE_KEY = Symbol(process.env.NODE_ENV !== 'production' ? 'Map key iterate' : '');
class ReactiveEffect {
    constructor(fn, scheduler = null, scope) {
        this.fn = fn;
        this.scheduler = scheduler;
        this.active = true;
        this.deps = [];
        this.parent = undefined;
        recordEffectScope(this, scope);
    }
    run() {
        if (!this.active) {
            return this.fn();
        }
        let parent = activeEffect;
        let lastShouldTrack = shouldTrack;
        while (parent) {
            if (parent === this) {
                return;
            }
            parent = parent.parent;
        }
        try {
            this.parent = activeEffect;
            activeEffect = this;
            shouldTrack = true;
            trackOpBit = 1 << ++effectTrackDepth;
            if (effectTrackDepth <= maxMarkerBits) {
                initDepMarkers(this);
            } else {
                cleanupEffect(this);
            }
            return this.fn();
        } finally {
            if (effectTrackDepth <= maxMarkerBits) {
                finalizeDepMarkers(this);
            }
            trackOpBit = 1 << --effectTrackDepth;
            activeEffect = this.parent;
            shouldTrack = lastShouldTrack;
            this.parent = undefined;
            if (this.deferStop) {
                this.stop();
            }
        }
    }
    stop() {
        if (activeEffect === this) {
            this.deferStop = true;
        } else if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    }
}
function cleanupEffect(effect) {
    const {deps} = effect;
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
}
function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === undefined ? true : last;
}
function track(target, type, key) {
    if (shouldTrack && activeEffect) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, depsMap = new Map());
        }
        let dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, dep = createDep());
        }
        const eventInfo = process.env.NODE_ENV !== 'production' ? {
            effect: activeEffect,
            target,
            type,
            key
        } : undefined;
        trackEffects(dep, eventInfo);
    }
}
function trackEffects(dep, debuggerEventExtraInfo) {
    let shouldTrack = false;
    if (effectTrackDepth <= maxMarkerBits) {
        if (!newTracked(dep)) {
            dep.n |= trackOpBit;
            shouldTrack = !wasTracked(dep);
        }
    } else {
        shouldTrack = !dep.has(activeEffect);
    }
    if (shouldTrack) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        if (process.env.NODE_ENV !== 'production' && activeEffect.onTrack) {
            activeEffect.onTrack(Object.assign({ effect: activeEffect }, debuggerEventExtraInfo));
        }
    }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    let deps = [];
    if (type === 'clear') {
        deps = [...depsMap.values()];
    } else if (key === 'length' && isArray(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= newValue) {
                deps.push(dep);
            }
        });
    } else {
        if (key !== void 0) {
            deps.push(depsMap.get(key));
        }
        switch (type) {
        case 'add':
            if (!isArray(target)) {
                deps.push(depsMap.get(ITERATE_KEY));
                if (isMap(target)) {
                    deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
                }
            } else if (isIntegerKey(key)) {
                deps.push(depsMap.get('length'));
            }
            break;
        case 'delete':
            if (!isArray(target)) {
                deps.push(depsMap.get(ITERATE_KEY));
                if (isMap(target)) {
                    deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
                }
            }
            break;
        case 'set':
            if (isMap(target)) {
                deps.push(depsMap.get(ITERATE_KEY));
            }
            break;
        }
    }
    const eventInfo = process.env.NODE_ENV !== 'production' ? {
        target,
        type,
        key,
        newValue,
        oldValue,
        oldTarget
    } : undefined;
    if (deps.length === 1) {
        if (deps[0]) {
            if (process.env.NODE_ENV !== 'production') {
                triggerEffects(deps[0], eventInfo);
            } else {
                triggerEffects(deps[0]);
            }
        }
    } else {
        const effects = [];
        for (const dep of deps) {
            if (dep) {
                effects.push(...dep);
            }
        }
        if (process.env.NODE_ENV !== 'production') {
            triggerEffects(createDep(effects), eventInfo);
        } else {
            triggerEffects(createDep(effects));
        }
    }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
    const effects = isArray(dep) ? dep : [...dep];
    for (const effect of effects) {
        if (effect.computed) {
            triggerEffect(effect, debuggerEventExtraInfo);
        }
    }
    for (const effect of effects) {
        if (!effect.computed) {
            triggerEffect(effect, debuggerEventExtraInfo);
        }
    }
}
function triggerEffect(effect, debuggerEventExtraInfo) {
    if (effect !== activeEffect || effect.allowRecurse) {
        if (process.env.NODE_ENV !== 'production' && effect.onTrigger) {
            effect.onTrigger(extend({ effect }, debuggerEventExtraInfo));
        }
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}
const isNonTrackableKeys = makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).filter(key => key !== 'arguments' && key !== 'caller').map(key => Symbol[key]).filter(isSymbol));
const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const arrayInstrumentations = createArrayInstrumentations();
function createArrayInstrumentations() {
    const instrumentations = {};
    [
        'includes',
        'indexOf',
        'lastIndexOf'
    ].forEach(key => {
        instrumentations[key] = function (...args) {
            const arr = toRaw(this);
            for (let i = 0, l = this.length; i < l; i++) {
                track(arr, 'get', i + '');
            }
            const res = arr[key](...args);
            if (res === -1 || res === false) {
                return arr[key](...args.map(toRaw));
            } else {
                return res;
            }
        };
    });
    [
        'push',
        'pop',
        'shift',
        'unshift',
        'splice'
    ].forEach(key => {
        instrumentations[key] = function (...args) {
            pauseTracking();
            const res = toRaw(this)[key].apply(this, args);
            resetTracking();
            return res;
        };
    });
    return instrumentations;
}
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        if (key === '__v_isReactive') {
            return !isReadonly;
        } else if (key === '__v_isReadonly') {
            return isReadonly;
        } else if (key === '__v_isShallow') {
            return shallow;
        } else if (key === '__v_raw' && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
            return target;
        }
        const targetIsArray = isArray(target);
        if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
            return Reflect.get(arrayInstrumentations, key, receiver);
        }
        const res = Reflect.get(target, key, receiver);
        if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
            return res;
        }
        if (!isReadonly) {
            track(target, 'get', key);
        }
        if (shallow) {
            return res;
        }
        if (isRef(res)) {
            return targetIsArray && isIntegerKey(key) ? res : res.value;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
const set = createSetter();
const shallowSet = createSetter(true);
function createSetter(shallow = false) {
    return function set(target, key, value, receiver) {
        let oldValue = target[key];
        if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
            return false;
        }
        if (!shallow) {
            if (!isShallow(value) && !isReadonly(value)) {
                oldValue = toRaw(oldValue);
                value = toRaw(value);
            }
            if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
                return true;
            }
        }
        const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
        const result = Reflect.set(target, key, value, receiver);
        if (target === toRaw(receiver)) {
            if (!hadKey) {
                trigger(target, 'add', key, value);
            } else if (hasChanged(value, oldValue)) {
                trigger(target, 'set', key, value, oldValue);
            }
        }
        return result;
    };
}
function deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
        trigger(target, 'delete', key, undefined, oldValue);
    }
    return result;
}
function has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, 'has', key);
    }
    return result;
}
function ownKeys(target) {
    track(target, 'iterate', isArray(target) ? 'length' : ITERATE_KEY);
    return Reflect.ownKeys(target);
}
const mutableHandlers = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
        if (process.env.NODE_ENV !== 'production') {
            warn$1(`Set operation on key "${ String(key) }" failed: target is readonly.`, target);
        }
        return true;
    },
    deleteProperty(target, key) {
        if (process.env.NODE_ENV !== 'production') {
            warn$1(`Delete operation on key "${ String(key) }" failed: target is readonly.`, target);
        }
        return true;
    }
};
extend({}, mutableHandlers, {
    get: shallowGet,
    set: shallowSet
});
const shallowReadonlyHandlers = extend({}, readonlyHandlers, { get: shallowReadonlyGet });
const toShallow = value => value;
const getProto = v => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly = false, isShallow = false) {
    target = target['__v_raw'];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (!isReadonly) {
        if (key !== rawKey) {
            track(rawTarget, 'get', key);
        }
        track(rawTarget, 'get', rawKey);
    }
    const {has} = getProto(rawTarget);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    if (has.call(rawTarget, key)) {
        return wrap(target.get(key));
    } else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
    } else if (target !== rawTarget) {
        target.get(key);
    }
}
function has$1(key, isReadonly = false) {
    const target = this['__v_raw'];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (!isReadonly) {
        if (key !== rawKey) {
            track(rawTarget, 'has', key);
        }
        track(rawTarget, 'has', rawKey);
    }
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly = false) {
    target = target['__v_raw'];
    !isReadonly && track(toRaw(target), 'iterate', ITERATE_KEY);
    return Reflect.get(target, 'size', target);
}
function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    if (!hadKey) {
        target.add(value);
        trigger(target, 'add', value, value);
    }
    return this;
}
function set$1(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const {has, get} = getProto(target);
    let hadKey = has.call(target, key);
    if (!hadKey) {
        key = toRaw(key);
        hadKey = has.call(target, key);
    } else if (process.env.NODE_ENV !== 'production') {
        checkIdentityKeys(target, has, key);
    }
    const oldValue = get.call(target, key);
    target.set(key, value);
    if (!hadKey) {
        trigger(target, 'add', key, value);
    } else if (hasChanged(value, oldValue)) {
        trigger(target, 'set', key, value, oldValue);
    }
    return this;
}
function deleteEntry(key) {
    const target = toRaw(this);
    const {has, get} = getProto(target);
    let hadKey = has.call(target, key);
    if (!hadKey) {
        key = toRaw(key);
        hadKey = has.call(target, key);
    } else if (process.env.NODE_ENV !== 'production') {
        checkIdentityKeys(target, has, key);
    }
    const oldValue = get ? get.call(target, key) : undefined;
    const result = target.delete(key);
    if (hadKey) {
        trigger(target, 'delete', key, undefined, oldValue);
    }
    return result;
}
function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget = process.env.NODE_ENV !== 'production' ? isMap(target) ? new Map(target) : new Set(target) : undefined;
    const result = target.clear();
    if (hadItems) {
        trigger(target, 'clear', undefined, undefined, oldTarget);
    }
    return result;
}
function createForEach(isReadonly, isShallow) {
    return function forEach(callback, thisArg) {
        const observed = this;
        const target = observed['__v_raw'];
        const rawTarget = toRaw(target);
        const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
        !isReadonly && track(rawTarget, 'iterate', ITERATE_KEY);
        return target.forEach((value, key) => {
            return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
    };
}
function createIterableMethod(method, isReadonly, isShallow) {
    return function (...args) {
        const target = this['__v_raw'];
        const rawTarget = toRaw(target);
        const targetIsMap = isMap(rawTarget);
        const isPair = method === 'entries' || method === Symbol.iterator && targetIsMap;
        const isKeyOnly = method === 'keys' && targetIsMap;
        const innerIterator = target[method](...args);
        const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
        !isReadonly && track(rawTarget, 'iterate', isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
        return {
            next() {
                const {value, done} = innerIterator.next();
                return done ? {
                    value,
                    done
                } : {
                    value: isPair ? [
                        wrap(value[0]),
                        wrap(value[1])
                    ] : wrap(value),
                    done
                };
            },
            [Symbol.iterator]() {
                return this;
            }
        };
    };
}
function createReadonlyMethod(type) {
    return function (...args) {
        if (process.env.NODE_ENV !== 'production') {
            const key = args[0] ? `on key "${ args[0] }" ` : ``;
            console.warn(`${ capitalize(type) } operation ${ key }failed: target is readonly.`, toRaw(this));
        }
        return type === 'delete' ? false : this;
    };
}
function createInstrumentations() {
    const mutableInstrumentations = {
        get(key) {
            return get$1(this, key);
        },
        get size() {
            return size(this);
        },
        has: has$1,
        add,
        set: set$1,
        delete: deleteEntry,
        clear,
        forEach: createForEach(false, false)
    };
    const shallowInstrumentations = {
        get(key) {
            return get$1(this, key, false, true);
        },
        get size() {
            return size(this);
        },
        has: has$1,
        add,
        set: set$1,
        delete: deleteEntry,
        clear,
        forEach: createForEach(false, true)
    };
    const readonlyInstrumentations = {
        get(key) {
            return get$1(this, key, true);
        },
        get size() {
            return size(this, true);
        },
        has(key) {
            return has$1.call(this, key, true);
        },
        add: createReadonlyMethod('add'),
        set: createReadonlyMethod('set'),
        delete: createReadonlyMethod('delete'),
        clear: createReadonlyMethod('clear'),
        forEach: createForEach(true, false)
    };
    const shallowReadonlyInstrumentations = {
        get(key) {
            return get$1(this, key, true, true);
        },
        get size() {
            return size(this, true);
        },
        has(key) {
            return has$1.call(this, key, true);
        },
        add: createReadonlyMethod('add'),
        set: createReadonlyMethod('set'),
        delete: createReadonlyMethod('delete'),
        clear: createReadonlyMethod('clear'),
        forEach: createForEach(true, true)
    };
    const iteratorMethods = [
        'keys',
        'values',
        'entries',
        Symbol.iterator
    ];
    iteratorMethods.forEach(method => {
        mutableInstrumentations[method] = createIterableMethod(method, false, false);
        readonlyInstrumentations[method] = createIterableMethod(method, true, false);
        shallowInstrumentations[method] = createIterableMethod(method, false, true);
        shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
    });
    return [
        mutableInstrumentations,
        readonlyInstrumentations,
        shallowInstrumentations,
        shallowReadonlyInstrumentations
    ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = createInstrumentations();
function createInstrumentationGetter(isReadonly, shallow) {
    const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => {
        if (key === '__v_isReactive') {
            return !isReadonly;
        } else if (key === '__v_isReadonly') {
            return isReadonly;
        } else if (key === '__v_raw') {
            return target;
        }
        return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
    };
}
const mutableCollectionHandlers = { get: createInstrumentationGetter(false, false) };
const readonlyCollectionHandlers = { get: createInstrumentationGetter(true, false) };
const shallowReadonlyCollectionHandlers = { get: createInstrumentationGetter(true, true) };
function checkIdentityKeys(target, has, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has.call(target, rawKey)) {
        const type = toRawType(target);
        console.warn(`Reactive ${ type } contains both the raw and reactive ` + `versions of the same object${ type === `Map` ? ` as keys` : `` }, ` + `which can lead to inconsistencies. ` + `Avoid differentiating between the raw and reactive versions ` + `of an object and only use the reactive version if possible.`);
    }
}
const reactiveMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
function targetTypeMap(rawType) {
    switch (rawType) {
    case 'Object':
    case 'Array':
        return 1;
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
        return 2;
    default:
        return 0;
    }
}
function getTargetType(value) {
    return value['__v_skip'] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
    if (isReadonly(target)) {
        return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`value cannot be made reactive: ${ String(target) }`);
        }
        return target;
    }
    if (target['__v_raw'] && !(isReadonly && target['__v_isReactive'])) {
        return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
        return target;
    }
    const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}
function isReactive(value) {
    if (isReadonly(value)) {
        return isReactive(value['__v_raw']);
    }
    return !!(value && value['__v_isReactive']);
}
function isReadonly(value) {
    return !!(value && value['__v_isReadonly']);
}
function isShallow(value) {
    return !!(value && value['__v_isShallow']);
}
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
    const raw = observed && observed['__v_raw'];
    return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
    def(value, '__v_skip', true);
    return value;
}
const toReactive = value => isObject(value) ? reactive(value) : value;
const toReadonly = value => isObject(value) ? readonly(value) : value;
function isRef(r) {
    return !!(r && r.__v_isRef === true);
}
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
const shallowUnwrapHandlers = {
    get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
            oldValue.value = value;
            return true;
        } else {
            return Reflect.set(target, key, value, receiver);
        }
    }
};
function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
Promise.resolve();

const stack = [];
function pushWarningContext(vnode) {
    stack.push(vnode);
}
function popWarningContext() {
    stack.pop();
}
function warn(msg, ...args) {
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
        callWithErrorHandling(appWarnHandler, instance, 11, [
            msg + args.join(''),
            instance && instance.proxy,
            trace.map(({vnode}) => `at <${ formatComponentName(instance, vnode.type) }>`).join('\n'),
            trace
        ]);
    } else {
        const warnArgs = [
            `[Vue warn]: ${ msg }`,
            ...args
        ];
        if (trace.length && !false) {
            warnArgs.push(`\n`, ...formatTrace(trace));
        }
        console.warn(...warnArgs);
    }
    resetTracking();
}
function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
        return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
        const last = normalizedStack[0];
        if (last && last.vnode === currentVNode) {
            last.recurseCount++;
        } else {
            normalizedStack.push({
                vnode: currentVNode,
                recurseCount: 0
            });
        }
        const parentInstance = currentVNode.component && currentVNode.component.parent;
        currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
}
function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
        logs.push(...i === 0 ? [] : [`\n`], ...formatTraceEntry(entry));
    });
    return logs;
}
function formatTraceEntry({vnode, recurseCount}) {
    const postfix = recurseCount > 0 ? `... (${ recurseCount } recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${ formatComponentName(vnode.component, vnode.type, isRoot) }`;
    const close = `>` + postfix;
    return vnode.props ? [
        open,
        ...formatProps(vnode.props),
        close
    ] : [open + close];
}
function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach(key => {
        res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
        res.push(` ...`);
    }
    return res;
}
function formatProp(key, value, raw) {
    if (isString(value)) {
        value = JSON.stringify(value);
        return raw ? value : [`${ key }=${ value }`];
    } else if (typeof value === 'number' || typeof value === 'boolean' || value == null) {
        return raw ? value : [`${ key }=${ value }`];
    } else if (isRef(value)) {
        value = formatProp(key, toRaw(value.value), true);
        return raw ? value : [
            `${ key }=Ref<`,
            value,
            `>`
        ];
    } else if (isFunction(value)) {
        return [`${ key }=fn${ value.name ? `<${ value.name }>` : `` }`];
    } else {
        value = toRaw(value);
        return raw ? value : [
            `${ key }=`,
            value
        ];
    }
}
const ErrorTypeStrings = {
    ['sp']: 'serverPrefetch hook',
    ['bc']: 'beforeCreate hook',
    ['c']: 'created hook',
    ['bm']: 'beforeMount hook',
    ['m']: 'mounted hook',
    ['bu']: 'beforeUpdate hook',
    ['u']: 'updated',
    ['bum']: 'beforeUnmount hook',
    ['um']: 'unmounted hook',
    ['a']: 'activated hook',
    ['da']: 'deactivated hook',
    ['ec']: 'errorCaptured hook',
    ['rtc']: 'renderTracked hook',
    ['rtg']: 'renderTriggered hook',
    [0]: 'setup function',
    [1]: 'render function',
    [2]: 'watcher getter',
    [3]: 'watcher callback',
    [4]: 'watcher cleanup function',
    [5]: 'native event handler',
    [6]: 'component event handler',
    [7]: 'vnode hook',
    [8]: 'directive hook',
    [9]: 'transition hook',
    [10]: 'app errorHandler',
    [11]: 'app warnHandler',
    [12]: 'ref function',
    [13]: 'async component loader',
    [14]: 'scheduler flush. This is likely a Vue internals bug. ' + 'Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core'
};
function callWithErrorHandling(fn, instance, type, args) {
    let res;
    try {
        res = args ? fn(...args) : fn();
    } catch (err) {
        handleError(err, instance, type);
    }
    return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
        const res = callWithErrorHandling(fn, instance, type, args);
        if (res && isPromise(res)) {
            res.catch(err => {
                handleError(err, instance, type);
            });
        }
        return res;
    }
    const values = [];
    for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
}
function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    if (instance) {
        let cur = instance.parent;
        const exposedInstance = instance.proxy;
        const errorInfo = process.env.NODE_ENV !== 'production' ? ErrorTypeStrings[type] : type;
        while (cur) {
            const errorCapturedHooks = cur.ec;
            if (errorCapturedHooks) {
                for (let i = 0; i < errorCapturedHooks.length; i++) {
                    if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
                        return;
                    }
                }
            }
            cur = cur.parent;
        }
        const appErrorHandler = instance.appContext.config.errorHandler;
        if (appErrorHandler) {
            callWithErrorHandling(appErrorHandler, null, 10, [
                err,
                exposedInstance,
                errorInfo
            ]);
            return;
        }
    }
    logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
    if (process.env.NODE_ENV !== 'production') {
        const info = ErrorTypeStrings[type];
        if (contextVNode) {
            pushWarningContext(contextVNode);
        }
        warn(`Unhandled error${ info ? ` during execution of ${ info }` : `` }`);
        if (contextVNode) {
            popWarningContext();
        }
        if (throwInDev) {
            throw err;
        } else {
            console.error(err);
        }
    } else {
        console.error(err);
    }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;
const RECURSION_LIMIT = 100;
function nextTick(fn) {
    const p = currentFlushPromise || resolvedPromise;
    return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
        const middle = start + end >>> 1;
        const middleJobId = getId(queue[middle]);
        middleJobId < id ? start = middle + 1 : end = middle;
    }
    return start;
}
function queueJob(job) {
    if (!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) {
        if (job.id == null) {
            queue.push(job);
        } else {
            queue.splice(findInsertionIndex(job.id), 0, job);
        }
        queueFlush();
    }
}
function queueFlush() {
    if (!isFlushing && !isFlushPending) {
        isFlushPending = true;
        currentFlushPromise = resolvedPromise.then(flushJobs);
    }
}
function queuePostFlushCb(cb) {
    if (!isArray(cb)) {
        if (!activePostFlushCbs || !activePostFlushCbs.includes(cb, cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex)) {
            pendingPostFlushCbs.push(cb);
        }
    } else {
        pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
}
function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
        const deduped = [...new Set(pendingPostFlushCbs)];
        pendingPostFlushCbs.length = 0;
        if (activePostFlushCbs) {
            activePostFlushCbs.push(...deduped);
            return;
        }
        activePostFlushCbs = deduped;
        if (process.env.NODE_ENV !== 'production') {
            seen = seen || new Map();
        }
        activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
        for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
            if (process.env.NODE_ENV !== 'production' && checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
                continue;
            }
            activePostFlushCbs[postFlushIndex]();
        }
        activePostFlushCbs = null;
        postFlushIndex = 0;
    }
}
const getId = job => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
    const diff = getId(a) - getId(b);
    if (diff === 0) {
        if (a.pre && !b.pre)
            return -1;
        if (b.pre && !a.pre)
            return 1;
    }
    return diff;
};
function flushJobs(seen) {
    isFlushPending = false;
    isFlushing = true;
    if (process.env.NODE_ENV !== 'production') {
        seen = seen || new Map();
    }
    queue.sort(comparator);
    const check = process.env.NODE_ENV !== 'production' ? job => checkRecursiveUpdates(seen, job) : NOOP;
    try {
        for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
            const job = queue[flushIndex];
            if (job && job.active !== false) {
                if (process.env.NODE_ENV !== 'production' && check(job)) {
                    continue;
                }
                callWithErrorHandling(job, null, 14);
            }
        }
    } finally {
        flushIndex = 0;
        queue.length = 0;
        flushPostFlushCbs(seen);
        isFlushing = false;
        currentFlushPromise = null;
        if (queue.length || pendingPostFlushCbs.length) {
            flushJobs(seen);
        }
    }
}
function checkRecursiveUpdates(seen, fn) {
    if (!seen.has(fn)) {
        seen.set(fn, 1);
    } else {
        const count = seen.get(fn);
        if (count > RECURSION_LIMIT) {
            const instance = fn.ownerInstance;
            const componentName = instance && getComponentName(instance.type);
            warn(`Maximum recursive updates exceeded${ componentName ? ` in component <${ componentName }>` : `` }. ` + `This means you have a reactive effect that is mutating its own ` + `dependencies and thus recursively triggering itself. Possible sources ` + `include component template, render function, updated hook or ` + `watcher source function.`);
            return true;
        } else {
            seen.set(fn, count + 1);
        }
    }
}
const hmrDirtyComponents = new Set();
if (process.env.NODE_ENV !== 'production') {
    getGlobalThis().__VUE_HMR_RUNTIME__ = {
        createRecord: tryWrap(createRecord),
        rerender: tryWrap(rerender),
        reload: tryWrap(reload)
    };
}
const map = new Map();
function createRecord(id, initialDef) {
    if (map.has(id)) {
        return false;
    }
    map.set(id, {
        initialDef: normalizeClassComponent(initialDef),
        instances: new Set()
    });
    return true;
}
function normalizeClassComponent(component) {
    return isClassComponent(component) ? component.__vccOpts : component;
}
function rerender(id, newRender) {
    const record = map.get(id);
    if (!record) {
        return;
    }
    record.initialDef.render = newRender;
    [...record.instances].forEach(instance => {
        if (newRender) {
            instance.render = newRender;
            normalizeClassComponent(instance.type).render = newRender;
        }
        instance.renderCache = [];
        instance.update();
    });
}
function reload(id, newComp) {
    const record = map.get(id);
    if (!record)
        return;
    newComp = normalizeClassComponent(newComp);
    updateComponentDef(record.initialDef, newComp);
    const instances = [...record.instances];
    for (const instance of instances) {
        const oldComp = normalizeClassComponent(instance.type);
        if (!hmrDirtyComponents.has(oldComp)) {
            if (oldComp !== record.initialDef) {
                updateComponentDef(oldComp, newComp);
            }
            hmrDirtyComponents.add(oldComp);
        }
        instance.appContext.optionsCache.delete(instance.type);
        if (instance.ceReload) {
            hmrDirtyComponents.add(oldComp);
            instance.ceReload(newComp.styles);
            hmrDirtyComponents.delete(oldComp);
        } else if (instance.parent) {
            queueJob(instance.parent.update);
            if (instance.parent.type.__asyncLoader && instance.parent.ceReload) {
                instance.parent.ceReload(newComp.styles);
            }
        } else if (instance.appContext.reload) {
            instance.appContext.reload();
        } else if (typeof window !== 'undefined') {
            window.location.reload();
        } else {
            console.warn('[HMR] Root or manually mounted instance modified. Full reload required.');
        }
    }
    queuePostFlushCb(() => {
        for (const instance of instances) {
            hmrDirtyComponents.delete(normalizeClassComponent(instance.type));
        }
    });
}
function updateComponentDef(oldComp, newComp) {
    extend(oldComp, newComp);
    for (const key in oldComp) {
        if (key !== '__file' && !(key in newComp)) {
            delete oldComp[key];
        }
    }
}
function tryWrap(fn) {
    return (id, arg) => {
        try {
            return fn(id, arg);
        } catch (e) {
            console.error(e);
            console.warn(`[HMR] Something went wrong during Vue component hot-reload. ` + `Full reload required.`);
        }
    };
}
let currentRenderingInstance = null;
let currentScopeId = null;
function pushScopeId(id) {
    currentScopeId = id;
}
function popScopeId() {
    currentScopeId = null;
}
function markAttrsAccessed() {
}
const isSuspense = type => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
        if (isArray(fn)) {
            suspense.effects.push(...fn);
        } else {
            suspense.effects.push(fn);
        }
    } else {
        queuePostFlushCb(fn);
    }
}
const INITIAL_WATCHER_VALUE = {};
function doWatch(source, cb, {immediate, deep, flush, onTrack, onTrigger} = EMPTY_OBJ) {
    if (process.env.NODE_ENV !== 'production' && !cb) {
        if (immediate !== undefined) {
            warn(`watch() "immediate" option is only respected when using the ` + `watch(source, callback, options?) signature.`);
        }
        if (deep !== undefined) {
            warn(`watch() "deep" option is only respected when using the ` + `watch(source, callback, options?) signature.`);
        }
    }
    const warnInvalidSource = s => {
        warn(`Invalid watch source: `, s, `A watch source can only be a getter/effect function, a ref, ` + `a reactive object, or an array of these types.`);
    };
    const instance = currentInstance;
    let getter;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
        getter = () => source.value;
        forceTrigger = isShallow(source);
    } else if (isReactive(source)) {
        getter = () => source;
        deep = true;
    } else if (isArray(source)) {
        isMultiSource = true;
        forceTrigger = source.some(s => isReactive(s) || isShallow(s));
        getter = () => source.map(s => {
            if (isRef(s)) {
                return s.value;
            } else if (isReactive(s)) {
                return traverse(s);
            } else if (isFunction(s)) {
                return callWithErrorHandling(s, instance, 2);
            } else {
                process.env.NODE_ENV !== 'production' && warnInvalidSource(s);
            }
        });
    } else if (isFunction(source)) {
        if (cb) {
            getter = () => callWithErrorHandling(source, instance, 2);
        } else {
            getter = () => {
                if (instance && instance.isUnmounted) {
                    return;
                }
                if (cleanup) {
                    cleanup();
                }
                return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
            };
        }
    } else {
        getter = NOOP;
        process.env.NODE_ENV !== 'production' && warnInvalidSource(source);
    }
    if (cb && deep) {
        const baseGetter = getter;
        getter = () => traverse(baseGetter());
    }
    let cleanup;
    let onCleanup = fn => {
        cleanup = effect.onStop = () => {
            callWithErrorHandling(fn, instance, 4);
        };
    };
    let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
    const job = () => {
        if (!effect.active) {
            return;
        }
        if (cb) {
            const newValue = effect.run();
            if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
                if (cleanup) {
                    cleanup();
                }
                callWithAsyncErrorHandling(cb, instance, 3, [
                    newValue,
                    oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
                    onCleanup
                ]);
                oldValue = newValue;
            }
        } else {
            effect.run();
        }
    };
    job.allowRecurse = !!cb;
    let scheduler;
    if (flush === 'sync') {
        scheduler = job;
    } else if (flush === 'post') {
        scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
    } else {
        job.pre = true;
        if (instance)
            job.id = instance.uid;
        scheduler = () => queueJob(job);
    }
    const effect = new ReactiveEffect(getter, scheduler);
    if (process.env.NODE_ENV !== 'production') {
        effect.onTrack = onTrack;
        effect.onTrigger = onTrigger;
    }
    if (cb) {
        if (immediate) {
            job();
        } else {
            oldValue = effect.run();
        }
    } else if (flush === 'post') {
        queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
    } else {
        effect.run();
    }
    return () => {
        effect.stop();
        if (instance && instance.scope) {
            remove(instance.scope.effects, effect);
        }
    };
}
function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString(source) ? source.includes('.') ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction(value)) {
        cb = value;
    } else {
        cb = value.handler;
        options = value;
    }
    const cur = currentInstance;
    setCurrentInstance(this);
    const res = doWatch(getter, cb.bind(publicThis), options);
    if (cur) {
        setCurrentInstance(cur);
    } else {
        unsetCurrentInstance();
    }
    return res;
}
function createPathGetter(ctx, path) {
    const segments = path.split('.');
    return () => {
        let cur = ctx;
        for (let i = 0; i < segments.length && cur; i++) {
            cur = cur[segments[i]];
        }
        return cur;
    };
}
function traverse(value, seen) {
    if (!isObject(value) || value['__v_skip']) {
        return value;
    }
    seen = seen || new Set();
    if (seen.has(value)) {
        return value;
    }
    seen.add(value);
    if (isRef(value)) {
        traverse(value.value, seen);
    } else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            traverse(value[i], seen);
        }
    } else if (isSet(value) || isMap(value)) {
        value.forEach(v => {
            traverse(v, seen);
        });
    } else if (isPlainObject(value)) {
        for (const key in value) {
            traverse(value[key], seen);
        }
    }
    return value;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
const getPublicInstance = i => {
    if (!i)
        return null;
    if (isStatefulComponent(i))
        return getExposeProxy(i) || i.proxy;
    return getPublicInstance(i.parent);
};
const publicPropertiesMap = extend(Object.create(null), {
    $: i => i,
    $el: i => i.vnode.el,
    $data: i => i.data,
    $props: i => process.env.NODE_ENV !== 'production' ? shallowReadonly(i.props) : i.props,
    $attrs: i => process.env.NODE_ENV !== 'production' ? shallowReadonly(i.attrs) : i.attrs,
    $slots: i => process.env.NODE_ENV !== 'production' ? shallowReadonly(i.slots) : i.slots,
    $refs: i => process.env.NODE_ENV !== 'production' ? shallowReadonly(i.refs) : i.refs,
    $parent: i => getPublicInstance(i.parent),
    $root: i => getPublicInstance(i.root),
    $emit: i => i.emit,
    $options: i => __VUE_OPTIONS_API__ ? resolveMergedOptions(i) : i.type,
    $forceUpdate: i => i.f || (i.f = () => queueJob(i.update)),
    $nextTick: i => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: i => __VUE_OPTIONS_API__ ? instanceWatch.bind(i) : NOOP
});
const isReservedPrefix = key => key === '_' || key === '$';
const PublicInstanceProxyHandlers = {
    get({_: instance}, key) {
        const {ctx, setupState, data, props, accessCache, type, appContext} = instance;
        if (process.env.NODE_ENV !== 'production' && key === '__isVue') {
            return true;
        }
        if (process.env.NODE_ENV !== 'production' && setupState !== EMPTY_OBJ && setupState.__isScriptSetup && hasOwn(setupState, key)) {
            return setupState[key];
        }
        let normalizedProps;
        if (key[0] !== '$') {
            const n = accessCache[key];
            if (n !== undefined) {
                switch (n) {
                case 1:
                    return setupState[key];
                case 2:
                    return data[key];
                case 4:
                    return ctx[key];
                case 3:
                    return props[key];
                }
            } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
                accessCache[key] = 1;
                return setupState[key];
            } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
                accessCache[key] = 2;
                return data[key];
            } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
                accessCache[key] = 3;
                return props[key];
            } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
                accessCache[key] = 4;
                return ctx[key];
            } else if (!__VUE_OPTIONS_API__ || shouldCacheAccess) {
                accessCache[key] = 0;
            }
        }
        const publicGetter = publicPropertiesMap[key];
        let cssModule, globalProperties;
        if (publicGetter) {
            if (key === '$attrs') {
                track(instance, 'get', key);
                process.env.NODE_ENV !== 'production' && markAttrsAccessed();
            }
            return publicGetter(instance);
        } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
            return cssModule;
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
            accessCache[key] = 4;
            return ctx[key];
        } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
            {
                return globalProperties[key];
            }
        } else if (process.env.NODE_ENV !== 'production' && currentRenderingInstance && (!isString(key) || key.indexOf('__v') !== 0)) {
            if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
                warn(`Property ${ JSON.stringify(key) } must be accessed via $data because it starts with a reserved ` + `character ("$" or "_") and is not proxied on the render context.`);
            } else if (instance === currentRenderingInstance) {
                warn(`Property ${ JSON.stringify(key) } was accessed during render ` + `but is not defined on instance.`);
            }
        }
    },
    set({_: instance}, key, value) {
        const {data, setupState, ctx} = instance;
        if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
            setupState[key] = value;
            return true;
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
            data[key] = value;
            return true;
        } else if (hasOwn(instance.props, key)) {
            process.env.NODE_ENV !== 'production' && warn(`Attempting to mutate prop "${ key }". Props are readonly.`, instance);
            return false;
        }
        if (key[0] === '$' && key.slice(1) in instance) {
            process.env.NODE_ENV !== 'production' && warn(`Attempting to mutate public property "${ key }". ` + `Properties starting with $ are reserved and readonly.`, instance);
            return false;
        } else {
            if (process.env.NODE_ENV !== 'production' && key in instance.appContext.config.globalProperties) {
                Object.defineProperty(ctx, key, {
                    enumerable: true,
                    configurable: true,
                    value
                });
            } else {
                ctx[key] = value;
            }
        }
        return true;
    },
    has({
        _: {data, setupState, accessCache, ctx, appContext, propsOptions}
    }, key) {
        let normalizedProps;
        return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
    },
    defineProperty(target, key, descriptor) {
        if (descriptor.get != null) {
            target._.accessCache[key] = 0;
        } else if (hasOwn(descriptor, 'value')) {
            this.set(target, key, descriptor.value, null);
        }
        return Reflect.defineProperty(target, key, descriptor);
    }
};
if (process.env.NODE_ENV !== 'production' && !false) {
    PublicInstanceProxyHandlers.ownKeys = target => {
        warn(`Avoid app logic that relies on enumerating keys on a component instance. ` + `The keys will be empty in production mode to avoid performance overhead.`);
        return Reflect.ownKeys(target);
    };
}
extend({}, PublicInstanceProxyHandlers, {
    get(target, key) {
        if (key === Symbol.unscopables) {
            return;
        }
        return PublicInstanceProxyHandlers.get(target, key, target);
    },
    has(_, key) {
        const has = key[0] !== '_' && !isGloballyWhitelisted(key);
        if (process.env.NODE_ENV !== 'production' && !has && PublicInstanceProxyHandlers.has(_, key)) {
            warn(`Property ${ JSON.stringify(key) } should not start with _ which is a reserved prefix for Vue internals.`);
        }
        return has;
    }
});
let shouldCacheAccess = true;
function resolveMergedOptions(instance) {
    const base = instance.type;
    const {
        mixins,
        extends: extendsOptions
    } = base;
    const {
        mixins: globalMixins,
        optionsCache: cache,
        config: {optionMergeStrategies}
    } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
        resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
        {
            resolved = base;
        }
    } else {
        resolved = {};
        if (globalMixins.length) {
            globalMixins.forEach(m => mergeOptions(resolved, m, optionMergeStrategies, true));
        }
        mergeOptions(resolved, base, optionMergeStrategies);
    }
    if (isObject(base)) {
        cache.set(base, resolved);
    }
    return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
    const {
        mixins,
        extends: extendsOptions
    } = from;
    if (extendsOptions) {
        mergeOptions(to, extendsOptions, strats, true);
    }
    if (mixins) {
        mixins.forEach(m => mergeOptions(to, m, strats, true));
    }
    for (const key in from) {
        if (asMixin && key === 'expose') {
            process.env.NODE_ENV !== 'production' && warn(`"expose" option is ignored when declared in mixins or extends. ` + `It should only be declared in the base component itself.`);
        } else {
            const strat = internalOptionMergeStrats[key] || strats && strats[key];
            to[key] = strat ? strat(to[key], from[key]) : from[key];
        }
    }
    return to;
}
const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeObjectOptions,
    emits: mergeObjectOptions,
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    watch: mergeWatchOptions,
    provide: mergeDataFn,
    inject: mergeInject
};
function mergeDataFn(to, from) {
    if (!from) {
        return to;
    }
    if (!to) {
        return from;
    }
    return function mergedDataFn() {
        return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
    };
}
function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
    if (isArray(raw)) {
        const res = {};
        for (let i = 0; i < raw.length; i++) {
            res[raw[i]] = raw[i];
        }
        return res;
    }
    return raw;
}
function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
    return to ? extend(extend(Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
    if (!to)
        return from;
    if (!from)
        return to;
    const merged = extend(Object.create(null), to);
    for (const key in from) {
        merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
}
makeMap('String,Number,Boolean,Function,Symbol,BigInt');
function createAppContext() {
    return {
        app: null,
        config: {
            isNativeTag: NO,
            performance: false,
            globalProperties: {},
            optionMergeStrategies: {},
            errorHandler: undefined,
            warnHandler: undefined,
            compilerOptions: {}
        },
        mixins: [],
        components: {},
        directives: {},
        provides: Object.create(null),
        optionsCache: new WeakMap(),
        propsCache: new WeakMap(),
        emitsCache: new WeakMap()
    };
}
const queuePostRenderEffect = queueEffectWithSuspense;
const isTeleport = type => type.__isTeleport;
const Fragment = Symbol(process.env.NODE_ENV !== 'production' ? 'Fragment' : undefined);
const Text = Symbol(process.env.NODE_ENV !== 'production' ? 'Text' : undefined);
const Comment = Symbol(process.env.NODE_ENV !== 'production' ? 'Comment' : undefined);
Symbol(process.env.NODE_ENV !== 'production' ? 'Static' : undefined);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
}
function setupBlock(vnode) {
    vnode.dynamicChildren = currentBlock || EMPTY_ARR ;
    closeBlock();
    if (currentBlock) {
        currentBlock.push(vnode);
    }
    return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
}
const createVNodeWithArgsTransform = (...args) => {
    return _createVNode(...args);
};
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({key}) => key != null ? key : null;
const normalizeRef = ({ref, ref_key, ref_for}) => {
    return ref != null ? isString(ref) || isRef(ref) || isFunction(ref) ? {
        i: currentRenderingInstance,
        r: ref,
        k: ref_key,
        f: !!ref_for
    } : ref : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
        __v_isVNode: true,
        __v_skip: true,
        type,
        props,
        key: props && normalizeKey(props),
        ref: props && normalizeRef(props),
        scopeId: currentScopeId,
        slotScopeIds: null,
        children,
        component: null,
        suspense: null,
        ssContent: null,
        ssFallback: null,
        dirs: null,
        transition: null,
        el: null,
        anchor: null,
        target: null,
        targetAnchor: null,
        staticCount: 0,
        shapeFlag,
        patchFlag,
        dynamicProps,
        dynamicChildren: null,
        appContext: null
    };
    if (needFullChildrenNormalization) {
        normalizeChildren(vnode, children);
        if (shapeFlag & 128) {
            type.normalize(vnode);
        }
    } else if (children) {
        vnode.shapeFlag |= isString(children) ? 8 : 16;
    }
    if (process.env.NODE_ENV !== 'production' && vnode.key !== vnode.key) {
        warn(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
    }
    if (!isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
        currentBlock.push(vnode);
    }
    return vnode;
}
const createVNode = process.env.NODE_ENV !== 'production' ? createVNodeWithArgsTransform : _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
        if (process.env.NODE_ENV !== 'production' && !type) {
            warn(`Invalid vnode type when creating vnode: ${ type }.`);
        }
        type = Comment;
    }
    if (isVNode(type)) {
        const cloned = cloneVNode(type, props, true);
        if (children) {
            normalizeChildren(cloned, children);
        }
        if (!isBlockNode && currentBlock) {
            if (cloned.shapeFlag & 6) {
                currentBlock[currentBlock.indexOf(type)] = cloned;
            } else {
                currentBlock.push(cloned);
            }
        }
        cloned.patchFlag |= -2;
        return cloned;
    }
    if (isClassComponent(type)) {
        type = type.__vccOpts;
    }
    if (props) {
        props = guardReactiveProps(props);
        let {
            class: klass,
            style
        } = props;
        if (klass && !isString(klass)) {
            props.class = normalizeClass(klass);
        }
        if (isObject(style)) {
            if (isProxy(style) && !isArray(style)) {
                style = extend({}, style);
            }
            props.style = normalizeStyle(style);
        }
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
    if (process.env.NODE_ENV !== 'production' && shapeFlag & 4 && isProxy(type)) {
        type = toRaw(type);
        warn(`Vue received a Component which was made a reactive object. This can ` + `lead to unnecessary performance overhead, and should be avoided by ` + `marking the component with \`markRaw\` or using \`shallowRef\` ` + `instead of \`ref\`.`, `\nComponent that was made reactive: `, type);
    }
    return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
    if (!props)
        return null;
    return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
    const {props, ref, patchFlag, children} = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
        __v_isVNode: true,
        __v_skip: true,
        type: vnode.type,
        props: mergedProps,
        key: mergedProps && normalizeKey(mergedProps),
        ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [
            ref,
            normalizeRef(extraProps)
        ] : normalizeRef(extraProps) : ref,
        scopeId: vnode.scopeId,
        slotScopeIds: vnode.slotScopeIds,
        children: process.env.NODE_ENV !== 'production' && patchFlag === -1 && isArray(children) ? children.map(deepCloneVNode) : children,
        target: vnode.target,
        targetAnchor: vnode.targetAnchor,
        staticCount: vnode.staticCount,
        shapeFlag: vnode.shapeFlag,
        patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
        dynamicProps: vnode.dynamicProps,
        dynamicChildren: vnode.dynamicChildren,
        appContext: vnode.appContext,
        dirs: vnode.dirs,
        transition: vnode.transition,
        component: vnode.component,
        suspense: vnode.suspense,
        ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
        ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
        el: vnode.el,
        anchor: vnode.anchor
    };
    return cloned;
}
function deepCloneVNode(vnode) {
    const cloned = cloneVNode(vnode);
    if (isArray(vnode.children)) {
        cloned.children = vnode.children.map(deepCloneVNode);
    }
    return cloned;
}
function createTextVNode(text = ' ', flag = 0) {
    return createVNode(Text, null, text, flag);
}
function normalizeChildren(vnode, children) {
    let type = 0;
    const {shapeFlag} = vnode;
    if (children == null) {
        children = null;
    } else if (isArray(children)) {
        type = 16;
    } else if (typeof children === 'object') {
        if (shapeFlag & (1 | 64)) {
            const slot = children.default;
            if (slot) {
                slot._c && (slot._d = false);
                normalizeChildren(vnode, slot());
                slot._c && (slot._d = true);
            }
            return;
        } else {
            type = 32;
            const slotFlag = children._;
            if (!slotFlag && !(InternalObjectKey in children)) {
                children._ctx = currentRenderingInstance;
            } else if (slotFlag === 3 && currentRenderingInstance) {
                if (currentRenderingInstance.slots._ === 1) {
                    children._ = 1;
                } else {
                    children._ = 2;
                    vnode.patchFlag |= 1024;
                }
            }
        }
    } else if (isFunction(children)) {
        children = {
            default: children,
            _ctx: currentRenderingInstance
        };
        type = 32;
    } else {
        children = String(children);
        if (shapeFlag & 64) {
            type = 16;
            children = [createTextVNode(children)];
        } else {
            type = 8;
        }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
}
function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
        const toMerge = args[i];
        for (const key in toMerge) {
            if (key === 'class') {
                if (ret.class !== toMerge.class) {
                    ret.class = normalizeClass([
                        ret.class,
                        toMerge.class
                    ]);
                }
            } else if (key === 'style') {
                ret.style = normalizeStyle([
                    ret.style,
                    toMerge.style
                ]);
            } else if (isOn(key)) {
                const existing = ret[key];
                const incoming = toMerge[key];
                if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
                    ret[key] = existing ? [].concat(existing, incoming) : incoming;
                }
            } else if (key !== '') {
                ret[key] = toMerge[key];
            }
        }
    }
    return ret;
}
createAppContext();
let currentInstance = null;
const setCurrentInstance = instance => {
    currentInstance = instance;
    instance.scope.on();
};
const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    currentInstance = null;
};
makeMap('slot,component');
function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
}
function getExposeProxy(instance) {
    if (instance.exposed) {
        return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
            get(target, key) {
                if (key in target) {
                    return target[key];
                } else if (key in publicPropertiesMap) {
                    return publicPropertiesMap[key](instance);
                }
            }
        }));
    }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = str => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');
function getComponentName(Component, includeInferred = true) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
    let name = getComponentName(Component);
    if (!name && Component.__file) {
        const match = Component.__file.match(/([^/\\]+)\.\w+$/);
        if (match) {
            name = match[1];
        }
    }
    if (!name && instance && instance.parent) {
        const inferFromRegistry = registry => {
            for (const key in registry) {
                if (registry[key] === Component) {
                    return key;
                }
            }
        };
        name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
    return isFunction(value) && '__vccOpts' in value;
}
Symbol(process.env.NODE_ENV !== 'production' ? `ssrContext` : ``);

var _withScopeId = function _withScopeId(n) {
    return pushScopeId('data-v-1745ecb2'), n = n(), popScopeId(), n;
};
var _hoisted_1 = { id: 'playerUI' };
var _hoisted_2 = _withScopeId(function () {
    return createBaseVNode('div', { id: 'player' }, null, -1);
});
var _hoisted_3 = _withScopeId(function () {
    return createBaseVNode('video', {
        id: 'streamingVideo',
        playsinline: '',
        style: {
            'width': '100%',
            'height': '100%',
            'position': 'absolute',
            'object-fit': 'fill'
        }
    }, null, -1);
});
var _hoisted_4 = [
    _hoisted_2,
    _hoisted_3
];
var script = {
    __name: 'UEPlayer',
    setup: function setup(__props) {
        return function (_ctx, _cache) {
            return openBlock(), createElementBlock('div', _hoisted_1, _hoisted_4);
        };
    }
};

script.__scopeId = "data-v-1745ecb2";
script.__file = "src/Components/ue-player/UEPlayer.vue";

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

export { MARK_TYPE, METHOD_TYPE, SCENE_TYPE, script as UEPlayer, api_register, api_send, api_unregister, app_load, app_load2, app_load3 };
