const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// get api keys from file and store in vars
let API_KEYS;
fs.readFile("api_keys.json", (err, content) => {
    if(err) throw err;
    API_KEYS = JSON.parse(content);
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
}

// interpret audio from file sent by render process
ipcMain.on('interpret-audio', (event, filePath) => {
    // convert audio from WAV to MP3
    filePath = path.resolve(filePath);
    const filenameWithoutExtension = path.basename(filePath).split('.')[0];
    const newFilename = filenameWithoutExtension + '.mp3';
    const newFilePath = path.resolve('./' + path.join(path.dirname(filePath), newFilename));

    // actual conversion with ffmpeg
    exec(`cd ./raw_audio/inputted/ && ../../assets/cmd/ffmpeg -i ${filePath} -vn -ar 44100 -ac 2 -b:a 192k ./${newFilename}`, (error, stdout, stderr) => {
        if(error) console.log(error.message);
        if(stderr) console.log(stderr);
        
        // delete original WAV
        exec(`rm ${filePath}`);

        // send request to IBM cloud speech to text with MP3 file
        const request = exec(`cd ./raw_audio/inputted/ && curl -X POST -u "apikey:${API_KEYS["IBM_speech_to_text"]["api_key"]}" --header "Content-Type: audio/mp3" --data-binary @${newFilename} "${API_KEYS["IBM_speech_to_text"]["base_url"]}/v1/recognize"`, (error, stdout, stderr) => {
            if(error) console.log(error.message);
            if(stderr) console.log(stderr);
            
        });
    });
});