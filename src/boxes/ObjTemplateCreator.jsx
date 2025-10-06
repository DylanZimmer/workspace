import { useEffect, useState } from 'react';

//otc is object-template-creator
function ObjTemplateCreator ({}) {
    const [objType, setObjType] = useState("");
    const [inputs, setInputs] = useState([{ name: "", exVal: "" }]);
    const [rows, setRows] = useState(1);
    const [cols, setCols] = useState(1);
    const [matrix, setMatrix] = useState([[""]]);

    const handleInputChange = (i, field, value) => {
        const newInputs = [...inputs];
        newInputs[i][field] = value;
        setInputs(newInputs);
        if (i === inputs.length - 1 && 
            (newInputs[i].name !== "" || newInputs[i].exVal !== "")
        ) {
            setInputs([...newInputs, { name: "", exVal: "" }]);
        }
    };

    const resizeMatrix = () => {
        const newMatrix = Array.from({ length: rows }, (row, r) =>
            Array.from({ length: cols }, (col, c) => matrix[r]?.[c] ?? ""));
        setMatrix(newMatrix);
    };

    useEffect(() => {
        resizeMatrix();
    }, [rows, cols]);

    return (
        <div className="otc-container">
            <div className="otc-input-box">
                <div className="otc-input-label">Object Type:</div>
                <input className="otc-input" value={objType} onChange={(e) => setObjType(e.target.value)} />
            </div>
            <div className="otc-input-box">
                <div className="otc-input-label">All Necessary Inputs:</div>
                {inputs.map((field, i) => (
                    <div className="otc-input-row" key={`in_${i}`}>
                        <div className="otc-small-input">Input Name:</div>
                        <input className="otc-input" value={field.name} onChange={(e) => handleInputChange(i, "name", e.target.value)} />
                        <div className="otc-small-input">Example Value:</div>
                        <input className="otc-input" value={field.exVal} onChange={(e) => handleInputChange(i, "exVal", e.target.value)} />
                    </div>
                ))}
            </div>
            <div className="otc-matrix-container">
                <div className="otc-matrix-header">Example:
                    <input className="otc-matrix-dim" type="number" min="1" value={rows} onChange={(e) => setRows(parseInt(e.target.value) || rows)}/>
                    x
                    <input className="otc-matrix-dim" type="number" min="1" value={cols} onChange={(e) => setCols(parseInt(e.target.value) || cols)}/>
                </div>
            </div>
            <div className="matrix-grid">
                {matrix.map((row, r) => (
                    <div className="matrix-row" key={`row_${r}`}>
                        {row.map((cell, c) => (
                            <input className="matrix-cell" key={`cell_${r}_${c}`} value={cell} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ObjTemplateCreator;