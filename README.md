# 6-apo

Hackdata
Realistic Human Emulation Assistant(R.H.E.A)

Description
Rhea, your AI companion, is an innovative step towards humanizing technology. Rhea's primary function is to engage in seamless and natural conversations with users through voice interactions. By simply clicking the mic button, users can speak to Rhea, and she analyzes the input to provide human-like responses, creating an interactive and personalized experience.

Key Features

Conversational Intelligence:
Rhea is designed to understand and respond to user input in a natural and intelligent manner. This allows users to have meaningful and context-aware conversations with their AI companion.

Voice Recognition:
Rhea employs advanced voice recognition technology, allowing her to accurately understand spoken language and respond accordingly. This creates a hands-free and user-friendly experience.

Relevance to Future-tech Challenges:
The development of Rhea addresses several future-tech challenges, contributing to the advancement of conversational AI and human-computer interaction. By focusing on natural language understanding, voice recognition, and adaptability,

Rhea aligns with the following challenges:

Humanizing Technology:
Rhea strives to make technology more human-centric, fostering a natural and effortless interaction between users and AI. This aligns with the challenge of humanizing technology to enhance user experience.

Key Project Workflow:

Voice Input Capture:

Upon logging in, users encounter a mic button, initiating the voice interaction process.
Clicking the mic button triggers the recording of the user's audio input.

Base64 Conversion:
The recorded audio is converted into a Base64-encoded string. This encoding facilitates efficient data transfer and processing.

Transcription API Integration:
The Base64-encoded audio string is sent to a Transcription API, responsible for converting spoken words into text.
The API returns a transcribed JSON containing the text representation of the spoken input.

Communication with AI Model:
The transcribed JSON is then sent to an AI model specially designed for natural language understanding.
The model processes the transcribed text and generates a thoughtful and contextually relevant response.

WAV File Creation:
Simultaneously, the transcribed text is converted back into a WAV audio file, capturing the model's response in audio form.

Background Audio Playback:
The generated WAV file is played back automatically in the background, allowing users to hear Rhea's response without requiring additional user actions.

Technology used:
Reactjs
Spline(threejs)
Supabase
Python

How to Run the Project:
To run the project please enter the following command in the terminal:

Firstly:
$ python index.py
then,
$ npm install
then,
$ npm install @supabase/supabase.js
then,
$ npm install @splinetool/react-spline

Finally, run the program by
$ npm start

Team Details

Aviral chawla (Backend Developer)
Skills: spline,api configuration
Email: aviralchawla02@gmail.com

Pratham Goel (Backend Developer)
Skills: DBMS,SQL, api configuration
Email: pg348@snu.edu.in

Aman Sagar (Front-end Developer)
Skills: reactjs,html,css,javascript
Email: as624@snu.edu.in

Akshat Shashi (Front-end Developer)
Skills: react,html,css,javascript,threejs
Email: akshatshashi@gmail.com
