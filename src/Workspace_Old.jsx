import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import * as fxns from './fxns.jsx';
import Chatbox from './boxes/Chatbox.jsx';

function Workspace_Old() {
    const [baseText, setBaseText] = useState("");
    const [boxes, setBoxes] = useState([]);
    const [boxAdd, triggerboxAdd] = useState(null);
    const [boxTexts, setBoxTexts] = useState("");
    const [chatInputs, setChatInputs] = useState({baseCB: '', mainHB: '',});
    const [chatMessages, setChatMessages] = useState({baseCB: [], mainHB: [],});
    const [leftWidth, setLeftWidth] = useState(40);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const containerRef = useRef(null);
    const debounceTimeout = useRef(null);
    const lastSentRef = useRef("");


    useEffect(() => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    
      debounceTimeout.current = setTimeout(() => {
        if (baseText.trim() !== '' && baseText !== lastSentRef.current) {
          // Figure out the diff (simplest: substring from last match)
          const lastValue = lastSentRef.current;
          let diff = "";
    
          if (baseText.startsWith(lastValue)) {
            diff = baseText.slice(lastValue.length); // only the new part
          } else {
            diff = baseText; // text was replaced/edited, send all
          }
    
          handleSendMainHB(diff);
    
          lastSentRef.current = baseText; // update after sending
        }
      }, 800);
    
      return () => clearTimeout(debounceTimeout.current);
    }, [baseText]);
    
    

    //Make new boxes
    useEffect(() => {
      if (boxAdd) {
        setBoxes(prev => [...prev, boxAdd]);
        triggerboxAdd(null);
      } 
    }, [boxAdd]);

    const horizontalDrag = (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const containerWidth = containerRef.current.offsetWidth;
      const startPercent = leftWidth;

      const onMouseMove = (moveEvent) => {
        const deltaPx = moveEvent.clientX - startX;
        const deltaPercent = (deltaPx / containerWidth) * 100;
        let newPercent = startPercent + deltaPercent;
  
        // Clamp between 10% and 90% so neither panel disappears
        newPercent = Math.max(10, Math.min(90, newPercent));
  
        setLeftWidth(newPercent);
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
  
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }


    function renderBox({ id, type }) {
      if (id) {  //can't be while(id) but does need to be a while to make it the last id
        console.log("Old" + id);
        id = id.replace(/(\d+)$/, (_, n) => `${Number(n) + 1}`);
        console.log("New" + id);
      }
      if (type === "T") { 
        return (
          <div key={id} className="text-box"> <textarea value={boxTexts[id] || ""} onChange={(e) => updateText(id, e.target.value)} placeholder="Write something..." /> </div>
        )
      } else if (type === "C") { 
        return (
          <div key={id} className="chatbox"> <Chatbox id={id} messages={chatMessages[id] || []} input={chatInputs[id] || ''} setInput={newInput => setChatInputs(prev => ({ ...prev, [id]: newInput }))} handleChatSend={() => handleChatSend(id)} /></div>
        )
      } else if (type === "OC") {
        return (
          <div key={id} className="obj-creator-container"> <ObjCreator saveObjType={() => saveObjType()}/></div> //createObjType() should save to the NoSQL db
        )
      }
        return null;
    };

    function showBoxes(boxes) {
      
    }


    
    function updateText(id, newText) {
      setBoxTexts(prev => ({ ...prev, [id]: newText }));
    };
    
    const handleChatSend = async (id) => {
      const input = chatInputs[id];
      if (!input.trim()) return;

      // The functions the user can ask for-----------------------------------------------------------
      if (id === "baseCB") {
        if (input.contains("^createObjType")) { //there will be a list of these at the top, should be changeable
          
        }
      }


      //----------------------------------------------------------------------------------------------
    
      // Append user message locally
      setChatMessages(prev => ({
        ...prev,
        [id]: [...(prev[id] || []), { text: input, sender: "user" }]
      }));
      setChatInputs(prev => ({ ...prev, [id]: "" }));
    
      try {
        const response = await fetch("http://localhost:4000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input })
        });
    
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
        const data = await response.json();
        const assistantText = data.text || "";
    
        // Append assistant reply
        setChatMessages(prev => ({
          ...prev,
          [id]: [...(prev[id] || []), { text: assistantText, sender: "bot" }]
        }));
      } catch (err) {
        console.error("Error sending message:", err);
        setChatMessages(prev => ({
          ...prev,
          [id]: [...(prev[id] || []), { text: "[Error connecting to server]", sender: "bot" }]
        }));
      }
    };

    const handleSendMainHB = async (textOverride) => {
      const id = 'mainHB';
      const textToSend = textOverride ?? baseText;
    
      const messagesToSend = (chatMessages[id] || []).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));
    
      messagesToSend.push({
        role: 'system',
        content: `The current story text is:\n${textToSend}\nKeep track of all characters, their personalities, and ongoing storylines. Provide updated tracking information.`
      });
    
      try {
        const response = await fetch('http://localhost:4000/helper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messagesToSend }),
        });
    
        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`);
        }
    
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
    
        let assistantText = '';
        // Append empty bot message to start streaming into
        setChatMessages(prev => ({...prev, [id]: [...(prev[id] || []), { text: '', sender: 'bot' }] }));
    
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
    
          assistantText += chunk;
    
          setChatMessages(prev => {
            const updated = [...(prev[id] || [])];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0 && updated[lastIndex].sender === 'bot') {
              updated[lastIndex] = {
                ...updated[lastIndex],
                text: assistantText
              };
            }
            return { ...prev, [id]: updated };
          });
        }
    
      } catch (err) {
        console.error('Error in handleModelSend:', err);
        setChatMessages(prev => ({
          ...prev,
          [id]: [...(prev[id] || []), { text: '[Error connecting to server]', sender: 'bot' }]
        }));
      }
    };

    return (
        <div className="page-wrapper">
          <div className="background Workspace"></div>
          <div className="split-layout" ref={containerRef}>
            <div key='mainHB' className="main-helpbox" style={{ width: `${leftWidth}%` }}> <Chatbox id='mainHB' messages={chatMessages['mainHB'] || []} input={chatInputs['mainHB'] || ''} setInput={newInput => setChatInputs(prev => ({ ...prev, ['mainHB']: newInput }))} handleSend={() => handleChatSend('mainHB')} /></div>
            <div className="resize-divider" onMouseDown={horizontalDrag} />
            <div className="main-text-box" key="baseTB" style={{ width: `${100 - leftWidth}%` }}>
              <textarea placeholder="Write something..." value={baseText} onChange={(e) => setBaseText(e.target.value)} />
            </div>
          </div>
            
          <div key='baseCB'  className={`base-chatbox ${isCollapsed ? "collapsed" : ""}`}>
            <Chatbox id='baseCB' messages={chatMessages['baseCB'] || []} input={chatInputs['baseCB'] || ''} setInput={newInput => setChatInputs(prev => ({ ...prev, ['baseCB']: newInput }))} handleSend={() => handleChatSend('baseCB')} base={true} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} /> 
          </div>
        
        
        </div>
    )
}

export default Workspace_Old;




















/* Keeping for rendering boxes that overlay
    return (
        <div className="page-wrapper">
          <div className="background Workspace_Old"></div>
          <div className={`box-container layouts[boxes.length]`}>
            {boxes.map((box, index) => (
              <div key={box.id} className="box"
              ref={index === 0 ? leftRef : index === 1 ? rightRef : null}
              style={ boxes.length === 1 ? { flex: 1 }
                : index === 0 ? { width: leftWidth, resize: "horizontal" } : index === 1 ? { width: rightWidth } : {}
              }>
                {renderBox(box)}
              </div>
            ))}
          </div>
            
          <div key='0' className="base-chatbox"> <Chatbox id='0' messages={chatMessages[0] || []} input={chatInputs[0] || ''} setInput={newInput => setChatInputs(prev => ({ ...prev, [0]: newInput }))} handleChatSend={() => handleChatSend(0)} /></div>
        </div>
    )
    */