import React, { useState, useEffect } from "react";
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

// Map of piece names to their SVG components
const map: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'BBishop': BBishopIcon, 
    'WBishop': WBishopIcon,
    'BKnight': BKnightIcon,
    'WKnight': WKnightIcon,
    'BKing': BKingIcon,
    'WKing': WKingIcon,
    'WQueen': WQueenIcon,
    'BQueen': BQueenIcon,
    'BRook': BRookIcon,
    'WRook': WRookIcon,
    'WPawn': WPawnIcon,
    'BPawn': BPawnIcon,
    "X": X
};

// Find taken pieces based on current positions
const findTaken = (positions: (string | null)[], setTaken: React.Dispatch<React.SetStateAction<string[]>>) => {
    const pieces: string[] = [
        "WB1", "WB2", "WR1", "WR2", "WN1", "WN2", "WK", "WQ", "WP1", "WP2", "WP3", "WP4", "WP5", "WP6", "WP7", "WP8",
        "BB1", "BB2", "BR1", "BR2", "BN1", "BN2", "BK", "BQ", "BP1", "BP2", "BP3", "BP4", "BP5", "BP6", "BP7", "BP8"
    ];

    const filtered = pieces.filter(piece => !positions.includes(piece));
    const results = filtered.map(piece => {
        switch (piece) {
            case "WB1":
            case "WB2":
                return 'WBishop';
            case "WR1":
            case "WR2":
                return 'WRook';
            case "WN1":
            case "WN2":
                return 'WKnight';
            case "WQ":
                return 'WQueen';
            case "WP1":
            case "WP2":
            case "WP3":
            case "WP4":
            case "WP5":
            case "WP6":
            case "WP7":
            case "WP8":
                return 'WPawn';
            case "BB1":
            case "BB2":
                return 'BBishop';
            case "BR1":
            case "BR2":
                return 'BRook';
            case "BN1":
            case "BN2":
                return 'BKnight';
            case "BQ":
                return 'BQueen';
            case "BP1":
            case "BP2":
            case "BP3":
            case "BP4":
            case "BP5":
            case "BP6":
            case "BP7":
            case "BP8":
                return 'BPawn';
            default:
                return 'X';
        }
    });

    setTaken(results);
};

// Component to display taken pieces
const TakenPieces: React.FC<{ positions: (string | null)[] }> = ({ positions }) => {
    const [taken, setTaken] = useState<string[]>([]);

    useEffect(() => {
        findTaken(positions, setTaken);
    }, [positions]);

    const BTaken = taken.filter(piece => piece.startsWith('B'));
    const WTaken = taken.filter(piece => piece.startsWith('W'));

    return (
        <div id="taken">
            <div id="takenBlack">
                <p>Pieces Taken by White:</p>
                {BTaken.length > 0 ? (
                    BTaken.map((piece, index) => {
                        const IconComponent = map[piece || "X"];
                        return IconComponent ? <IconComponent key={`${piece}-${index}`} className="icon-size" /> : null;
                    })
                ) : (
                    <p>No pieces taken</p>
                )}
            </div>
            <div id="takenWhite">
                <p>Pieces Taken by Black:</p>
                {WTaken.length > 0 ? (
                    WTaken.map((piece, index) => {
                        const IconComponent = map[piece || "X"];
                        return IconComponent ? <IconComponent key={`${piece}-${index}`} className="icon-size" /> : null;
                    })
                ) : (
                    <p>No pieces taken</p>
                )}
            </div>
        </div>
    );
};

export default TakenPieces;
