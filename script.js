const whiteKeys = document.querySelectorAll('.white-key');
const blackKeys = document.querySelectorAll('.black-key');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Load the single MP3 file
const audioFile = 'note.mp3';
let audioBuffer = null;

fetch(audioFile)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(decodedData => {
        audioBuffer = decodedData;
    })
    .catch(error => console.error('Error loading audio file:', error));

const notes = {
    'C': 0,
    'C#': 1,
    'D': 2,
    'D#': 3,
    'E': 4,
    'F': 5,
    'F#': 6,
    'G': 7,
    'G#': 8,
    'A': 9,
    'A#': 10,
    'B': 11,
};

function playSound(note) {
    if (!audioBuffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Calculate the playback rate to shift the pitch of the audio
    const semitoneRatio = Math.pow(2, 1 / 12);
    source.playbackRate.value = Math.pow(semitoneRatio, notes[note]);

    source.connect(audioContext.destination);
    source.start();
}

whiteKeys.forEach(whiteKey => {
    whiteKey.addEventListener('click', () => {
        const note = whiteKey.dataset.note;
        playSound(note);
    });
});

blackKeys.forEach(blackKey => {
    blackKey.addEventListener('click', () => {
        const note = blackKey.dataset.note;
        playSound(note);
    });
});

//listen for keypresses
document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const key = e.key;
    const whiteKeyIndex = 'yxcvbnm'.indexOf(key);
    const blackKeyIndex = 'sdfgh'.indexOf(key);

    if (whiteKeyIndex > -1) playSound(whiteKeys[whiteKeyIndex].dataset.note);
    if (blackKeyIndex > -1) playSound(blackKeys[blackKeyIndex].dataset.note);
}
);

//change key state to active when key is pressed
document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const key = e.key;
    const whiteKeyIndex = 'yxcvbnm'.indexOf(key);
    const blackKeyIndex = 'sdfgh'.indexOf(key);

    if (whiteKeyIndex > -1) {
        whiteKeys[whiteKeyIndex].classList.add('active');
    }
    if (blackKeyIndex > -1) {
        blackKeys[blackKeyIndex].classList.add('active');
    }
}
);

//change key state to inactive when key is released
document.addEventListener('keyup', (e) => {
    const key = e.key;
    const whiteKeyIndex = 'yxcvbnm'.indexOf(key);
    const blackKeyIndex = 'sdfgh'.indexOf(key);

    if (whiteKeyIndex > -1) {
        whiteKeys[whiteKeyIndex].classList.remove('active');
    }
    if (blackKeyIndex > -1) {
        blackKeys[blackKeyIndex].classList.remove('active');
    }
}
);