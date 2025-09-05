import React, { useState } from "react";

function ObjCreator ({ handleSubmit }) {
    const [inputs, setInputs] = useState([[""]])

    const handleInputChange = (value, i, j) => {
        const updated = [...inputs];
        updated[i][j] = value;
        setInputs(updated);
        if (updated[updated.length - 1][0].trim() !== "") {
            setInputs([...updated, [""]]);
        }
    }

    return (
        <div>
            <h3>Inputs:</h3>
            <div className="objCreateInputs">
                {inputs.map((arr, i) => (
                    <input className="inputEntry"
                        key={i} value={arr[0]} onChange={(e) => handleInputChange(e.target.value, i, 0)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ObjCreator;