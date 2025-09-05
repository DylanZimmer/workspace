
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

function Header ({ page, triggerTellCommands }) {
    const navigate = useNavigate();
    const [collapse, toggleCollapse] = useState(false);
    
    if (page==='basepage') { 
        return (
            <div className="header-container">
                <img src="/logo.png" alt="Logo" className="header-logo" onClick={() => navigate('/')}/>    
            </div>
        )
    } else if (page === 'workspace') {
        return collapse ? (
            <div className="header-collapsed">
                <span className="collapse-arrow-down" onClick={() => toggleCollapse(false)}></span>
            </div>
        ) : (
            <div className="header-container">
                <button className="btn-header" onClick={triggerTellCommands}>Tell Me<br/>Commands</button>
                <img src="/logo.png" alt="Logo" className="header-logo" onClick={() => navigate('/')}/> 
                <span className="collapse-arrow-up" onClick={() => toggleCollapse(true)}></span>  
            </div>         
        )        
    }
}

export default Header;