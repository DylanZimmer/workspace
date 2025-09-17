import React, { useContext, useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './Header';
import Chatbox from './boxes/Chatbox';
import Tracker from './boxes/Tracker';
//import { useFxns } from './fxns.js';
//import { GlobalStateContext } from './global_states';

function Workspace() {
    const [baseCBHist, setBaseCBHist] = useState([]);
    const [baseCBInput, setBaseCBInput] = useState("");
    const containerRef = useRef(null);
    const [pendingMessageCB, setPendingMessageCB] = useState(null);
    const [pendingMessageT, setPendingMessageT] = useState(null);
    const [trackerInput, setTrackerInput] = useState("");
    const [allowTrackerInput, toggleAllowTrackerInput] = useState(true);
    const [trackerText, setTrackerText] = useState("");
    let trackingTextSnapshot = "";
    const [showTracker, toggleShowTracker] = useState(false);
    //below was globalized
    const [leftWidth, setLeftWidth] = useState(0);
    const [trackerList, setTrackerList] = useState([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;


    /*  for globalization
    const {
        showTracker, toggleShowTracker,
        leftWidth, setLeftWidth,
    } = useContext(GlobalStateContext);
     */


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
          newPercent = Math.max(20, Math.min(90, newPercent));
    
          setLeftWidth(newPercent);
        };
  
        const onMouseUp = () => {
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        };
    
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }

    const fxns = {
      objCreator: {
        description: "Creates a new object in memory",
        fxn: () => {
          console.log("Hit objCreator");
        }
      },
      tracker: {
        description: "Opens a container that tracks info",
        fxn: () => {
          toggleShowTracker(true);
          setLeftWidth(60);
        }
      },
    }

    const callFxn = (fxnName) => {
        const entry = fxns[fxnName];
        entry.fxn();
    }

    /*   for globalized states - not sure this is better
    const fxns = useFxns();
    const callFxn = (fxnName) => {
        const entry = fxns[fxnName];
        entry.fxn();
    };
    */

   const handleTrackerSend = () => {
     if (!trackerInput.trim()) return;
     if (trackerText === "") {
      setBaseCBInput("^^");
      const trackerListTmp = trackerInput.split(",").map(item => item.trim());
      setTrackerList(trackerListTmp);
      const formatted = trackerListTmp
        .map(item => `${item}: {\n\n}`)
        .join("\n");  
      setTrackerText(formatted);
      toggleAllowTrackerInput(false);
      }
     setTrackerInput("");
     //toggleAllowTrackerInput(false);
   }
   
   const handleChatSend = () => {
     if (!baseCBInput.trim()) return;
     
     const newMessage = { role: "user", parts: [{ text: baseCBInput }] };
     const histSnapshot = [...baseCBHist, newMessage]; // snapshot here
     
     setBaseCBHist(histSnapshot);
     setPendingMessageCB({ newMessage, histSnapshot }); 
     

     if (showTracker) {
        const latestMessages = [ baseCBHist[baseCBHist.length - 1], newMessage ];
        setPendingMessageT({ latestMessages })
      }

      setBaseCBInput("");
    };
    
    //Below is tracker
    useEffect(() => {
      if (!pendingMessageT) return;
      const updateTracker = async () => {
        let trackerTextTmp = "";
        for (let i = 0; i < trackerList.length; i++) {
          const trackerEntryText = (trackerText.match(new RegExp(`${trackerList[i]}:\\s*{[\\s\\S]*?}`)) || [])[0]?.trim() || "";
          try {
            const responseTmp = await fetch(`${apiUrl}/updateTracker`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                messages: pendingMessageT.latestMessages,
                trackerEntry: trackerEntryText
              })
            });
            if (!responseTmp.ok) throw new Error(`HTTP ${responseTmp.status}`);
            const response = await responseTmp.json();
            trackerTextTmp += response.parts[0].text.trim() + "\n";
          } catch (err) {
            console.error(err);
          }
        }
        setTrackerText(trackerTextTmp);
      };

  updateTracker();
  }, [pendingMessageT]);

    //Below is chatbox
    useEffect(() => {
        if (!pendingMessageCB) return;
      
        const sendMessage = async () => {
          try {
            const responseTmp = await fetch(`${apiUrl}/chat`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ messages: pendingMessageCB.histSnapshot })
            });

            if (!responseTmp.ok) throw new Error(`HTTP ${responseTmp.status}`);
            const response = await responseTmp.json();
            let returnResponse = response.parts[0].text;

            if (returnResponse.includes("^^")) {
                const retFxn = returnResponse.match(/\^\^([^}]+)\}/);
                returnResponse = returnResponse.slice(retFxn[0].length).trim();
                if (retFxn[0].includes("tracker")) {
                  if (showTracker == false) {
                    returnResponse = "Enter what you want tracked in the tracker input box."
                  } else {
                    returnResponse = "There's already a tracker, just chat with me"
                  }
                }
                if (returnResponse === "") {
                    returnResponse = "Yes, I can do that."
                }
                const fxnName = retFxn[1].replace(/[^a-zA-Z]/g, "");
                try {
                    callFxn(fxnName);
                } catch (fxnErr) {
                    console.error("Error calling function:", fxnErr);
              }
            };

            setBaseCBHist(prev => [
              ...prev, { role: "model", parts: [{ text: returnResponse }] }
            ]);
            

          } catch (err) {
            setBaseCBHist(prev => [
              ...prev, { role: "model", parts: [{ text: "[Error connecting to server]" }] }
            ]);
          } finally {
            setPendingMessageCB(null);
          }
        };
      
        sendMessage();
    }, [pendingMessageCB]);

    const tellCommands = () => {
      {showTracker ? (
        setBaseCBHist(prev => [
          ...prev, { role: "model", parts: [{ text: "All I can do right now is make the tracker. Just talk to me please!" }] }
        ])
      ) : (
        setBaseCBHist(prev => [
          ...prev, { role: "model", parts: [{ text: "Ask me to make a tracker and it will follow our conversation!" }] }
        ])
      )};
    }
      
    
    return (
        <div className="page-wrapper">
            <div className="background workspace"></div>
            <Header page="workspace" triggerTellCommands={tellCommands} />
            <div className="split-layout" ref={containerRef}>
                {showTracker && (
                    <>
                    <div className="tracker-container" style={{ flex: leftWidth }}>
                        <Tracker id='tracker' showInputContainer={allowTrackerInput} displayText={trackerText} input={trackerInput} setInput={setTrackerInput} handleSend={handleTrackerSend}/> 
                    </div>
                    <div className="resize-divider" onMouseDown={horizontalDrag} />
                    </>
                )}
                <div className="chatbox-container" style={{ flex: 100 - leftWidth }}>
                    <Chatbox id='baseCB' messages={baseCBHist} input={baseCBInput} setInput={setBaseCBInput} handleSend={handleChatSend} />
                </div>
            </div>
        </div>
    )
}

export default Workspace;