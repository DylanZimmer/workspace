
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import './App.css';

function LoginBox({ showBox, setShowBox, email, setEmail, password, setPassword, 
  password2, setPassword2, errorMsg, handleLogin, handleSignUp 
}) {
    if (!showBox) return null;

    return (
        <div className="login-box">
            <div className="close-btn" onClick={() => setShowBox(false)}>X</div>
            {errorMsg && <div className="error-msg">{errorMsg}</div>}
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
            <input type="password" placeholder="Confirm Password for Sign Up" value={password2} onChange={e => setPassword2(e.target.value)}/>
            <button onClick={handleLogin}>Log In</button>
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    )
}

function LoginButton ({}) {
    const [showBox, setShowBox] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async() => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setShowBox(false);
            setErrorMsg("");
        } catch (err) {
            setErrorMsg(err.message);
        }
    }

    const handleSignUp = async() => {
        if (password === password2) {
            try {    
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                setShowBox(false);
                setErrorMsg("");  
            } catch (err) {
                setErrorMsg(err.message);  
            }
        } else {
            setErrorMsg("Passwords don't match")
        }
    }

    return (
        <div className="login-container">
            <button className="btn" onClick={() => setShowBox(true)}>Log In/Sign Up</button>
            <LoginBox
                showBox={showBox}
                setShowBox={setShowBox}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                password2={password2}
                setPassword2={setPassword2}
                errorMsg={errorMsg}
                handleLogin={handleLogin}
                handleSignUp={handleSignUp}
            />
        </div>
    )
}

export default LoginButton;