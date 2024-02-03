import React, { useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { introdata, meta } from "../../content_option";
import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';


export const Main = () => {
  const [isHistoryOverlayVisible, setHistoryOverlayVisibility] = useState(false);

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

  return (
    <HelmetProvider>
      <section id="main" className="main">
        <Helmet>
          <meta charSet="utf-8" />
          <title> {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <div style={{ width: "100%", height: "80vh" }}>
          <Spline scene="https://prod.spline.design/uFkJjzsj5h8iW49i/scene.splinecode" />
        </div>
        <div className="intro mx-auto" style={{ textAlign: "center", position: "fixed", bottom: 20, left: 20 }}>
          <button className="btn ac_btn history" onClick={showHistoryOverlay}>History</button>
        </div>
        <div className="intro mx-auto" style={{ textAlign: "center", position: "fixed", bottom: 20, right: 0 }}>
          <Link to="/home"><button className="btn ac_btn signout">Sign out</button></Link>
        </div>

        {isHistoryOverlayVisible && (
          <div className="overlay" onClick={handleOverlayClick}>
            {/* Your overlay content goes here */}
            <div className="overlay-content content" onClick={preventPropagation}>
              <button className="btn ac_btn chat">New chat</button>
              <p style={{ marginTop: "15px", fontWeight: "bold" }}>Previous Chats</p>
            </div>
          </div>
        )}
      </section>
    </HelmetProvider>
  );
};

export default Main;
