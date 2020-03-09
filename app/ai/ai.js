// main AI function to be exported
const AI = (transcript, callback) => {
    if (transcript === 'hello') {
        callback('Hi Fred!');
    }

    if (transcript === 'how are you') {
        callback('I am alive.');
    }

    if (transcript === 'what is your name') {
        callback('My name is Sophie, your personal voice assistant.');
    }

    if (transcript === 'who is your creator') {
        callback('I was made by Fred Adams, a teenage developer.');
    }

    if (transcript === 'what is the date') {
        const date = new Date();
        const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][
            date.getMonth()
        ];
        const response = `Today is ${month} ${date.getDate()}, ${date.getFullYear()}`;
    }
};

module.exports = AI;
