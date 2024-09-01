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
  refs: {
    WP1Ref: React.MutableRefObject<boolean>;
    WP2Ref: React.MutableRefObject<boolean>;
    WP3Ref: React.MutableRefObject<boolean>;
    WP4Ref: React.MutableRefObject<boolean>;
    WP5Ref: React.MutableRefObject<boolean>;
    WP6Ref: React.MutableRefObject<boolean>;
    WP7Ref: React.MutableRefObject<boolean>;
    WP8Ref: React.MutableRefObject<boolean>;
    BP1Ref: React.MutableRefObject<boolean>;
    BP2Ref: React.MutableRefObject<boolean>;
    BP3Ref: React.MutableRefObject<boolean>;
    BP4Ref: React.MutableRefObject<boolean>;
    BP5Ref: React.MutableRefObject<boolean>;
    BP6Ref: React.MutableRefObject<boolean>;
    BP7Ref: React.MutableRefObject<boolean>;
    BP8Ref: React.MutableRefObject<boolean>;
  }
}

// Helper function to find taken pieces
const findTaken = (
  positions: (string | null)[],
  setTaken: React.Dispatch<React.SetStateAction<string[]>>,
  isPromotion: boolean,
  promotingPawnType: string | null,
  refs: Record<string, React.MutableRefObject<boolean>>
) => {
  if (isPromotion) {
    console.log("Promotion in progress, skipping taken pieces calculation.");
    return;
  }

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

  // Initialize the count of pieces currently on the board
  const currentPieceCount: Record<string, number> = {  WPawn: 0, BPawn: 0,
    WBishop: 0, BBishop: 0,
    WRook: 0, BRook: 0,
    WKnight: 0, BKnight: 0,
    WQueen: 0, BQueen: 0,
    WKing: 0, BKing: 0 };

  // Traverse through the board positions to determine which pieces are still present
  positions.forEach((piece) => {
    if (piece) {
      const pieceType = pieceMap[piece];

      // Dynamically check if the ref for this piece indicates a promotion
      if (piece.startsWith('W') || piece.startsWith('B')) {
        const ref = refs[`${piece}Ref`];
        if (ref && ref.current) {
          console.log(`Promoted piece detected: ${piece}, excluding from taken count.`);
          return; // Exclude promoted pawns
        }
      }

      // If the piece is found on the board, decrease the count
      if (pieceType && currentPieceCount[pieceType] !== undefined) {
        currentPieceCount[pieceType]++;
      }
    }
  });

  const takenPieces: string[] = [];

  // Calculate the number of taken pieces correctly
  Object.entries(initialPieceCount).forEach(([pieceType, initialCount]) => {
    let remainingCount = currentPieceCount[pieceType];

    // Hardcoded adjustment to account for promoted pawns
    if (pieceType === 'WPawn') {
      remainingCount += (refs.WP1Ref.current ? 1 : 0) + (refs.WP2Ref.current ? 1 : 0) + (refs.WP3Ref.current ? 1 : 0) +
                        (refs.WP4Ref.current ? 1 : 0) + (refs.WP5Ref.current ? 1 : 0) + (refs.WP6Ref.current ? 1 : 0) +
                        (refs.WP7Ref.current ? 1 : 0) + (refs.WP8Ref.current ? 1 : 0);
    } else if (pieceType === 'BPawn') {
      remainingCount += (refs.BP1Ref.current ? 1 : 0) + (refs.BP2Ref.current ? 1 : 0) + (refs.BP3Ref.current ? 1 : 0) +
                        (refs.BP4Ref.current ? 1 : 0) + (refs.BP5Ref.current ? 1 : 0) + (refs.BP6Ref.current ? 1 : 0) +
                        (refs.BP7Ref.current ? 1 : 0) + (refs.BP8Ref.current ? 1 : 0);
    }

    const takenCount = initialCount - remainingCount; 
    if (takenCount > 0) {
      takenPieces.push(...Array(takenCount).fill(pieceType));
    }
  });

  console.log("Final taken pieces:", takenPieces); // Log the taken pieces
  setTaken(takenPieces);
};


const TakenPieces: React.FC<TakenPiecesProps> = ({ positions, isPromotion, promotingPawnType, refs }) => {
  const [taken, setTaken] = useState<string[]>([]);

  useEffect(() => {
    //console.log("Current Positions:", positions); // Log the positions passed to the component
    findTaken(positions, setTaken, isPromotion, promotingPawnType, refs); // Pass the refs to findTaken
  }, [positions, isPromotion, promotingPawnType, refs]); // Add `refs` to the dependency array

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


export {findTaken, TakenPieces};
