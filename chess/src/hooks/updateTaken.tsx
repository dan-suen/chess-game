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
const findTaken = function (positions:(string|null)[], setTaken:React.Dispatch<React.SetStateAction<(string | null)[]>>) {
    let pieces:string[] = ["WB1","WB2","WR1","WR2","WK1","WK2","WK","WQ","WP1","WP2","WP3","WP4","WP5","WP6","WP7","WP8","BB1","BB2","BR1","BR2","BK1","BK2","BK","BQ","BP1","BP2","BP3","BP4","BP5","BP6","BP7","BP8"];
    let filtered = pieces.filter(element => !positions.includes(element))
    let results:string[] = []
    filtered.forEach(element => {
        switch(element){
            case "WB1":
            case "WB2":
                results.push('WBishop')
                break;
            case "WR1":
            case "WR2":
                results.push('WRook')
                break;
            case "WK1":
            case "WK2":
                results.push('WKnight')
                break;
            case "WQ":
                results.push('WQueen')
                break;
            case "WP1":
            case "WP2":
            case "WP3":
            case "WP4":
            case "WP5":
            case "WP6":
            case "WP7":
            case "WP8":
                results.push('WPawn')
                break;
            case "BB1":
            case "BB2":
                results.push('BBishop')
                break;
            case "BR1":
            case "BR2":
                results.push('BRook')
                break;
            case "BK1":
            case "BK2":
                results.push('BKnight')
                break;
            case "BQ":
                results.push('BQueen')
                break;
            case "BP1":
            case "BP2":
            case "BP3":
            case "BP4":
            case "BP5":
            case "BP6":
            case "BP7":
            case "BP8":
                results.push('BPawn')
                break;
        }
    })
    setTaken(results);
}
const updateTaken = function (positions:(string|null)[],taken:(string|null)[], setTaken:React.Dispatch<React.SetStateAction<(string | null)[]>>) {

    findTaken(positions, setTaken)


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
            {BTaken.map((piece,index) => {
                const IconComponent = map[piece || "X"];
                return IconComponent ? <IconComponent key={`${piece}-${index}`} className="icon-size" /> : null;
            })}
        </>
    );

    let bChild = document.createElement('div');
    bChild.setAttribute("id", "takenWhite");
    const bRoot = createRoot(bChild);
    
    bRoot.render(
        <>
            <p>Pieces Taken by Black:</p>
            {WTaken.map((piece,index) => {
                const IconComponent = map[piece || "X"];
                return IconComponent ? <IconComponent key={`${piece}-${index}`} className="icon-size" /> : null;
            })}
        </>
    );

    
    
    
    target.appendChild(wChild);
    target.appendChild(bChild);
}

export default updateTaken;