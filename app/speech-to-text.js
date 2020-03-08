const path = require('path');
const { exec } = require('child_process');

// remove trailing spaces (at beginning or end) from String
const removeTrailingSpaces = text => {
    let startInd = 0;
    let endInd = 0;
    const textAsArr = text.split('');
    textAsArr.forEach((letter, letterInd) => {
        if (letter == ' ' && endInd == 0) {
            startInd = letterInd + 1;
        }
        if (letter != ' ') {
            endInd = letterInd + 1;
        }
    });

    return textAsArr.slice(startInd, endInd).join('');
};

// main speech to text function to be exported
const SpeechToText = (filePath, API_KEYS) => {
    // split filepath into filename and filedir
    console.log(process.cwd() + ' to ' + path.dirname(filePath));
    const fileDir = path.relative(process.cwd(), path.dirname(filePath));
    const filename = path.basename(filePath);

    // send request to IBM cloud speech to text with MP3 file
    const request = exec(
        `cd ${fileDir} && curl -X POST -u "apikey:${API_KEYS['IBM_speech_to_text']['api_key']}" --header "Content-Type: audio/mp3" --data-binary @${filename} "${API_KEYS['IBM_speech_to_text']['base_url']}/v1/recognize"`,
        (error, stdout, stderr) => {
            if (error) console.log(error.message);
            const responseText = JSON.parse(stdout);

            console.log(JSON.stringify(responseText));

            // calculate final audio transcript and confidence percentage
            let finalAudioTranscript = '';
            let finalConfidencePercentage = 0;
            let confidenceTotal = 0;
            let confidenceDivisor = 0;

            responseText['results'].forEach(result => {
                const currentResult = removeTrailingSpaces(result['alternatives'][0]['transcript']);

                confidenceTotal += result['alternatives'][0]['confidence'] * currentResult.length;
                confidenceDivisor += currentResult.length;
                finalAudioTranscript += currentResult + ' ';
            });

            finalConfidencePercentage = confidenceTotal / confidenceDivisor;

            console.log(finalAudioTranscript + '"');
            console.log(finalConfidencePercentage);
        }
    );
};

module.exports = SpeechToText;
