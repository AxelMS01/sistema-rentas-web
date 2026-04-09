import React, { useState } from "react";
import SignatureCanvas from "react-signature-canvas";

/**
 * 
 * @param {(string) => void} onSaveSignature 
 * @returns 
 */

function LienzoFirma({ onSaveSignature }) {
    const [sign, setSign] = useState();

    onSaveSignature("hiii");

    return (
        <div className="container" style={{ borderWidth: 1, borderColor: "grey", borderRadius: 10, borderStyle: "solid" }}>
            <SignatureCanvas
                ref={data => setSign(data)}
            />
        </div>
    );
};

export default LienzoFirma;