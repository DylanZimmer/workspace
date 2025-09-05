import "../App.css";

function Chatbox({ messages, input, setInput, handleSend }) {
    return (
<>
        <div className="chatbox-messages">
            {messages.map((msg, index) => (
                <div key={index} style={{ marginBottom: '0.5rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    <span style={{ padding: '6px 10px', borderRadius: '8px', display: 'inline-block',
                        backgroundColor: msg.role === 'user' ? '#e1f5fe' : '#f1f1f1',
                    }}>
                        {msg.parts?.[0]?.text || ""}
                    </span>
                </div>
            ))}
        </div>
        <div className="chatbox-input-container">
            <textarea className="chatbox-input" rows={2} value={input} placeholder="Type Here" onChange={e => setInput(e.target.value)}
                onKeyDown={e => {if (e.key === 'Enter' && !e.shiftKey) {e.preventDefault(); handleSend();}}}
            />
        </div>
</>
    );
}

export default Chatbox;