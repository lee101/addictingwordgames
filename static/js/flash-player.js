(function (global) {
    'use strict';

    function toNumber(value, fallback) {
        var num = parseFloat(value);
        if (isNaN(num)) {
            return fallback;
        }
        return num;
    }

    function FlashPlayerController(stageElement, bootstrap) {
        this.stage = stageElement;
        this.bootstrap = bootstrap || {};
        this.reloadButton = null;
        this.fullscreenButton = null;
        this.aspectButton = null;
        this.playerElement = null;
        this.streamUrl = null;
        this.aspectModes = ['original', 'widescreen', 'stretch'];
        this.aspectIndex = 0;
        this.aspectRatio = 4 / 3;
        this.nativeWidth = 800;
        this.nativeHeight = 600;
    }

    FlashPlayerController.prototype.init = function () {
        if (!this.stage || typeof document === 'undefined') {
            return;
        }
        this.reloadButton = document.getElementById('flash-player-reload');
        this.fullscreenButton = document.getElementById('flash-player-fullscreen');
        this.aspectButton = document.getElementById('flash-player-aspect');

        var attrStream = this.stage.getAttribute('data-stream-url');
        this.streamUrl = attrStream || this.bootstrap.streamUrl || '';
        var width = toNumber(this.stage.getAttribute('data-width'), 800);
        var height = toNumber(this.stage.getAttribute('data-height'), 600);
        if (width > 0 && height > 0) {
            this.nativeWidth = width;
            this.nativeHeight = height;
            this.aspectRatio = width / height;
        }
        if (!Array.isArray(this.bootstrap.actionscripts)) {
            var rawScripts = this.stage.getAttribute('data-actionscripts') || '';
            if (rawScripts) {
                this.bootstrap.actionscripts = rawScripts.split(',').map(function (value) {
                    return parseInt(value, 10);
                }).filter(function (value) {
                    return !isNaN(value);
                });
            }
        }
        this.applyAspect();
        this.mountRuffle();
        this.bindControls();
    };

    FlashPlayerController.prototype.bindControls = function () {
        var self = this;
        if (this.reloadButton) {
            this.reloadButton.addEventListener('click', function () {
                self.reload();
            });
        }
        if (this.fullscreenButton) {
            this.fullscreenButton.addEventListener('click', function () {
                self.fullscreen();
            });
        }
        if (this.aspectButton) {
            this.aspectButton.addEventListener('click', function () {
                self.toggleAspect();
            });
            this.updateAspectButtonLabel();
        }
    };

    FlashPlayerController.prototype.mountRuffle = function () {
        var factory = global.RufflePlayer && global.RufflePlayer.newest ? global.RufflePlayer.newest() : null;
        if (!factory) {
            this.stage.innerHTML = '<div class="flash-library__empty">Ruffle player failed to load.</div>';
            return;
        }
        var player = factory.createPlayer();
        player.style.width = '100%';
        player.style.height = '100%';
        this.stage.innerHTML = '';
        this.stage.appendChild(player);
        this.playerElement = player;

        var config = global.RufflePlayer && global.RufflePlayer.config ? global.RufflePlayer.config : {};
        config.autoplay = config.autoplay || 'on';
        config.unmuteOverlay = config.unmuteOverlay || 'hidden';
        var scriptModes = Array.isArray(this.bootstrap.actionscripts) ? this.bootstrap.actionscripts : [];
        if (scriptModes.indexOf(3) !== -1) {
            config.preferredPlayerVersion = 'as3';
        } else if (scriptModes.indexOf(2) !== -1) {
            config.preferredPlayerVersion = 'as2';
        } else if (scriptModes.indexOf(1) !== -1) {
            config.preferredPlayerVersion = 'as1';
        }
        config.allowFullscreen = true;
        global.RufflePlayer = global.RufflePlayer || {};
        global.RufflePlayer.config = config;

        if (this.streamUrl) {
            player.load(this.streamUrl);
        }
    };

    FlashPlayerController.prototype.reload = function () {
        if (this.playerElement && this.streamUrl) {
            this.playerElement.load(this.streamUrl);
        }
    };

    FlashPlayerController.prototype.fullscreen = function () {
        if (this.playerElement && typeof this.playerElement.enterFullscreen === 'function') {
            try {
                this.playerElement.enterFullscreen();
            } catch (err) {
                // ignore errors for environments without fullscreen support
            }
        }
    };

    FlashPlayerController.prototype.toggleAspect = function () {
        this.aspectIndex = (this.aspectIndex + 1) % this.aspectModes.length;
        this.applyAspect();
        this.updateAspectButtonLabel();
    };

    FlashPlayerController.prototype.updateAspectButtonLabel = function () {
        if (!this.aspectButton) {
            return;
        }
        var mode = this.aspectModes[this.aspectIndex];
        var label = 'Aspect: ' + mode.charAt(0).toUpperCase() + mode.slice(1);
        this.aspectButton.textContent = label;
    };

    FlashPlayerController.prototype.applyAspect = function () {
        if (!this.stage) {
            return;
        }
        var mode = this.aspectModes[this.aspectIndex];
        if (mode === 'original') {
            var padding = (100 / this.aspectRatio).toFixed(2) + '%';
            this.stage.style.paddingTop = padding;
            this.stage.style.height = '';
        } else if (mode === 'widescreen') {
            this.stage.style.paddingTop = '56.25%';
            this.stage.style.height = '';
        } else if (mode === 'stretch') {
            this.stage.style.paddingTop = '0';
            this.stage.style.height = this.nativeHeight + 'px';
        }
    };

    FlashPlayerController.prototype.updateStream = function (streamUrl) {
        if (streamUrl) {
            this.streamUrl = streamUrl;
            this.reload();
        }
    };

    function initialisePlayer() {
        if (typeof document === 'undefined') {
            return;
        }
        var stage = document.getElementById('flash-player-stage');
        if (!stage) {
            return;
        }
        var bootstrap = global.flashPlayerBootstrap || {};
        var controller = new FlashPlayerController(stage, bootstrap);
        controller.init();
        global.flashPlayerController = controller;
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialisePlayer);
        } else {
            initialisePlayer();
        }
    }

    var exportsObj = {
        FlashPlayerController: FlashPlayerController
    };
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exportsObj;
    } else {
        global.FlashPlayer = exportsObj;
    }
})(typeof window !== 'undefined' ? window : globalThis);
