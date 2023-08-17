window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

var _canvasElement, _canvasContext, _interacted, _audioContext, _audioSource, _audioAnalyser;

const _connectAnalyser = function () {
    if (_interacted) return;
    _interacted = true;
    _audioContext = new AudioContext();
    _audioSource = this._audioContext.createMediaElementSource(this._audioElement);
    _audioAnalyser = this._audioContext.createAnalyser();
    _play();
}

const _play = function () {
    _audioSource.connect(_audioAnalyser);
    _audioSource.connect(this._audioContext.destination);
    _audioAnalyser.smoothingTimeConstant = 0.85;
    _audioAnalyser.fftSize = 512;
    var audioBufferData = new Uint8Array(_audioAnalyser.frequencyBinCount);

    var tick = function () {
        _audioAnalyser.getByteFrequencyData(audioBufferData);
        _draw(audioBufferData, _canvasContext);
        window.requestAnimationFrame(tick);
    };
    tick();
}

const _draw = function(audioBufferData, canvasContext) {
    var PI = Math.PI;
    var cwidth = canvas.width;
    var cheight = canvas.height;
    var cr = 90;//环形半径
    var minHeight = 2;
    var meterWidth = 3;
    var meterNum = (2 * PI * cr) / (meterWidth + 2);//设置方块的数量，考虑到闭环的关系
    var gradient = canvasContext.createLinearGradient(0, -cr, 0, -cwidth / 2);
    gradient.addColorStop(0, '#0f0');
    gradient.addColorStop(0.5, '#ff0');
    gradient.addColorStop(1, '#f00');
    canvasContext.fillStyle = gradient;

    var step = Math.round(audioBufferData.length / meterNum);
    canvasContext.clearRect(0, 0, cwidth, cheight);
    canvasContext.save();
    canvasContext.translate(cwidth / 2, cheight / 2);
    for (var i = 0; i < meterNum; i++) {
        var value = audioBufferData[i * step];
        var meterHeight = value * (cheight / 2 - cr) / 256 || minHeight;
        canvasContext.rotate(2 * PI / meterNum);
        canvasContext.fillRect(-meterWidth / 2, -cr - meterHeight, meterWidth, meterHeight);
    }
    canvasContext.restore();
}

const AV = function (audioElement, canvasElement) {
    _canvasElement = canvasElement;
    _canvasContext = _canvasElement.getContext("2d");
    _interacted = false;

    _audioElement = audioElement;
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
        const events = ['touchstart', 'touchmove', 'touchend', 'mouseup', 'click'];
        events.forEach((event) => {
            document.body.addEventListener(
                event,
                function () { return _connectAnalyser() },
                { once: true }
            );
        });
    } else {
        _audioElement.addEventListener(
            "play",
            function () { return _connectAnalyser() },
            { once: true }
        );
    }
}
