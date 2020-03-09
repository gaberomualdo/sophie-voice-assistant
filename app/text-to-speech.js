const { exec } = require('child_process');

// main text to speech function to be exported
const TextToSpeech = (text, CONFIG, callback) => {
    // use macOS speech
    if (process.platform === 'darwin') {
        // check if preferred speech voice is available
        exec(`say --voice="?"`, (error, stdout, stderr) => {
            if (error) throw error;

            const preferredVoice = CONFIG['text_to_speech']['macOS_preferred_voice'];

            let hasVoice = false;
            stdout.split('\n').forEach(voiceText => {
                if (voiceText.toLowerCase().startsWith(preferredVoice.toLowerCase())) {
                    hasVoice = true;
                }
            });

            // if voice is available say with that voice
            if (hasVoice) {
                exec(`say --voice="${preferredVoice}" "${text}"`, (error, stdout, stderr) => {
                    if (error) throw error;
                });
            }
        });
    }
};

module.exports = TextToSpeech;
