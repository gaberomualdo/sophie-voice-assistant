const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// text to speech and speech to text modules
const SpeechToText = require('./speech-to-text');
const TextToSpeech = require('./text-to-speech');

// AI module
const AI = require('./ai/ai');

// get api keys from file and store in var
let API_KEYS;
fs.readFile('api_keys.json', (err, content) => {
    if (err) throw err;
    API_KEYS = JSON.parse(content);
});

// get config info from file and store in var
let CONFIG;
fs.readFile('config.json', (err, content) => {
    if (err) throw err;
    CONFIG = JSON.parse(content);
});

// function to handle exec callbacks
const handleExec = (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    return stdout;
};

// interpret audio from file sent by render process
ipcMain.on('interpret-audio', (event, filePath) => {
    // convert audio from WAV to MP3
    filePathAbs = path.resolve(filePath);
    const filenameWithoutExtension = path.basename(filePathAbs).split('.')[0];
    const newFilename = filenameWithoutExtension + '.mp3';
    const newFilePath = path.resolve('./' + path.join(path.dirname(filePath), newFilename));

    // actual conversion with ffmpeg
    exec(
        `cd ./raw_audio/inputted/ && ../../app/resources/cmd/ffmpeg -i ${filePathAbs} -vn -ar 44100 -ac 2 -b:a 192k ./${newFilename}`,
        (error, stdout, stderr) => {
            if (error) console.log('error' + error.message);

            // delete original WAV
            exec(`rm ${filePathAbs}`, () => {});

            SpeechToText(newFilePath, API_KEYS, CONFIG, (transcript, confidence) => {
                console.log(`Heard "${transcript}" with ${confidence * 100}% confidence`);

                // pass in transcript to AI module
                AI(transcript, response => {
                    TextToSpeech(response, CONFIG, (responseType, responseArgs) => {});
                });
            });
        }
    );
});
