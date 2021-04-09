import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
var recordAudio;


export function startRecording(){
    navigator.getUserMedia({
        audio: true
    }, function(stream){
        recordAudio = RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/webm',
            sampleRate: 44100,
            desiredSampRate: 16000,
            recorderType: StereoAudioRecorder,
            numberOfAudioChannels: 1
        });
        console.log('RecordAudio at start: ', recordAudio);
        recordAudio.startRecording();
    }, function(error){
        console.error(JSON.stringify(error));
    });
};

export function stopRecording(){
    console.log('RecordAudio at stop: ', recordAudio);
    console.log(recordAudio.blob);
    recordAudio.getDataURL(function(audioDataURL) {
        var files = {
            audio: {
                type: recordAudio.getBlob().type || 'audio/wav',
                dataURL: audioDataURL
            }
        };
        // socketio.emit('message', files);
        console.log("Recorded file: ", files);
    });
}



