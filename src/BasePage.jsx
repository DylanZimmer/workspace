
import React, { useState } from 'react';
import Header from './Header';
//import * as boxes from '../boxes';  need the index.js or something in boxes for this
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

function BasePage() {
  const navigate = useNavigate();
  const [aboutSite, showAboutSite] = useState(false);
  const [popupFront, setPopupFront] = useState(true);

  return (
    <div className="page-wrapper">
      <div className="background"></div>
      <Header page="basepage"/>
      <div className="flex-container">
        <button className="btn" onClick={() => navigate('./Workspace')}>New <br/> Workspace</button>
        <button className="btn" onClick={() => showAboutSite(true)}>Where Am <br/> I?</button>
      </div>

      {aboutSite && (
        <div className="popup-overlay">
          <div className="popup-border">
            <div className="close-btn" onClick={() => showAboutSite(false)}>X</div>
            {popupFront ? (
              <div className="popup-content">
                This is Workspace, an AI-wrapper that tracks what its been asked to as you write. Right now it can only follow the main chatbox, but soon it will support general text streaming. Read about what's to come below, or dive in to a new Workspace!
                <br/><br/><br/><span className="popup-switch-text" onClick={() => setPopupFront(false)}>The future of Workspace</span>
              </div>
            ) : (
              <div className="popup-content">
                <span className="popup-title-text">In the Works</span>
                <ul>
                  <li>Tracking for streaming text</li>
                  <li>Template creation to allow for analyzing large objects</li>
                  <li>Model specialization, allowing for personalized experts</li>
                  <li>Base model overhaul, and the import of other models to provide choices</li>
                </ul>
                <span className="popup-switch-text" onClick={() => setPopupFront(true)}>Back</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default BasePage;
