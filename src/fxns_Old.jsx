
import { useState } from 'react';
import Chatbox from './boxes/Chatbox';


// {createBox{id:T_<0>,type:T}}
export function callFxn(fxn) {
  let fxnName = fxn.match("{.+{");

  if (fxnName.includes("createBox")) {
    const id = fxn.match("id:(.+>)");
    const type = fxn.match("type:(.)");
    return { id, type };
  }
}

export function getParameters(fxnCall) {
  const regex = /(\w+):([^,}]+)/g;
  const params = [...fxnCall.matchAll(regex)].reduce((entry, match) => {entry[match[1].trim()] = match[2].trim();return entry;}, {});
  return params;
}

export function Box({ id, type }) {
  const [text, setText] = useState('');
  if (type === 'T') {
    return (
      <div className="text-box" key={id}>
        <textarea placeholder="Write something..." value={text} onChange={(e) => setText(e.target.value)} />
      </div>
    );
  } else if (type === 'C') {
    return (
      <div className="chat-box" key={id}>
        <Chatbox />
      </div>
    )
  }
  return <div key={id}>[Unknown box type: {type}]</div>
}

/*
export function retBoxContainerUp(boxes) {
  if (boxes.length === 1) { return (
    <div className="box-container full-layout">
      <div className="box" style={{ flex: 1 }}>{renderBox(boxes[0])}</div>
    </div>
  )};
}*/