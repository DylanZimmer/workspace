import "../App.css";


function Tracker({ displayText, showInputContainer, input, setInput, handleSend }) {
    return (
      <div className="tracker-container">
        <textarea className="tracker-output" value={displayText} readOnly />
        <div className="chatbox-input-container">
            {showInputContainer && (
              <textarea className="chatbox-input" rows={2} value={input} placeholder="What would you like to track? (comma separated)" onChange={e => setInput(e.target.value)}
                onKeyDown={e => {if (e.key === 'Enter' && !e.shiftKey) {e.preventDefault(); handleSend();}}}
              />
            )}
        </div>
      </div>
    );
  }

export default Tracker;