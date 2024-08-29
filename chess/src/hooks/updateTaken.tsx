import React from "react";
import { ReactComponent as BBishopIcon } from "./Chess_bdt45.svg";
import { ReactComponent as WBishopIcon } from "./Chess_blt45.svg";
import { ReactComponent as BKingIcon } from "./Chess_kdt45.svg";
import { ReactComponent as WKingIcon } from "./Chess_klt45.svg";
import { ReactComponent as BKnightIcon } from "./Chess_ndt45.svg";
import { ReactComponent as WKnightIcon } from "./Chess_nlt45.svg";
import { ReactComponent as BQueenIcon } from "./Chess_qdt45.svg";
import { ReactComponent as WQueenIcon } from "./Chess_qlt45.svg";
import { ReactComponent as BRookIcon } from "./Chess_rdt45.svg";
import { ReactComponent as WRookIcon } from "./Chess_rlt45.svg";
import { ReactComponent as BPawnIcon } from "./Chess_pdt45.svg";
import { ReactComponent as WPawnIcon } from "./Chess_plt45.svg";
import { ReactComponent as X } from "./x-symbol-svgrepo-com.svg";
import { createRoot } from 'react-dom/client';
const map:Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'BBishop' : BBishopIcon, 
    'WBishop' : WBishopIcon,
    'BKnight' : BKnightIcon,
    'WKnight' : WKnightIcon,
    'BKing' :BKingIcon,
    'WKing' :WKingIcon,
    'WQueen' :WQueenIcon,
    'BQueen' :BQueenIcon,
    'BRook' :BRookIcon,
    'WRook' :WRookIcon,
    'WPawn':WPawnIcon ,
    'BPawn':BPawnIcon,
    "X" : X
}
const updateTaken = function (positions:(string|null)[],taken:(string|null)[], setTaken:React.Dispatch<React.SetStateAction<(string | null)[]>>) {

    



    let BTaken = taken.filter(element => /^B/g.test(element || "")).length > 0 
            ? taken.filter(element => /^B/g.test(element || "")) 
            : ["X"];

    let WTaken = taken.filter(element => /^W/g.test(element || "")).length > 0 
             ? taken.filter(element => /^W/g.test(element || "")) 
             : ["X"];


    let target = document.getElementById("taken");
    if (target === null) {
        console.error('Target element not found');
        return;
    }
    if (target) {
        target.innerHTML = '';
    }




    let wChild = document.createElement('div');
    wChild.setAttribute("id", "takenBlack");
    const wRoot = createRoot(wChild);
    
    wRoot.render(
        <>
            <p>Pieces Taken by White:</p>
            {BTaken.map(piece => {
                const IconComponent = map[piece || "X"];
                return IconComponent ? <IconComponent key={piece} className="icon-size" /> : null;
            })}
        </>
    );

    let bChild = document.createElement('div');
    bChild.setAttribute("id", "takenWhite");
    const bRoot = createRoot(bChild);
    
    bRoot.render(
        <>
            <p>Pieces Taken by Black:</p>
            {WTaken.map(piece => {
                const IconComponent = map[piece || "X"];
                return IconComponent ? <IconComponent key={piece} className="icon-size" /> : null;
            })}
        </>
    );

    
    
    
    target.appendChild(wChild);
    target.appendChild(bChild);
}

export default updateTaken;