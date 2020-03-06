// ipc renderer module for communicating directly with the main process
const { ipcRenderer } = require('electron');
const fs = require('electron').remote.require('fs');
const uuid = require('electron').remote.require('uuid');

// event fire function
// some code taken from user Kooilnc on https://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
function fireDOMEvent(el, etype){
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

// elm variables
const microphoneBtnElm = document.querySelector('.center_audio_box .listen_for_audio');

// press space to click microphone btn
document.addEventListener('keydown', (e) => {
    if(e.keyCode == 32) {
        // space bar was hit, simulation microphone btn click
        fireDOMEvent(microphoneBtnElm, 'click');
    }
});

// function to record audio
// code from most of this function taken from Bryan Jennings on https://medium.com/@bryanjenningz/how-to-record-and-play-audio-in-javascript-faa1b2b3e49b
const recordAudioWithMicrophone = () => {
    return new Promise(resolve => {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            mediaRecorder.addEventListener('dataavailable', event => {
                audioChunks.push(event.data);
            });

            const start = () => {
                mediaRecorder.start();
            };

            const stop = () => {
                return new Promise(resolve => {
                    mediaRecorder.addEventListener('stop', () => {
                    const audioBlob = new Blob(audioChunks);
                    const audioURL = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioURL);
                    const play = () => {
                        audio.play();
                    };

                    resolve({ audioBlob, audioURL, play });
                });

                mediaRecorder.stop();
                });
            };

            resolve({ start, stop });
        });
    });
};

// variable for to be defined audio recorder (used on click of microphone btn elm)
let audioRecorder = null;

// onclick event for record audio button
microphoneBtnElm.addEventListener('click', async (e) => {
    microphoneBtnElm.blur();
    
    if(!navigator.onLine) {
        alert("No Internet Connection");
        return;
    }

    if(!microphoneBtnElm.classList.contains('listening')) {
        // microphone is listening, start recording audio
        audioRecorder = await recordAudioWithMicrophone();
        audioRecorder.start();

        setTimeout(() => {
            microphoneBtnElm.classList.toggle('listening');
        }, 250);
    }else {
        microphoneBtnElm.classList.toggle('listening');

        // microphone ended listening, end recording and parse
        
        // recorded audio obj
        const recordedAudio = await audioRecorder.stop();
        
        // play audio (for testing purposes)
        // recordedAudio.play();

        // recorded audio filename (for use later)
        const recordedAudioFilename = uuid.v4() + '.wav';

        // audio blob
        let audioBlob = recordedAudio.audioBlob;
        audioBlob.lastModifiedDate = new Date();
        audioBlob.name = recordedAudioFilename;
        
        // read recorded audio into wav file
        const fileReaderObj = new FileReader();
        fileReaderObj.onload = function() {
            const recordedAudioFilePath = './raw_audio/inputted/' + recordedAudioFilename;
            fs.writeFileSync(recordedAudioFilePath, Buffer.from(new Uint8Array(this.result)));
            
            // send audio file path to main process app module for analysis
            ipcRenderer.send('interpret-audio', recordedAudioFilePath);
        };
        fileReaderObj.readAsArrayBuffer(audioBlob);
    }
});