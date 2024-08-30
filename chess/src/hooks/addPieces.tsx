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
import clickFunction from "./clickFunction";
import clickFunctionEmpty from "./clickFunctionEmpty";

const EmptyIcon: React.FC = () => (
    <svg width="0" height="0" style={{ display: 'none' }}>
      {}
    </svg>
  );
const map:Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'BB1' : BBishopIcon, 
    'BB2' : BBishopIcon,
    'WB1' : WBishopIcon,
    'WB2' : WBishopIcon,
    'BK1' : BKnightIcon,
    'BK2' : BKnightIcon,
    'WK1' : WKnightIcon,
    'WK2' : WKnightIcon,
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
    activeId: string | null,
    setActiveId: React.Dispatch<React.SetStateAction<string | null>>
) {
    positions.forEach((element, index) => {
        const targetId = `cell-${index}`;
        const target = document.getElementById(targetId);

        if (target) {
            target.innerHTML = '';

            const IconComponent = map[element || "X"];
            const isBlackPiece = element && element.startsWith('B');
            const isWhitePiece = element && element.startsWith('W');

            if (IconComponent) {
                const container = document.createElement('div');
                ReactDOM.render(
                    <IconComponent
                        onClick={element
                            ? (event: React.MouseEvent<SVGSVGElement>) => clickFunction(event, turn, activeId, setActiveId)
                            : (event: React.MouseEvent<SVGSVGElement>) => clickFunctionEmpty(event, turn, setTurn)}
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