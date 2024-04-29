// Define variables
let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.getElementById("voice-select");
let listenButton = document.getElementById("listen-btn");
let stopButton = document.getElementById("stop-btn");
let textInput = document.getElementById("text-input");
let wordByWordCheckbox = document.getElementById("word-by-word");
let highlightedText = document.getElementById("highlighted-text");

// Function to populate voice selection dropdown
function populateVoiceList() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = voices
        .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
        .join('');
}

// Invoke the populateVoiceList function
populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Function to speak the text
function speakText() {
    speech.text = textInput.value;
    let selectedVoiceName = voiceSelect.value;
    let selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
    if (selectedVoice) {
        speech.voice = selectedVoice;
        window.speechSynthesis.speak(speech);
    } else {
        console.error('Selected voice not found.');
    }
}

// Function to stop speaking
function stopSpeaking() {
    window.speechSynthesis.cancel();
}

// Event listener for the listen button
listenButton.addEventListener("click", speakText);

// Event listener for the stop button
stopButton.addEventListener("click", stopSpeaking);

// Event listener for the word-by-word checkbox
wordByWordCheckbox.addEventListener("change", function() {
    if (wordByWordCheckbox.checked) {
        // Highlight words
        speech.addEventListener("boundary", function(event) {
            if (event.name === "word") {
                let wordStart = event.charIndex;
                let wordEnd = wordStart + event.charLength;
                let text = textInput.value;
                let highlightedWord = text.substring(wordStart, wordEnd);
                highlightedText.textContent = text.replace(highlightedWord, `<span class="highlight">${highlightedWord}</span>`);
            }
        });
    } else {
        // Remove word highlights
        highlightedText.innerHTML = textInput.value;
    }
});

// Event listener for changes in the text input
textInput.addEventListener("input", function() {
    // Update highlighted text if word-by-word is enabled
    if (wordByWordCheckbox.checked) {
        wordByWordCheckbox.dispatchEvent(new Event('change'));
    }
});