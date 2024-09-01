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

// Props for TakenPieces component
interface TakenPiecesProps {
  positions: (string | null)[];
  isPromotion: boolean;
  promotingPawnType: string | null;
}

// Helper function to find taken pieces
const findTaken = (
  positions: (string | null)[],
  setTaken: React.Dispatch<React.SetStateAction<string[]>>,
  isPromotion: boolean,
  promotingPawnType: string | null
) => {
  const pieceMap: Record<string, string> = {
    WP1: "WPawn", WP2: "WPawn", WP3: "WPawn", WP4: "WPawn", WP5: "WPawn", WP6: "WPawn", WP7: "WPawn", WP8: "WPawn",
    BP1: "BPawn", BP2: "BPawn", BP3: "BPawn", BP4: "BPawn", BP5: "BPawn", BP6: "BPawn", BP7: "BPawn", BP8: "BPawn",
    WB1: "WBishop", WB2: "WBishop",
    BB1: "BBishop", BB2: "BBishop",
    WR1: "WRook", WR2: "WRook",
    BR1: "BRook", BR2: "BRook",
    WN1: "WKnight", WN2: "WKnight",
    BN1: "BKnight", BN2: "BKnight",
    WQ: "WQueen", BQ: "BQueen",
    WK: "WKing", BK: "BKing",
  };

  const initialPieceCount: Record<string, number> = {
    WPawn: 8, BPawn: 8,    
    WBishop: 2, BBishop: 2, 
    WRook: 2, BRook: 2,     
    WKnight: 2, BKnight: 2, 
    WQueen: 1, BQueen: 1,   
    WKing: 1, BKing: 1,     
  };

  const currentPieceCount = { ...initialPieceCount };

  positions.forEach((piece, index) => {
    if (piece) {
      const pieceType = pieceMap[piece]; 
      
      // Exclude the promoting pawn from being counted if promotion is ongoing
      if (isPromotion && piece === promotingPawnType) {
        console.log(`Ignoring promoting pawn of type ${piece} at position ${index}`);
        return; // Do not count the promoting pawn
      }

      // Exclude promoted pieces from being counted as taken
      if (!pieceType && /^[WB][QRBN]\d*$/.test(piece)) {
        console.log(`Promoted piece detected: ${piece}, excluding from taken count.`);
        return; // Do not count the promoted piece
      }

      if (pieceType && currentPieceCount[pieceType] !== undefined) {
        currentPieceCount[pieceType] -= 1;
      }
    }
  });

  const takenPieces = Object.entries(currentPieceCount)
    .filter(([piece, count]) => count > 0)
    .flatMap(([piece, count]) => Array(count).fill(piece));

  setTaken(takenPieces);
};


// Component to display taken pieces
const TakenPieces: React.FC<TakenPiecesProps> = ({ positions, isPromotion, promotingPawnType }) => {
  const [taken, setTaken] = useState<string[]>([]);

  useEffect(() => {
    console.log("Current Positions:", positions); // Log the positions passed to the component
    findTaken(positions, setTaken, isPromotion, promotingPawnType); // Pass the correct number of arguments
  }, [positions, isPromotion, promotingPawnType]); // Add `promotingPawnType` to the dependency array

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
