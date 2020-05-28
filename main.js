

const fileSelector = document.getElementById('file-selector');

let fileName = ''

let trackArray = []

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const analyser = audioContext.createAnalyser();

const audioClip = document.querySelector('audio')
const track = audioContext.createMediaElementSource(audioClip)
track.connect(analyser);

fileSelector.addEventListener('change', (event) => {
    const files = event.target.files;
    fileName = files[0].name
    audioClip.src = URL.createObjectURL(files[0]);
    
    for (let i = 0; i < files.length; i++) {
        const element = files[i];
        console.log(URL.createObjectURL(element))
    }

});

const Play = (e) => {
    audioClip.play();
}

const Resume = (e) => {
    audioClip.pause();
}

const Stop = (e) => {
    audioClip.pause();
    audioClip.currentTime = 0;
}

const gainNode = audioContext.createGain();

const volumeControl = document.getElementById('vol');

volumeControl.addEventListener('input', function() {
    gainNode.gain.value = this.value;
    
}, false);


const pannerOptions = { pan: 0 };
const panner = new StereoPannerNode(audioContext, pannerOptions);

const pannerControl = document.getElementById('pan');

pannerControl.addEventListener('input', function() {
    panner.pan.value = this.value;
}, false);

track.connect(gainNode)
.connect(panner)
.connect(audioContext.destination);