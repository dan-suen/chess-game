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
  BBishop: BBishopIcon,
  WBishop: WBishopIcon,
  BKnight: BKnightIcon,
  WKnight: WKnightIcon,
  BKing: BKingIcon,
  WKing: WKingIcon,
  WQueen: WQueenIcon,
  BQueen: BQueenIcon,
  BRook: BRookIcon,
  WRook: WRookIcon,
  WPawn: WPawnIcon,
  BPawn: BPawnIcon,
  X: X,
};

// Find taken pieces based on current positions
const findTaken = (
    positions: (string | null)[],
    setTaken: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    // Mapping from board abbreviations to full piece names
    const pieceMap: Record<string, string> = {
      WP1: 'WPawn', WP2: 'WPawn', WP3: 'WPawn', WP4: 'WPawn', WP5: 'WPawn', WP6: 'WPawn', WP7: 'WPawn', WP8: 'WPawn',
      BP1: 'BPawn', BP2: 'BPawn', BP3: 'BPawn', BP4: 'BPawn', BP5: 'BPawn', BP6: 'BPawn', BP7: 'BPawn', BP8: 'BPawn',
      WB1: 'WBishop', WB2: 'WBishop',
      BB1: 'BBishop', BB2: 'BBishop',
      WR1: 'WRook', WR2: 'WRook',
      BR1: 'BRook', BR2: 'BRook',
      WN1: 'WKnight', WN2: 'WKnight',
      BN1: 'BKnight', BN2: 'BKnight',
      WQ: 'WQueen', BQ: 'BQueen',
      WK: 'WKing', BK: 'BKing'
    };
  
    // Initial counts for all pieces on both sides
    const initialPieceCount: Record<string, number> = {
      WPawn: 8, BPawn: 8,    // Pawns
      WBishop: 2, BBishop: 2, // Bishops
      WRook: 2, BRook: 2,     // Rooks
      WKnight: 2, BKnight: 2, // Knights
      WQueen: 1, BQueen: 1,   // Queens
      WKing: 1, BKing: 1      // Kings
    };
  
    // Copy the counts to track pieces on the board
    const currentPieceCount = { ...initialPieceCount };
  
    console.log("Initial Piece Count:", initialPieceCount); // Log the initial counts
  
    // Iterate through all positions on the board
    positions.forEach((piece) => {
      if (piece) {
        const pieceType = pieceMap[piece]; // Map the abbreviation to the full name
  
        if (pieceType && currentPieceCount[pieceType] !== undefined) {
          // Decrease count for each original piece found
          currentPieceCount[pieceType] -= 1;
        } else if (!pieceType && /^[WB][QRBN]/.test(piece)) {
          // Detected a promoted piece; ignore it in the count
          console.log(`Promoted piece detected: ${piece}, excluding from taken count.`);
        }
      }
    });
  
    console.log("Current Piece Count after board iteration:", currentPieceCount); // Log the counts after checking the board
  
    // Filter out pieces that have a positive count (meaning they are missing from the board)
    const takenPieces = Object.entries(currentPieceCount)
      .filter(([piece, count]) => count > 0)
      .flatMap(([piece, count]) => Array(count).fill(piece));
  
    console.log("Computed Taken Pieces:", takenPieces); // Log the final list of taken pieces
  
    setTaken(takenPieces);
  };
  
// Component to display taken pieces
const TakenPieces: React.FC<{ positions: (string | null)[] }> = ({ positions }) => {
  const [taken, setTaken] = useState<string[]>([]);

  useEffect(() => {
    console.log("Current Positions:", positions); // Log the positions passed to the component
    findTaken(positions, setTaken);
  }, [positions]);

  const BTaken = taken.filter((piece) => piece.startsWith("B"));
  const WTaken = taken.filter((piece) => piece.startsWith("W"));

  return (
    <div id="taken">
      <div id="takenBlack">
        <p>Pieces Taken by White:</p>
        {BTaken.length > 0 ? (
          BTaken.map((piece, index) => {
            const IconComponent = map[piece || "X"];
            return IconComponent ? (
              <IconComponent key={`${piece}-${index}`} className="icon-size" />
            ) : null;
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
            return IconComponent ? (
              <IconComponent key={`${piece}-${index}`} className="icon-size" />
            ) : null;
          })
        ) : (
          <p>No pieces taken</p>
        )}
      </div>
    </div>
  );
};

export default TakenPieces;
