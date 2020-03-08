// main AI function to be exported
const AI = (transcript, callback) => {
    if (transcript == 'hello') {
        callback('Hi Fred!');
    }

    if (transcript == 'how are you') {
        callback('I am alive.');
    }

    if (transcript == 'what is your name') {
        callback('My name is Sophie, your personal voice assistant.');
    }

    if (transcript == 'who is your creator') {
        callback('I was made by Fred Adams, a teenage developer.');
    }
};

module.exports = AI;
