import React, { useState, useRef } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta } from "../../content_option";
import { Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";

export const Main = () => {
  const [isHistoryOverlayVisible, setHistoryOverlayVisibility] =
    useState(false);
  const [transcription, setTranscription] = useState("");
  const [isMicrophoneEnabled, setMicrophoneEnabled] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const splineRef = useRef(null);
  const [isAnimating, setAnimating] = useState(true);
  const [characterResponse, setCharacterResponse] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  const objectToAnimate = useRef();

  // function onLoad(spline){
  //   const obj = spline.findObjectByName('Rhea');
  //   objectToAnimate.current = obj;
  // }

  // function triggerAnimation(){
  //   objectToAnimate.current.emitEvent('keyUp');
  // }

  const startRecording = () => {
    // const audioBlob = new Blob(chunks, { type: "audio/mp3" });
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: "audio/mp3" });
          setAudioBlob(audioBlob);
          console.log(audioBlob);
          if (audioBlob) {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64Data = reader.result.split(",")[1];
              console.log("Base64 audio data:", base64Data);

              // Send the base64 data to the API for transcription
              const sttResponse = await fetch(
                "http://127.0.0.1:8000/convert_and_transcribe",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ audio: base64Data }),
                }
              );

              if (sttResponse.ok) {
                const sttData = await sttResponse.json();
                const resultText = sttData.transcription;
                setTranscription(resultText);
                console.log("Transcription:", resultText);
              }
            };
          }
          // convertToBase64();
        };

        mediaRecorder.start();
        setIsRecording(true);
        mediaRecorderRef.current = mediaRecorder;
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const convertToBase64 = async () => {
    console.log(audioBlob);
    if (audioBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1];
        console.log("Base64 audio data:", base64Data);

        // Send the base64 data to the API for transcription
        const sttResponse = await fetch(
          "http://127.0.0.1:8000/convert_and_transcribe",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ audio: base64Data }),
          }
        );

        if (sttResponse.ok) {
          const sttData = await sttResponse.json();
          const resultText = sttData.transcription;
          setTranscription(resultText);
          console.log("Transcription:", resultText);
        }
      };
    }
  };

  
  const showHistoryOverlay = () => {
    setHistoryOverlayVisibility(true);
  };

  const hideHistoryOverlay = () => {
    setHistoryOverlayVisibility(false);
  };

  const preventPropagation = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    hideHistoryOverlay();
  };

  const toggleMicrophone = () => {
    setMicrophoneEnabled(!isMicrophoneEnabled);
    setAnimating(!isAnimating); // Toggle animation state
    if (!isMicrophoneEnabled) {
      startRecording();
      // Start recording when isMicrophoneEnabled becomes false
    } else {
      // Stop recording when isMicrophoneEnabled becomes true
      stopRecording();
    }
  };

  return (
    <HelmetProvider>
      <section id="main" className="main">
        <Helmet>
          <meta charSet="utf-8" />
          <title> {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <div className={isHistoryOverlayVisible ? "blur" : ""}>
          <div
            style={{
              width: "100%",
              height: "80vh",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Spline
              ref={splineRef}
              scene="https://prod.spline.design/l5oYvKDkrSWL8W2I/scene.splinecode"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "0%",
                left: "0%",
              }}
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              style={{
                borderRadius: "100px",
                height: "50px",
                width: "50px",
                transform: "translateY(-55px)",
              }}
              onClick={toggleMicrophone}
            >
              {!isMicrophoneEnabled ? (
                <FaMicrophoneSlash style={{ height: "25px", width: "25px" }} />
              ) : (
                <FaMicrophone style={{ height: "25px", width: "25px" }} />
              )}
            </button>
          </div>
          <div
            className="intro mx-auto"
            style={{
              textAlign: "center",
              position: "fixed",
              bottom: 20,
              left: 20,
            }}
          >
            <button className="btn ac_btn history" onClick={showHistoryOverlay}>
              History
            </button>
          </div>
          <div
            className="intro mx-auto username"
            style={{
              textAlign: "center",
              position: "fixed",
              bottom: 4,
              left: "42vw",
            }}
          >
            <h1>Hello,</h1>
          </div>
          <div
            className="intro mx-auto"
            style={{
              textAlign: "center",
              position: "fixed",
              bottom: 20,
              right: 0,
            }}
          >
            <Link to="/home">
              <button className="btn ac_btn signout">Sign out</button>
            </Link>
          </div>
        </div>
        {isHistoryOverlayVisible && (
          <div className="overlay" onClick={handleOverlayClick}>
            {/* Your overlay content goes here */}
            <div
              className="overlay-content content"
              onClick={preventPropagation}
            >
              <div>
                <button className="btn ac_btn chat">New chat</button>
              </div>
              <p style={{ marginTop: "15px", fontWeight: "bold" }}>
                Previous Chats
              </p>
              <button className="close-btn" onClick={hideHistoryOverlay}>
                Close
              </button>
            </div>
          </div>
        )}
      </section>
    </HelmetProvider>
  );
};

