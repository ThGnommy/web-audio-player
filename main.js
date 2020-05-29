

const fileSelector = document.getElementById('file-selector');

let fileName = ''

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const audioClip = document.querySelector('audio')
const track = audioContext.createMediaElementSource(audioClip)

fileSelector.addEventListener('change', (event) => {
    const files = event.target.files;
    fileName = files[0].name
    audioClip.src = URL.createObjectURL(files[0]);
    
    const trackList = document.getElementById('track-list')

    for (let i = 0; i < files.length; i++) {
        const element = files[i];
        const url = URL.createObjectURL(element)
        console.log(URL.createObjectURL(element))

        const li = document.createElement('li') 
        li.innerHTML = element.name
        li.className = url
        trackList.append(li)

        li.addEventListener('click', (e) => {
            const allLi = document.querySelectorAll('li')
            allLi.forEach(element => {
                element.setAttribute('id', '')
            });
            e.target.setAttribute('id', 'bkg-cyan')
            audioClip.src = e.target.className
        })
    }

});

const Play = (e) => {
    audioClip.play();
    setInterval(ReadFrequencyData, 1);
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


const analyserNode = audioContext.createAnalyser();
analyserNode.fftSize = 256;
const bufferLength = analyserNode.frequencyBinCount;
const dataArray = new Float32Array(bufferLength);

track.connect(gainNode)
.connect(analyserNode)
.connect(panner)
.connect(audioContext.destination);


const circle1 = document.getElementsByClassName('circle-s-2')[0]
const circle2 = document.getElementsByClassName('circle-r-2')[0]

const ReadFrequencyData = () => {

    analyserNode.getFloatFrequencyData(dataArray)

    let n = 0

    dataArray.forEach((element) => {

        element = Math.floor(element.toFixed(0))
        n += -element / 100
        n.toFixed(0)
        console.log(n)
    })

    circle1.style.width = `${n}px`;
    circle1.style.height = `${n}px`;

    circle2.style.width = `${n}px`;
    circle2.style.height = `${n}px`;
}

