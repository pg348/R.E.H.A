import React, { useState, useRef } from 'react';
import axios from 'axios';

const SpeechToTextConverter = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const [characterResponse, setCharacterResponse] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio.wav' });
        setAudioBlob(audioBlob);
      };

      mediaRecorderRef.current.start();

      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleConvertAudio = async () => {
    if (!audioBlob) {
      console.error('Please record audio first.');
      return;
    }

    const sttUrl = 'https://api.convai.com/stt/';
    const characterResponseUrl = 'https://api.convai.com/character/getResponse';
    const apiKey = 'c1e746cb3782b24cc075464e201ccd76'; // Replace with your actual API key

    // Convert audio to text
    const sttFormData = new FormData();
    sttFormData.append('enableTimestamps', 'false');
    sttFormData.append('file', audioBlob);

    try {
      const sttResponse = await fetch(sttUrl, {
        method: 'POST',
        headers: {
          'CONVAI-API-KEY': apiKey,
        },
        body: sttFormData,
      });

      if (sttResponse.ok) {
        const sttData = await sttResponse.json();
        const resultText = sttData.result; // Extract the transcribed text
        setTranscription(resultText);

        // Use the transcription in the Character Response API payload
        const characterResponsePayload = new FormData();
        characterResponsePayload.append('userText', resultText);
        characterResponsePayload.append('charID', '8bd539c2-bf7a-11ee-8a64-42010a40000f');
        characterResponsePayload.append('sessionID', '4b2a14508a71326e9adcd2fb62b24483');
        characterResponsePayload.append('voiceResponse', 'True');

        // Request character response
        const characterResponseResponse = await fetch(characterResponseUrl, {
          method: 'POST',
          headers: {
            'CONVAI-API-KEY': apiKey,
          },
          body: characterResponsePayload,
        });

        if (characterResponseResponse.ok) {
          const characterResponseData = await characterResponseResponse.json();
          setCharacterResponse(characterResponseData.text);
        } else {
          console.error('Error getting character response:', characterResponseResponse.statusText);
        }
      } else {
        console.error('Error converting audio to text:', sttResponse.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <div>
        <button onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
        <button onClick={handleConvertAudio} disabled={isRecording}>
          Convert Audio
        </button>
      </div>

      {transcription && (
        <div>
          <h3>Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}

      {characterResponse && (
        <div>
          <h3>Character Response:</h3>
          <p>{characterResponse}</p>
        </div>
      )}

      {audioBlob && (
        <div>
          <h3>Recorded Audio:</h3>
          <audio controls>
            <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}
    </div>
  );
};

export default SpeechToTextConverter;
