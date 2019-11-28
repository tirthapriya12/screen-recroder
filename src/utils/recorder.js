import hark from 'hark';

var speechEvents = {};
export const captureScreen = (constraint, cb) => {

    let screen_constraints = (constraint) ? constraint : {
        video: true
    };
    navigator.mediaDevices.getDisplayMedia(screen_constraints).then(cb).catch(function (error) {
        console.error('getScreenId error', error);
        alert('Failed to capture your screen. Please check browser console logs for further information.');
    });
}

export const captureAudio = (cb) => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(cb);
}

export const addStreamStopListener = (stream, callback) => {
    let streamEndedEvent = 'ended';
    console.log(stream, callback);
    if ('oninactive' in stream) {
        streamEndedEvent = 'inactive';
        console.log(streamEndedEvent)
    }
    stream.addEventListener(streamEndedEvent, function () {
        callback();
        callback = function () { };
    }, false);
    stream.getAudioTracks().forEach(function (track) {
        track.addEventListener(streamEndedEvent, function () {
            callback();
            callback = function () { };
        }, false);
    });
    stream.getVideoTracks().forEach(function (track) {
        track.addEventListener(streamEndedEvent, function () {
            callback();
            callback = function () { };
        }, false);
    });
}


export const openVidinNewTab = (blobURL) => {
    let win = window.open(blobURL, '_blank');
    win.focus();
}

export const attachSpeechEvents = (stream) => {
    speechEvents = hark(stream, {});
    speechEvents.on('speaking', function () {
        console.log('speaking');
    });

    speechEvents.on('stopped_speaking', function () {
        console.log('stopped_speaking');
    });
    speechEvents.on('volume_change', function (volume, threshold) {
        if(volume>-30) console.log('speaking');
    });
}

export const releaseSpeechEvents = () => {
    speechEvents.stop();
}