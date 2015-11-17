(function (namespace, undefined) {
    "use strict";

    ////////
    // AudCompInst
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Inst = namespace.Comp.Inst || {};
    namespace.Comp.Inst.Aud = function (audCompDefinition, playImmediately) {
        this.audio = new Audio();
        this.audio.src = audCompDefinition.audioFile;
        this.audio.loop = audCompDefinition.isLooped;
        this.audio.load();
        if (!!playImmediately) {
            this.play();
        }
    };

    namespace.Comp.Inst.Aud.prototype = new namespace.Comp.Inst.Component();

    namespace.Comp.Inst.Aud.onEnded = function (callback) {
        this.audio.addEventListener("ended", callback);
    };

    namespace.Comp.Inst.Aud.isPlaying = function () {
        return this.audio && this.audio.playing;
    };

    namespace.Comp.Inst.Aud.play = function () {
        if (this.audio) { // intentional truthiness
            if (!this.isPlaying()) {
                this.audio.playing = true;
                this.audio.play();
            }
        }
    };

    namespace.Comp.Inst.Aud.pause = function () {
        if (this.audio) { // intentional truthiness
            if (this.isPlaying()) {
                this.audio.playing = false;
                this.audio.pause();
            }
        }
    };

    namespace.Comp.Inst.Aud.prototype.destroy = function (messengerEngine) {
        if (messengerEngine !== null) {
            messengerEngine.unregisterAll(this);
            if (this.audio !== null) {
                audio.parentElement.removeChild(audio);
            }
        }
    };

    ////////
    // AudCompDef
    namespace.Comp = namespace.Comp || {};
    namespace.Comp.Def = namespace.Comp.Def || {};
    namespace.Comp.Def.Aud = function (def) {
        this.audioTypeId = def.audioTypeId;
        this.name = def.name;
        this.audioFile = def.audioFile;
        this.isLooped = def.isLooped;
    };

    ////////
    // AudEngine
    namespace.Engines = namespace.Engines || {};
    namespace.Engines.AudEngine = function () {
        var Inst = namespace.Comp.Inst;
        var Def = namespace.Comp.Def;

        var messengerEngine = namespace.Globals.globalMessengerEngine;
        var servicesEngine = namespace.Globals.globalServicesEngine;

        var audTypeDefinitions = [];
        var audCompDefinitions = {};
        var playingMusic = {};
        var audCompInstances = [];

        var buildAudioTypeDefinitions = function (data) {
            data.forEach(function (x) {
                audTypeDefinitions[x.id] = new namespace.Comp.Def.TypeDesc(x);
            });
        };

        var buildAudioDefinitions = function (data) {
            data.forEach(function (x) {
                // so we can create audio from name or id
                audCompDefinitions[x.id] = new Def.Aud(x);
                audCompDefinitions[x.name] = audCompDefinitions[x.id];
            });
        };

        this.init = function () {
            var audioTypePromise = new Promise(function (resolve, reject) {
                servicesEngine.retrieveAudioTypes().then(function (data) {
                    buildAudioTypeDefinitions(data);
                    resolve();
                }, function (reason) {
                    var reasonPlus = "Failed to load audio types";
                    if (reason != null) {
                        reasonPlus = reasonPlus + "\r\n" + reason;
                    }
                    reject(reasonPlus);
                });
            });
            var audCompDefinitionsPromise = new Promise(function (resolve, reject) {
                servicesEngine.retrieveAllAudioForGame().then(function (data) {
                    buildAudioDefinitions(data).then(function () {
                        resolve();
                    }, function (reason) {
                        var reasonPlus = "Failed to build audio definitions";
                        if (reason != null) {
                            reasonPlus = reasonPlus + "\r\n" + reason;
                        }
                        reject(reasonPlus);
                    });
                }, function (reason) {
                    var reasonPlus = "Failed to load audio definitions";
                    if (reason != null) {
                        reasonPlus = reasonPlus + "\r\n" + reason;
                    }
                    reject(reasonPlus);
                });
            });
            return Promise.all([audioTypePromise, audCompDefinitionsPromise]);
        };

        this.update = function (delta) {
        };

        this.shutdown = function () {
            var that = this;
            return new Promise(function (resolve, reject) {
                audCompDefinitions = {};
                audioContext.close();
                messengerEngine.unregisterAll(that);
                resolve();
            });
        };

        var getFirstAvailableSource = function () {
            return audioSources.firstOrNull(function (x) {
                return x.available;
            });
        };

        var playAudio = function (audioNameOrId, playImmediately) {
            // default to playing audio immediately upon creation
            playImmediately = (playImmediately !== undefined) ? playImmediately : true; 

            var audCompDefinition = audCompDefinitions[audioNameOrId];
            if (audCompDefinition !== null) {
                var audioType = audTypeDefinitions[audCompDefinition.audioTypeId];
                if (audioType === "Music") {
                    if(playingMusic[audioNameOrId] !== null) {
                        // don't play more than one of the same looped audio
                        return;
                    }
                    playingMusic[audioNameOrId] = new Inst.Aud(audCompDefinition, playImmediately);
                } else {
                    var instance = new Inst.Aud(audCompDefinition, playImmediately);
                    audCompInstances.push(instance);
                    instance.onEnded(function (audioEvent) {
                        for (var i = 0; i < audCompInstances.length; ++i) {
                            if (audCompInstances[i].audio === audioEvent.target) {
                                var instance = audCompInstances[i];
                                audCompInstances.splice(i, 1);
                                
                                instance.pause();
                                instance.destroy(messengerEngine);
                            }
                        }
                    });
                }
            }
        };

        var stopAudio = function (audioNameOrId) {
            var audCompDefinition = audCompDefinitions[audioNameOrId];
            if (audCompDefinition !== null) {
                if (audCompDefinition !== null) {
                    var audioType = audTypeDefinitions[audCompDefinition.audioTypeId];
                    if (audioType === "Music") {
                        if (playingMusic[audioNameOrId] !== null) {
                            var instance = playingMusic[audioNameOrId];
                            playingMusic[audioNameOrId] = null;

                            instance.pause();
                            instance.destroy(messengerEngine);
                        }
                    } else {
                        // non-music cannot be removed; it is removed when it ends
                    }
                }
            }
        };

        messengerEngine.register("playAudio", this, playAudio);
        messengerEngine.register("stopAudio", this, stopAudio);
    };
}(window.TTTD = window.TTTD || {}));
