let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.getElementById("voice-select");
let listenButton = document.getElementById("listen-btn");
let stopButton = document.getElementById("stop-btn");
let textInput = document.getElementById("text-input");
let wordByWordCheckbox = document.getElementById("word-by-word");
let downloadButton = document.getElementById("download-btn");
let highlightedText = document.getElementById("highlighted-text");

// Function to populate voice selection dropdown
function populateVoiceList() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = "";
    voices.forEach((voice, i) => {
        let option = document.createElement("option");
        option.textContent = `${voice.name} (${voice.lang})`;
        option.setAttribute("data-lang", voice.lang);
        option.setAttribute("data-name", voice.name);
        voiceSelect.appendChild(option);
    });
}

// Invoke the populateVoiceList function
populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Event listener for the listen button
listenButton.addEventListener("click", () => {
    speech.text = textInput.value;
    let selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute("data-name");
    voices.forEach((voice) => {
        if (voice.name === selectedVoiceName) {
            speech.voice = voice;
        }
    });
    window.speechSynthesis.speak(speech);
});

// Event listener for the stop button
stopButton.addEventListener("click", () => {
    window.speechSynthesis.cancel();
});

// Event listener for the word-by-word checkbox
wordByWordCheckbox.addEventListener("change", () => {
    if (wordByWordCheckbox.checked) {
        speech.addEventListener("boundary", (event) => {
            if (event.name === "word") {
                let currentIndex = event.charIndex;
                let text = textInput.value;
                let word = text.slice(currentIndex).split(/[^\S]+/)[0]; // Get the first word
                let startIndex = text.indexOf(word, currentIndex);
                let endIndex = startIndex + word.length;
                highlightedText.textContent = text.slice(0, startIndex);
                let highlightedWord = document.createElement("span");
                highlightedWord.textContent = text.slice(startIndex, endIndex);
                highlightedWord.style.backgroundColor = "#ff0"; // Highlight color
                highlightedText.appendChild(highlightedWord);
                highlightedText.appendChild(document.createTextNode(text.slice(endIndex)));
            }
        });
    } else {
        speech.removeEventListener("boundary");
        highlightedText.textContent = ""; // Clear highlighted text
    }
});

// Event listener for the download button
downloadButton.addEventListener("click", () => {
    let utterance = new SpeechSynthesisUtterance(textInput.value);
    let selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute("data-name");
    voices.forEach((voice) => {
        if (voice.name === selectedVoiceName) {
            utterance.voice = voice;
        }
    });
    let audioURL = URL.createObjectURL(new Blob([textInput.value], { type: 'text/plain' }));
    let downloadLink = document.createElement('a');
    downloadLink.href = audioURL;
    downloadLink.download = 'text_to_speech.mp3';
    downloadLink.click();
});