export default Main;

// import React, { useState } from "react";
// import "./style.css";
// import { Helmet, HelmetProvider } from "react-helmet-async";
// import { meta } from "../../content_option";
// import { Link } from 'react-router-dom';
// import Spline from '@splinetool/react-spline';
// import { FaMicrophone } from "react-icons/fa";
// import { FaMicrophoneSlash } from "react-icons/fa";

// export const Main = () => {
//   const [isHistoryOverlayVisible, setHistoryOverlayVisibility] = useState(false);
//   const [isMicrophoneEnabled, setMicrophoneEnabled] = useState(true);

//   const showHistoryOverlay = () => {
//     setHistoryOverlayVisibility(true);
//   };

//   const hideHistoryOverlay = () => {
//     setHistoryOverlayVisibility(false);
//   };

//   const preventPropagation = (e) => {
//     e.stopPropagation();
//   };

//   const handleOverlayClick = () => {
//     hideHistoryOverlay();
//   };

//   const toggleMicrophone = () => {
//     setMicrophoneEnabled(!isMicrophoneEnabled);
//   };

//   return (
//     <HelmetProvider>
//       <section id="main" className="main">
//         <Helmet>
//           <meta charSet="utf-8" />
//           <title> {meta.title}</title>
//           <meta name="description" content={meta.description} />
//         </Helmet>
//         <div className={isHistoryOverlayVisible ? 'blur' : ''}>
//           <div style={{
//             width: "100%", height: "80vh",
//             overflow: "hidden",
//             position: "relative",
//           }}>
//             <Spline scene="https://prod.spline.design/l5oYvKDkrSWL8W2I/scene.splinecode"
//               style={{
//                 position: "absolute",
//                 width: "100%",
//                 height: "100%",
//                 top: "0%",
//                 left: "0%",
//               }}
//             />
//           </div>
//           <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
//             <button
//               style={{ borderRadius: "100px", height: "50px", width: "50px", transform: "translateY(-55px)" }}
//               onClick={toggleMicrophone}
//             >
//               {isMicrophoneEnabled ? (
//                 <FaMicrophoneSlash style={{ height: "25px", width: "25px" }} />
//               ) : (
//                 <FaMicrophone style={{ height: "25px", width: "25px" }} />
//               )}
//             </button>
//           </div>
//           <div className="intro mx-auto" style={{ textAlign: "center", position: "fixed", bottom: 20, left: 20 }}>
//             <button className="btn ac_btn history" onClick={showHistoryOverlay}>History</button>
//           </div>
//           <div className="intro mx-auto username" style={{ textAlign: "center", position: "fixed", bottom: 4, left: "42vw" }}>
//             <h1>Hello,</h1>
//           </div>
//           <div className="intro mx-auto" style={{ textAlign: "center", position: "fixed", bottom: 20, right: 0 }}>
//             <Link to="/home"><button className="btn ac_btn signout">Sign out</button></Link>
//           </div>
//         </div>
//         {isHistoryOverlayVisible && (
//           <div className="overlay" onClick={handleOverlayClick}>
//             {/* Your overlay content goes here */}
//             <div className="overlay-content content" onClick={preventPropagation}>
//               <div>
//               <button className="btn ac_btn chat">New chat</button>
//               </div>
//               <p style={{ marginTop: "15px", fontWeight: "bold" }}>Previous Chats</p>
//               <button className="close-btn" onClick={hideHistoryOverlay}>Close</button>
//             </div>
//           </div>
//         )}
//       </section>
//     </HelmetProvider>
//   );
// };

