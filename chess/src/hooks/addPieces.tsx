import React from 'react';
import ReactDOM from 'react-dom';
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
import { ReactComponent as EmptyIcon } from "./No_image.svg";
import clickFunction from "./clickFunction";
import clickFunctionEmpty from "./clickFunctionEmpty";
import getHighlightIndices from './getHighlightIndices';

const map:Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'BB1' : BBishopIcon, 
    'BB2' : BBishopIcon,
    'WB1' : WBishopIcon,
    'WB2' : WBishopIcon,
    'BN1' : BKnightIcon,
    'BN2' : BKnightIcon,
    'WN1' : WKnightIcon,
    'WN2' : WKnightIcon,
    'BK' :BKingIcon,
    'WK' :WKingIcon,
    'WQ' :WQueenIcon,
    'BQ' :BQueenIcon,
    'BR1' :BRookIcon,
    'BR2' :BRookIcon,
    'WR1' :WRookIcon,
    'WR2' :WRookIcon,
    'WP1':WPawnIcon,
    'WP2':WPawnIcon,
    'WP3':WPawnIcon,
    'WP4':WPawnIcon,
    'WP5':WPawnIcon,
    'WP6':WPawnIcon,
    'WP7':WPawnIcon,
    'WP8':WPawnIcon,
    'BP1':BPawnIcon,
    'BP2':BPawnIcon,
    'BP3':BPawnIcon,
    'BP4':BPawnIcon,
    'BP5':BPawnIcon,
    'BP6':BPawnIcon,
    'BP7':BPawnIcon,
    'BP8':BPawnIcon,
    "X" : EmptyIcon
}

const addPieces = function (
    turn: "black" | "white",
    setTurn: React.Dispatch<React.SetStateAction<"black" | "white">>,
    positions: (string | null)[],
    setPositions:React.Dispatch<React.SetStateAction<(string | null)[]>>,
    activeId: string | null,
    setActiveId: React.Dispatch<React.SetStateAction<(string | null)>>
) {
    const activeIndex = activeId ? parseInt(activeId.match(/[0-9]+/)![0], 10) : -1;
    const activeElement = activeIndex !== -1 ? positions[activeIndex] : null;
    const highlightIndices = getHighlightIndices(activeId, positions, activeElement);
    positions.forEach((element:string | null, index:number) => {
        const targetId = `cell-${index}`;
        const target = document.getElementById(targetId);
        
        if (target) {
            target.innerHTML = '';
            target.classList.remove('non-active')
            
            const IconComponent = map[element || "X"];
            const isBlackPiece = element && element.startsWith('B');
            const isWhitePiece = element && element.startsWith('W');
            
            
            const isHighlighted = highlightIndices.includes(index);
            
            const isActive = activeId === targetId;
            if (!isActive && isHighlighted) {
                target.classList.add('non-active'); 
            }

            if (IconComponent) {
                const container = document.createElement('div');
                ReactDOM.render(
                    <IconComponent
                    onClick={element
                        ? (event: React.MouseEvent<SVGSVGElement>) => {
                            clickFunction(event, turn, setTurn, activeId, setActiveId, positions, setPositions)
                        }
                        : (event: React.MouseEvent<SVGSVGElement>) => {
                            clickFunctionEmpty(event, turn, setTurn, activeId, setActiveId, positions, setPositions)
                        }
                        }
                        key={`${element}-${index}`}
                        className={`icon-size ${isBlackPiece ? 'black' : ''} ${isWhitePiece ? 'white' : ''} ${activeId===targetId ? 'active' : ''}`}
                    />,
                    container
                );

                target.appendChild(container);
            }
        }
    });
};

export default addPieces;