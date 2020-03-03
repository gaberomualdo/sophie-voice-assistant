// event fire function, some code taken from user Kooilnc on https://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
function fireDOMEvent(el, etype){
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

// press space to click microphone btn
document.addEventListener("keydown", (e) => {
    if(e.keyCode == 32) {
        // space bar was hit, simulation microphone btn click
        fireDOMEvent(document.querySelector(".center_audio_box .listen_for_audio"), "click");
    }
});