const { exec } = require('child_process');

// main text to speech function to be exported
const TextToSpeech = (text, callback) => {
    exec(`say --voice="samantha" "${text}"`, (error, stdout, stderr) => {
        if (error) throw error;
    });
};

module.exports = TextToSpeech;