// export default Main;

// import React, { useState } from "react";
// import "./style.css"; // Import your CSS file containing styles
// import { Helmet, HelmetProvider } from "react-helmet-async";
// import { introdata, meta } from "../../content_option";
// import { Link } from 'react-router-dom';
// import Spline from '@splinetool/react-spline';
// import { FaMicrophone } from "react-icons/fa";
// import { FaMicrophoneSlash } from "react-icons/fa";

// export const Main = () => {
//   const [isHistoryOverlayVisible, setHistoryOverlayVisibility] = useState(false);
//   const [isMicrophoneEnabled, setMicrophoneEnabled] = useState(true);

//   const showHistoryOverlay = () => {
//     setHistoryOverlayVisibility(true);
//   };

//   const hideHistoryOverlay = () => {
//     setHistoryOverlayVisibility(false);
//   };

//   const preventPropagation = (e) => {
//     e.stopPropagation();
//   };

//   const handleOverlayClick = () => {
//     hideHistoryOverlay();
//   };

//   const toggleMicrophone = () => {
//     setMicrophoneEnabled(!isMicrophoneEnabled);
//   };

//   return (
//     <HelmetProvider>
//       <section id="main" className="main">
//         <Helmet>
//           <meta charSet="utf-8" />
//           <title> {meta.title}</title>
//           <meta name="description" content={meta.description} />
//         </Helmet>
//         <div className={isHistoryOverlayVisible ? 'blur' : ''}>
//           <div style={{
//             width: "100%", height: "80vh",
//             overflow: "hidden",
//             position: "relative",
//           }}>
//             <Spline scene="https://prod.spline.design/uFkJjzsj5h8iW49i/scene.splinecode"
//               style={{
//                 position: "absolute",
//                 width: "100%",
//                 height: "100%",
//                 top: "0%",
//                 left: "0%",
//               }}
//             />
//           </div>
//           <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
//             <button
//               style={{ borderRadius: "100px", height: "50px", width: "50px", transform: "translateY(-55px)" }}
//               onClick={toggleMicrophone}
//             >
//               {isMicrophoneEnabled ? (
//                 <FaMicrophoneSlash style={{ height: "25px", width: "25px" }} />
//               ) : (
//                 <FaMicrophone style={{ height: "25px", width: "25px" }} />
//               )}
//             </button>
//           </div>
//           <div className="intro mx-auto" style={{ textAlign: "center", position: "fixed", bottom: 20, left: 20 }}>
//             <button className="btn ac_btn history" onClick={showHistoryOverlay}>History</button>
//           </div>
//           <div className="intro mx-auto username" style={{ textAlign: "center", position: "fixed", bottom: 4, left: "42vw" }}>
//             <h1>Hello,</h1>
//           </div>
//           <div className="intro mx-auto" style={{ textAlign: "center", position: "fixed", bottom: 20, right: 0 }}>
//             <Link to="/home"><button className="btn ac_btn signout">Sign out</button></Link>
//           </div>
//         </div>
//         {isHistoryOverlayVisible && (
//           <div className="overlay" onClick={handleOverlayClick}>
//             {/* Your overlay content goes here */}
//             <div className="overlay-content content" onClick={preventPropagation}>
//               <button className="btn ac_btn chat">New chat</button>
//               <p style={{ marginTop: "15px", fontWeight: "bold" }}>Previous Chats</p>
//               <button className="close-btn" onClick={hideHistoryOverlay}>Close</button>
//             </div>
//           </div>
//         )}
//       </section>
//     </HelmetProvider>
//   );
// };

