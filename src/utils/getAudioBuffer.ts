import axios from "axios"
import { Readable } from "stream";

export default async function getAudioBuffer(message: string) {
    const response = await axios.post("https://texttospeech.googleapis.com/v1beta1/text:synthesize", {
        input: {
            text: message,
        },
        voice: {
            "languageCode": "cmn-TW",
            "name": "cmn-TW-Standard-A"
        },
        audioConfig: {
            audioEncoding: "MP3",
            pitch: 3,
            speakingRate: 1.15
        }
    }, {
        headers: { 'Content-Type': "application/json" },
        params: { key: process.env["SPEECH_API_KEY"] }
    });

    return Readable.from(Buffer.from(response.data.audioContent, "base64"));
}