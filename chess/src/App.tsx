import "./App.css";
import { useState, useEffect, useCallback } from "react";
import Toggle from "react-toggle";
import createBoard from "./hooks/createBoard";
import updateSentence from "./hooks/updateSentence";
import addPieces from "./hooks/addPieces";
import { isCheck } from "./hooks/gamelogic";
import TakenPieces from "./components/takenPieces";
import getHighlightIndices from "./hooks/getHighlightIndices";
import PromotionSelector from "./components/PromotionSelector";

// Initial positions of pieces on the chessboard
const initialPositions: (string | null)[] = [
  'WRook', 'WKnight', 'WBishop', 'WQueen', 'WKing', 'WBishop', 'WKnight', 'WRook',
  'WPawn', 'WPawn', 'WPawn', 'WPawn', 'WPawn', 'WPawn', 'WPawn', 'WPawn',
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  'BPawn', 'BPawn', 'BPawn', 'BPawn', 'BPawn', 'BPawn', 'BPawn', 'BPawn',
  'BRook', 'BKnight', 'BBishop', 'BQueen', 'BKing', 'BBishop', 'BKnight', 'BRook'
];

function App() {
  const [positions, setPositions] = useState<(string | null)[]>(initialPositions);
  const [flip, setFlip] = useState<boolean>(false);
  const [turn, setTurn] = useState<"black" | "white">("white");
  const [taken, setTaken] = useState<(string | null)[]>(Array(64).fill(null));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [check, setCheck] = useState<boolean>(false);
  const [highlightedSquares, setHighlightedSquares] = useState<Set<number>>(new Set());
  const [activePieceType, setActivePieceType] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: number; to: number; piece: string } | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [promotionSquare, setPromotionSquare] = useState<number | null>(null);
  const [isPromotion, setIsPromotion] = useState<boolean>(false);
  const [promotingPawnType, setPromotingPawnType] = useState<string | null>(null);
  const [promotionColor, setPromotionColor] = useState<'white' | 'black'>('white');
  
  // Utility function for calculating indices
  const posToIndex = (row: number, col: number): number => row * 8 + col;

  const handleNewGame = () => {
    setPositions([...initialPositions]);
    setTurn(flip ? "black" : "white");
    setTaken(Array(64).fill(null));
    setActiveId(null);
    setActivePieceType(null);
    setHighlightedSquares(new Set());
    setCheck(false);
    setLastMove(null);

    setTimeout(() => {
      createBoard(flip, initialPositions, setPositions);
      addPieces(
        flip ? "black" : "white",
        setTurn,
        initialPositions,
        setPositions,
        null,
        setActiveId,
        new Set(),
        setHighlightedSquares,
        null,
        setActivePieceType,
        clickFunction,
        clickFunctionEmpty,
        null
      );
    }, 0);
  };

  const handlePromotionSelect = (choice: string) => {
    if (promotionSquare !== null && activePieceType) {
      // Determine the new piece type using abbreviations (Q, R, B, N)
      const basePieceName = activePieceType.startsWith("W") ? `W${choice}` : `B${choice}`;
  
      // Ensure a unique name for the promoted piece by appending a suffix if necessary
      let suffix = 1;
      while (positions.includes(`${basePieceName}${suffix}`)) {
        suffix++;
      }
      const newPieceType = `${basePieceName}${suffix}`;
  
      // Update the positions array
      const newPositions = [...positions];
      newPositions[promotionSquare] = newPieceType; // Replace pawn with the promoted piece
      setPositions(newPositions); // Update the state
  
      // Debugging output
      console.log("Selected piece for promotion:", choice);
      console.log("Promoted piece type:", newPieceType);
      console.log("Updated positions array:", newPositions);
  
      // Reset promotion state
      setShowPromotionModal(false);
      setTurn(turn === "white" ? "black" : "white");
      setPromotionSquare(null);
      setActiveId(null);
      setActivePieceType(null);
      setHighlightedSquares(new Set<number>());
      setIsPromotion(false);
      setPromotingPawnType(null);
    }
  };
  
  
  const triggerPromotion = (clickedId: number, activePieceType: string) => {
    setPromotionSquare(clickedId);
    setActivePieceType(activePieceType);
    setShowPromotionModal(true);
    setIsPromotion(true);
    setPromotingPawnType(activePieceType);
    setPromotionColor(activePieceType.startsWith('W') ? 'white' : 'black');
  };
  const isValidMove = (
    pieceType: string | null,
    from: number,
    to: number,
    positions: (string | null)[],
    turn: "black" | "white",
    lastMove: { from: number; to: number; piece: string } | null
  ): boolean => {
    if (!pieceType) return false;
  
    // Normalize the piece type by removing any trailing digits
    const normalizedPieceType = pieceType.replace(/\d+$/, '');
  
    const fromRow = Math.floor(from / 8);
    const fromCol = from % 8;
    const toRow = Math.floor(to / 8);
    const toCol = to % 8;
  
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
  
    const targetPiece = positions[to];
  
    console.log(`Validating move for ${normalizedPieceType} from ${from} to ${to}`);
    console.log(`Target piece: ${targetPiece}, Row difference: ${rowDiff}, Column difference: ${colDiff}`);
  
    switch (normalizedPieceType) {
      case 'WP': // White Pawn
        if (toRow === fromRow - 1 && colDiff === 0 && !targetPiece) return true;
        if (fromRow === 6 && toRow === 4 && colDiff === 0 && !targetPiece && !positions[to + 8]) return true;
        if (toRow === fromRow - 1 && colDiff === 1 && targetPiece?.startsWith('B')) return true;
        if (fromRow === 3 && toRow === 2 && colDiff === 1 && !targetPiece) {
          if (
            lastMove &&
            lastMove.piece === 'BP' &&
            lastMove.from === to + 8 && 
            lastMove.to === from + 1 
          ) {
            return true;
          }
        }
        return false;
  
      case 'BP': // Black Pawn
        if (toRow === fromRow + 1 && colDiff === 0 && !targetPiece) return true;
        if (fromRow === 1 && toRow === 3 && colDiff === 0 && !targetPiece && !positions[to - 8]) return true;
        if (toRow === fromRow + 1 && colDiff === 1 && targetPiece?.startsWith('W')) return true;
        if (fromRow === 4 && toRow === 5 && colDiff === 1 && !targetPiece) {
          if (
            lastMove &&
            lastMove.piece === 'WP' &&
            lastMove.from === to - 8 &&
            lastMove.to === from - 1 
          ) {
            return true;
          }
        }
        return false;
  
      case 'WR':
      case 'BR': 
        if ((fromRow === toRow || fromCol === toCol) && isPathClear(from, to, positions)) {
          return !targetPiece || (turn === "white" ? targetPiece.startsWith('B') : targetPiece.startsWith('W'));
        }
        return false;
  
      case 'WN':
      case 'BN': 
        if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
          return !targetPiece || (turn === "white" ? targetPiece.startsWith('B') : targetPiece.startsWith('W'));
        }
        return false;
  
      case 'WB':
      case 'BB': 
        if (rowDiff === colDiff && isPathClear(from, to, positions)) {
          return !targetPiece || (turn === "white" ? targetPiece.startsWith('B') : targetPiece.startsWith('W'));
        }
        return false;
  
      case 'WQ':
      case 'BQ': 
        if ((rowDiff === colDiff || fromRow === toRow || fromCol === toCol) && isPathClear(from, to, positions)) {
          return !targetPiece || (turn === "white" ? targetPiece.startsWith('B') : targetPiece.startsWith('W'));
        }
        return false;
  
      case 'WK':
      case 'BK': 
        if (rowDiff <= 1 && colDiff <= 1) {
          return !targetPiece || (turn === "white" ? targetPiece.startsWith('B') : targetPiece.startsWith('W'));
        }
        return false;
  
      default:
        console.log("Piece type not recognized.");
        return false;
    }
  };
  
  
  // Helper function to check if the path is clear between two squares
  const isPathClear = (from: number, to: number, positions: (string | null)[]): boolean => {
    const fromRow = Math.floor(from / 8);
    const fromCol = from % 8;
    const toRow = Math.floor(to / 8);
    const toCol = to % 8;
  
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
  
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
  
    while (currentRow !== toRow || currentCol !== toCol) {
      const index = currentRow * 8 + currentCol;
      if (positions[index] !== null) return false; // Path is not clear
      currentRow += rowStep;
      currentCol += colStep;
    }
  
    return true; // Path is clear
  };
  
  const clickFunction = useCallback(
    (
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
      lastMove: { from: number; to: number; piece: string } | null
    ) => {
      const target = event.currentTarget;
      const parentElement = target.parentElement;
      if (!parentElement) {
        console.error("Parent element not found");
        return;
      }
  
      const grandParentElement = parentElement.parentElement;
      if (!grandParentElement || !grandParentElement.id) {
        console.error("Grandparent element or its ID not found");
        return;
      }
  
      const clickedIdMatch = grandParentElement.id.match(/[0-9]+/);
      if (!clickedIdMatch) {
        console.error("Failed to extract clicked ID from grandparent element");
        return;
      }
  
      const clickedId = parseInt(clickedIdMatch[0], 10);
      console.log(`Clicked square ID: ${clickedId}`);
  
      if (activeId) {
        const previousId = parseInt(activeId.match(/[0-9]+/)![0], 10);
        console.log(`Moving ${activePieceType} from ${previousId} to ${clickedId}`);
  
        const fromRow = Math.floor(previousId / 8);
        const toRow = Math.floor(clickedId / 8);
        const fromCol = previousId % 8;
        const toCol = clickedId % 8;
        const colDiff = Math.abs(toCol - fromCol);
        const targetPiece = positions[clickedId];
  
        // Validate the move based on the piece type and rules
        if (activePieceType && isValidMove(activePieceType, previousId, clickedId, positions, turn, lastMove)) {
          console.log("Valid move");
  
          // Handle en passant capture
          if (activePieceType === 'WP' && fromRow === 3 && toRow === 2 && colDiff === 1 && !targetPiece) {
            positions[clickedId + 8] = null; // Capture the black pawn
          } else if (activePieceType === 'BP' && fromRow === 4 && toRow === 5 && colDiff === 1 && !targetPiece) {
            positions[clickedId - 8] = null; // Capture the white pawn
          }
  
          // Handle promotion separately
          if (activePieceType && /^(WP|BP)/.test(activePieceType) && (toRow === 0 || toRow === 7)) {
            const newPositions = [...positions];
            newPositions[previousId] = null;
            setPositions(newPositions);
  
            triggerPromotion(clickedId, activePieceType);
            return;
          }
  
          // Handle capturing logic
          if (positions[clickedId] !== null) {
            if (
              (turn === "white" && positions[clickedId]?.startsWith("B")) ||
              (turn === "black" && positions[clickedId]?.startsWith("W"))
            ) {
              setTaken((prev) => {
                const newTaken = [...prev];
                const capturedPiece = positions[clickedId];
                const index = newTaken.findIndex((item) => item === null);
                if (index !== -1) newTaken[index] = capturedPiece;
                return newTaken;
              });
            }
          }
  
          // Update the board for normal moves or captures
          const newPositions = [...positions];
          newPositions[previousId] = null;
          newPositions[clickedId] = activePieceType;
          setPositions(newPositions);
  
          // Reset states after a valid move or capture
          setActiveId(null);
          setActivePieceType(null);
          setHighlightedSquares(new Set());
          setTurn(turn === "white" ? "black" : "white");
          setLastMove({ from: previousId, to: clickedId, piece: activePieceType! });
        } else {
          // Deselect if the move is invalid
          console.log("Invalid move detected");
          setActiveId(null);
          setActivePieceType(null);
          setHighlightedSquares(new Set());
        }
      } else if (
        positions[clickedId] &&
        ((turn === "white" && positions[clickedId]!.startsWith("W")) ||
          (turn === "black" && positions[clickedId]!.startsWith("B")))
      ) {
        // Select a piece if it's the player's turn
        setActiveId(grandParentElement.id);
        setActivePieceType(positions[clickedId]);
        const newHighlightedSquares = getHighlightIndices(
          grandParentElement.id,
          positions,
          positions[clickedId],
          lastMove
        );
        setHighlightedSquares(new Set(newHighlightedSquares));
      } else {
        // Deselect if clicking on an empty square or invalid move
        setActiveId(null);
        setActivePieceType(null);
        setHighlightedSquares(new Set());
      }
    },
    [turn, activeId, positions, highlightedSquares, activePieceType, lastMove]
  );
  
  
  
  
  const clickFunctionEmpty = useCallback(
    (
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
      lastMove: { from: number; to: number; piece: string } | null
    ) => {
      const parentElement = event.currentTarget.parentElement?.parentElement;

      if (!parentElement || !parentElement.id) {
        console.error("Parent element or its ID not found.");
        return;
      }

      const currentIdMatch = parentElement.id.match(/[0-9]+/);
      if (!currentIdMatch) {
        console.error("Failed to extract current ID from parent element.");
        return;
      }
      const currentId = parseInt(currentIdMatch[0], 10);

      if (activeId && activePieceType) {
        if (highlightedSquares.has(currentId)) {
          const previousId = parseInt(activeId.match(/[0-9]+/)![0], 10);
          const newPositions = [...positions];
          newPositions[previousId] = null;
          newPositions[currentId] = activePieceType;
          setPositions(newPositions);
          setActiveId(null);
          setActivePieceType(null);
          setHighlightedSquares(new Set());
          setTurn(turn === "white" ? "black" : "white");
          setLastMove({ from: previousId, to: currentId, piece: activePieceType });
        }
      } else {
        const targetPiece = positions[currentId];
        if (
          targetPiece &&
          ((turn === "white" && targetPiece.startsWith("W")) || (turn === "black" && targetPiece.startsWith("B")))
        ) {
          setActiveId(parentElement.id);
          setActivePieceType(targetPiece);
          const newHighlightedSquares = getHighlightIndices(parentElement.id, positions, targetPiece, lastMove);
          setHighlightedSquares(new Set(newHighlightedSquares));
        } else {
          setActiveId(null);
          setActivePieceType(null);
          setHighlightedSquares(new Set());
        }
      }
    },
    [turn, activeId, positions, highlightedSquares, activePieceType, lastMove]
  );

  useEffect(() => {
    createBoard(flip, positions, setPositions);
    addPieces(
      turn,
      setTurn,
      positions,
      setPositions,
      activeId,
      setActiveId,
      highlightedSquares,
      setHighlightedSquares,
      activePieceType,
      setActivePieceType,
      clickFunction,
      clickFunctionEmpty,
      lastMove
    );
  }, []);

  useEffect(() => {
    addPieces(
      turn,
      setTurn,
      positions,
      setPositions,
      activeId,
      setActiveId,
      highlightedSquares,
      setHighlightedSquares,
      activePieceType,
      setActivePieceType,
      clickFunction,
      clickFunctionEmpty,
      lastMove
    );
  }, [positions, activeId, turn]);

  useEffect(() => {
    setTurn(flip ? "black" : "white");
    createBoard(flip, positions, setPositions);
    setTaken(Array(64).fill(null));
    addPieces(
      turn,
      setTurn,
      positions,
      setPositions,
      activeId,
      setActiveId,
      highlightedSquares,
      setHighlightedSquares,
      activePieceType,
      setActivePieceType,
      clickFunction,
      clickFunctionEmpty,
      lastMove
    );
  }, [flip]);

  useEffect(() => {
    addPieces(
      turn,
      setTurn,
      positions,
      setPositions,
      activeId,
      setActiveId,
      highlightedSquares,
      setHighlightedSquares,
      activePieceType,
      setActivePieceType,
      clickFunction,
      clickFunctionEmpty,
      lastMove
    );
    updateSentence(turn);
    setCheck(isCheck(positions, turn, lastMove));
    setHighlightedSquares(new Set());
  }, [turn]);

  return (
    <div className="App">
      <Toggle
        id="flip"
        defaultChecked={flip}
        onChange={() => {
          setFlip(!flip);
          handleNewGame();
        }}
      />
      <label htmlFor="flip">Play as Black</label>
      <p id="turnDisplay"></p>
      <p id="isCheck">{check ? "Check" : ""}</p>
      <button onClick={handleNewGame}>New Game</button>
      {isPromotion && (
        <PromotionSelector onSelect={handlePromotionSelect} color={promotionColor} />
      )}
      <TakenPieces 
        positions={positions} 
        isPromotion={isPromotion} 
        promotingPawnType={promotingPawnType}  
      />

      <table id="chessboard">
        {/* Render chessboard here */}
      </table>
    </div>
  );
}

export default App;