// export default Main;

// import React, { useState } from "react";
// import "./style.css";
// import { Helmet, HelmetProvider } from "react-helmet-async";
// import { introdata, meta } from "../../content_option";
// import { Link } from 'react-router-dom';
// import Spline from '@splinetool/react-spline';
// import { FaMicrophone } from "react-icons/fa";
// import { FaMicrophoneSlash } from "react-icons/fa";

// export const Main = () => {
//   const [isHistoryOverlayVisible, setHistoryOverlayVisibility] = useState(false);
//   const [isMicrophoneEnabled, setMicrophoneEnabled] = useState(true);

//   const showHistoryOverlay = () => {
//     setHistoryOverlayVisibility(true);
//   };

//   const hideHistoryOverlay = () => {
//     setHistoryOverlayVisibility(false);
//   };

//   const preventPropagation = (e) => {
//     e.stopPropagation();
//   };

//   const handleOverlayClick = () => {
//     hideHistoryOverlay();
//   };

//   const toggleMicrophone = () => {
//     setMicrophoneEnabled(!isMicrophoneEnabled);
//   };

//   return (
//     <HelmetProvider>
//       <section id="main" className="main">
//         <Helmet>
//           <meta charSet="utf-8" />
//           <title> {meta.title}</title>
//           <meta name="description" content={meta.description} />
//         </Helmet>
//         <div style={{
//           width: "100%", height: "80vh",
//           overflow: "hidden",
//           position: "relative",
//         }}>
//           <Spline scene="https://prod.spline.design/uFkJjzsj5h8iW49i/scene.splinecode"
//             style={{
//               position: "absolute",
//               width: "100%",
//               height: "100%",
//               top: "0%",
//               left: "0%",
//               // transform: "translate(-50%, -50%) scale(0.8)",
//             }}
//           />
//         </div>
//         <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <button
//             style={{ borderRadius: "100px", height: "50px", width: "50px", transform: "translateY(-55px)" }}
//             onClick={toggleMicrophone}
//           >
//             {isMicrophoneEnabled ? (
//               <FaMicrophoneSlash style={{ height: "25px", width: "25px" }} />
//             ) : (
//               <FaMicrophone style={{ height: "25px", width: "25px" }} />
//             )}
//           </button>
//         </div>
//         <div className="intro mx-auto" style={{ textAlign: "center", position: "fixed", bottom: 20, left: 20 }}>
//           <button className="btn ac_btn history" onClick={showHistoryOverlay}>History</button>
//         </div>
//         <div className="intro mx-auto username" style={{ textAlign: "center", position: "fixed", bottom: 4, left: "42vw" }}>
//           <h1>Hello,</h1>
//         </div>
//         <div className="intro mx-auto" style={{ textAlign: "center", position: "fixed", bottom: 20, right: 0 }}>
//           <Link to="/home"><button className="btn ac_btn signout">Sign out</button></Link>
//         </div>
//         {isHistoryOverlayVisible && (
//           <div className="overlay" onClick={handleOverlayClick}>
//             {/* Your overlay content goes here */}
//             <div className="overlay-content content" onClick={preventPropagation}>
//               <button className="btn ac_btn chat">New chat</button>
//               <p style={{ marginTop: "15px", fontWeight: "bold" }}>Previous Chats</p>
//             </div>
//           </div>
//         )}
//       </section>
//     </HelmetProvider>
//   );
// };

// export default Main;
