import React, { Component } from 'react';
import RecordRTC, { RecordRTCPromisesHandler, MediaStreamRecorder, getSeekableBlob } from 'recordrtc';
import { captureScreen, captureAudio, addStreamStopListener, openVidinNewTab, attachSpeechEvents, releaseSpeechEvents } from '../utils/recorder';

const RecordRtc = RecordRTC;
const hasGetUserMedia = !!(navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia ||
    navigator.mediaDevices.mozGetUserMedia || navigator.mediaDevices.msGetUserMedia);

class RecordRTCComponent extends Component {

    screen = {};
    mic = {};
    recorder = {};
    stopRecordingButton = {};
    constructor() {
        super();

        this.state = {
            screenConstraints: {
                video: true
            },
            recordConstraint: {
                type: 'video',
                mimeType: 'video/webm',
            },
            isRecording: false,
            isPaused: false,
            isStopped: false
        }
    }


    onStart = (ev) => {
        captureScreen(this.state.screenConstraints, (screen) => {
            this.screen = screen;
            captureAudio((mic) => {
                this.mic = mic;
                this.screen.width = window.screen.width;
                this.screen.height = window.screen.height;
                this.screen.fullcanvas = true;

                this.recorder = RecordRtc([screen, mic], {
                    ...this.state.recordConstraint,
                    previewStream: function (s) {
                        console.log(s);
                    }
                });
                attachSpeechEvents(this.mic);
                //Start recording
                this.recorder.startRecording();
                this.setState({ isRecording: true })
                addStreamStopListener(this.screen, () => {
                    this.stopRecordingButton.click();
                });
            });
        });
    }

    onPause = (ev) => {
        if (this.state.isPaused) {
            this.recorder.resumeRecording();
            this.setState({ isPaused: false });
            ev.target.innerHTML = 'Pause'
        } else {
            this.recorder.pauseRecording();
            this.setState({ isPaused: true });
            ev.target.innerHTML = 'Resume'
        }
    }

    onStop = (ev) => {
        this.recorder.stopRecording(() => {
            var blob = this.recorder.getBlob();
            getSeekableBlob(blob, (nblob) => {
                let vidURL = URL.createObjectURL(nblob)
                this.setState({ video: vidURL, isRecording: false, isStopped: true });
                openVidinNewTab(vidURL);
                this.screen.getTracks().concat(this.mic.getTracks()).forEach(function (track) {
                    track.stop();
                });
                releaseSpeechEvents();
            })
        });
    }

    render() {

        if (!hasGetUserMedia) {
            return (
                <h3>Your browser doesn't support media recording. Please switch to Chrom / Mozilla!!</h3>
            )
        }
        return (
            <section>
                <button onClick={this.onStart}>Start</button>
                <button onClick={this.onPause}>Pause</button>
                <button ref={(ref) => { this.stopRecordingButton = ref }} onClick={this.onStop}>Stop</button>
            </section>
        )
    }
}

export default RecordRTCComponent;