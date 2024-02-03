import React, { useState } from 'react';

const SpeechToTextConverter = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [characterResponse, setCharacterResponse] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
  };

  const handleConvertAudio = async () => {
    if (!audioFile) {
      console.error('Please select an audio file.');
      return;
    }

    const sttUrl = 'https://api.convai.com/stt/';
    const characterResponseUrl = 'https://api.convai.com/character/getResponse';
    const apiKey = 'c1e746cb3782b24cc075464e201ccd76'; // Replace with your actual API key

    // Convert audio to text
    const sttFormData = new FormData();
    sttFormData.append('enableTimestamps', 'false');
    sttFormData.append('file', audioFile);

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

          // Convert the base64 audio to a Blob
          const base64AudioString = characterResponseData.audio;
          const byteCharacters = atob(base64AudioString);
          const byteNumbers = new Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          const audioBlob = new Blob([byteArray], { type: 'audio/wav' });
          setAudioBlob(audioBlob);
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
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleConvertAudio}>Convert Audio</button>

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
          <h3>Character Response Audio:</h3>
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
