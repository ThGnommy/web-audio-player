

const fileSelector = document.getElementById('file-selector');

let fileName = ''

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const audioClip = document.querySelector('audio')
const track = audioContext.createMediaElementSource(audioClip)

fileSelector.addEventListener('click', (e) => {
    audioClip.pause();
    audioClip.currentTime = 0;

    if(audioContext.state === 'running') {
        audioContext.suspend()
        Reset();
    }
})

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

            if(e.target.className === audioClip.src) {
                return;
            } else if(e.target.className != audioClip.src) {
                Reset();
            }

            audioClip.src = e.target.className

        })
    }

});


let requestAnimationFrameID;
audioContext.suspend();

const Play = (e) => {
    if(audioContext.state === 'suspended') {
        audioContext.resume();
        audioClip.play();
        ReadFrequencyData();
    }

    if(fileName === '') {
        alert('No track selected...')
    }
}

const Resume = (e) => {
    audioClip.pause();
    audioContext.suspend();
    Reset();
}

const Stop = (e) => {
    audioClip.pause();
    audioClip.currentTime = 0;

    if(audioContext.state === 'running') {
        audioContext.suspend()
        Reset();
    }
}

const gainNode = audioContext.createGain();

const volumeControl = document.getElementById('vol');

volumeControl.addEventListener('input', function() {
    gainNode.gain.value = this.value;

    if(gainNode.gain.value === 0) {
        Reset()
    }

    else if (gainNode.gain.value > 0 && audioContext.state === 'suspended' && audioClip.currentTime != 0) {
        audioContext.resume()
        audioClip.play()
        ReadFrequencyData();
    }

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

const biquadFilter = audioContext.createBiquadFilter();
const convolver = audioContext.createConvolver();

const sliderLowpass = document.getElementById('lowpass')

track.connect(analyserNode)
.connect(panner)
.connect(biquadFilter)
// .connect(convolver)
.connect(gainNode)
.connect(audioContext.destination);

biquadFilter.type = 'lowpass'

sliderLowpass.addEventListener('input', function() {
    biquadFilter.frequency.value = this.value
    console.log(this.value)
}, false)

biquadFilter.frequency.value = 50

const circle1 = document.getElementsByClassName('circle-s-2')[0]
const circle2 = document.getElementsByClassName('circle-r-2')[0]

const m_circle1 = document.getElementsByClassName('circle-s-3')[0]
const m_circle2 = document.getElementsByClassName('circle-r-3')[0]


const ReadFrequencyData = () => {

    analyserNode.getFloatFrequencyData(dataArray)

    let n = 0
    let n2 = 0

    dataArray.forEach((element) => {
        element = Math.floor(element.toFixed(0))

        n += -element / 120
        n.toFixed(0)

        n2 += -element / 2000
        n2.toFixed(0)
    })

    requestAnimationFrameID = requestAnimationFrame(ReadFrequencyData)

    circle1.style.width = `${n}px`;
    circle1.style.height = `${n}px`;
    circle2.style.width = `${n}px`;
    circle2.style.height = `${n}px`;

    m_circle1.style.borderWidth = `${n2}px`;
    m_circle2.style.borderWidth = `${n2}px`;

    if(audioClip.ended) {
        Reset()
    }
}

const Reset = () => {

    audioContext.suspend()

    if(audioContext.state === 'suspended') {
        cancelAnimationFrame(requestAnimationFrameID);
    }

    circle1.style.width = '150px';
    circle1.style.height = '150px';
    circle2.style.width = '150px';
    circle2.style.height = '150px';

    m_circle1.style.borderWidth = '8px';
    m_circle2.style.borderWidth = '8px';
}

const VolZero = () => {

    if(audioContext.state === 'running') {
        cancelAnimationFrame(requestAnimationFrameID);
    }

    circle1.style.width = '150px';
    circle1.style.height = '150px';
    circle2.style.width = '150px';
    circle2.style.height = '150px';

    m_circle1.style.borderWidth = '8px';
    m_circle2.style.borderWidth = '8px';
}