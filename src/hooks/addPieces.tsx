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

type ClickFunctionType = (
    event: React.MouseEvent<SVGSVGElement>,
    turn: "black" | "white",
    setTurn: React.Dispatch<React.SetStateAction<"black" | "white">>,
    activeId: string | null,
    setActiveId: React.Dispatch<React.SetStateAction<string | null>>,
    positions: (string | null)[],
    setPositions: React.Dispatch<React.SetStateAction<(string | null)[]>>,
    highlightedSquares: Set<number>,
    setHighlightedSquares: React.Dispatch<React.SetStateAction<Set<number>>>,
    activePieceType: string | null,
    setActivePieceType: React.Dispatch<React.SetStateAction<string | null>>,
    lastMove: { from: number; to: number; piece: string } | null,
    setLastMove: React.Dispatch<React.SetStateAction<{ from: number; to: number; piece: string } | null>>,
    setTaken: React.Dispatch<React.SetStateAction<string[]>>
  ) => void;

  const baseMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'BB': BBishopIcon,  
    'WB': WBishopIcon, 
    'BN': BKnightIcon,
    'WN': WKnightIcon,
    'BK': BKingIcon,
    'WK': WKingIcon,
    'BQ': BQueenIcon,
    'WQ': WQueenIcon,
    'BR': BRookIcon,
    'WR': WRookIcon,
    'BP': BPawnIcon,
    'WP': WPawnIcon,
    'X': EmptyIcon
};

const getIconComponent = (piece: string | null) => {
    if (!piece) return baseMap["X"]; // Return empty icon for null or empty piece
    const baseType = piece.replace(/[0-9]/g, ''); // Remove any number suffix from promoted pieces
    return baseMap[baseType] || baseMap["X"]; // Return the matching component or empty icon if not found
};

// Updated addPieces function
const addPieces = (
    turn: "black" | "white",
  setTurn: React.Dispatch<React.SetStateAction<"black" | "white">>,
  positions: (string | null)[],
  setPositions: React.Dispatch<React.SetStateAction<(string | null)[]>>,
  activeId: string | null,
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>,
  highlightedSquares: Set<number>,
  setHighlightedSquares: React.Dispatch<React.SetStateAction<Set<number>>>,
  activePieceType: string | null,
  setActivePieceType: React.Dispatch<React.SetStateAction<string | null>>,
  clickFunction: ClickFunctionType,
  clickFunctionEmpty: ClickFunctionType,
  lastMove: { from: number; to: number; piece: string } | null,
  setLastMove: React.Dispatch<React.SetStateAction<{ from: number; to: number; piece: string } | null>>, // Add this
  setTaken: React.Dispatch<React.SetStateAction<string[]>> // Add this
) => {
    positions.forEach((element: string | null, index: number) => {
        const targetId = `cell-${index}`;
        const target = document.getElementById(targetId);

        if (target) {
            target.innerHTML = ''; // Clear the cell content
            target.classList.remove('non-active', 'highlight'); // Remove old classes

            const IconComponent = getIconComponent(element);
            const isBlackPiece = element && element.startsWith('B');
            const isWhitePiece = element && element.startsWith('W');

            const isHighlighted = highlightedSquares.has(index);
            const isActive = activeId === targetId;

            // Add 'highlight' class for squares that should be highlighted
            if (isHighlighted) {
                target.classList.add('highlight');
            }

            // Add 'non-active' class for squares that are highlighted but not active
            if (!isActive && isHighlighted) {
                target.classList.add('non-active');
            }

            if (IconComponent) {
                const container = document.createElement('div');
                ReactDOM.render(
                    <IconComponent
                        onClick={(event: React.MouseEvent<SVGSVGElement>) => {
                            if (element) {
                                clickFunction( event,
                                    turn,
                                    setTurn,
                                    activeId,
                                    setActiveId,
                                    positions,
                                    setPositions,
                                    highlightedSquares,
                                    setHighlightedSquares,
                                    activePieceType,
                                    setActivePieceType,
                                    lastMove,
                                    setLastMove,
                                    setTaken);
                            } else {
                                clickFunctionEmpty( event,
                                    turn,
                                    setTurn,
                                    activeId,
                                    setActiveId,
                                    positions,
                                    setPositions,
                                    highlightedSquares,
                                    setHighlightedSquares,
                                    activePieceType,
                                    setActivePieceType,
                                    lastMove,
                                    setLastMove,
                                    setTaken);
                            }
                        }}
                        key={`${element}-${index}`}
                        className={`icon-size ${isBlackPiece ? 'black' : ''} ${isWhitePiece ? 'white' : ''} ${isActive ? 'active' : ''}`}
                    />,
                    container
                );

                target.appendChild(container);
            }
        }
    });
};

export default addPieces;
