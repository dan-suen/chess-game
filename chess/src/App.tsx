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
    console.log("handlePromotionSelect triggered with choice:", choice);
  
    if (promotionSquare !== null && activePieceType) {
      const basePieceName = activePieceType.startsWith("W") ? `W${choice}` : `B${choice}`;
    
      // Log the current positions before updating
      console.log("Current positions before promotion:", positions);
      console.log("Promotion at square:", promotionSquare, "with new piece:", basePieceName);
  
      // Update the positions array to replace the pawn with the promoted piece
      const newPositions = [...positions];
      newPositions[promotionSquare] = basePieceName; // Replace the pawn with the promoted piece
    
      setPositions(newPositions); // Immediately update the state to apply the promotion
  
      // Log the updated positions after promotion
      console.log("Updated positions array after promotion:", newPositions);
    
      // Reset promotion-related state after a slight delay to avoid premature reset
      setTimeout(() => {
        setShowPromotionModal(false);
        setTurn(turn === "white" ? "black" : "white");
        setPromotionSquare(null); // Now reset `promotionSquare` after the promotion is done
        setActiveId(null);
        setActivePieceType(null);
        setHighlightedSquares(new Set());
        setIsPromotion(false);
        setPromotingPawnType(null);
      }, 100); // Slight delay ensures state updates apply correctly
    } else {
      console.log("Promotion failed: promotionSquare or activePieceType is null.");
    }
  };
  
  
  const triggerPromotion = (clickedId: number, activePieceType: string) => {
    console.log("Triggering promotion for:", clickedId, activePieceType);
  
    setPromotionSquare(clickedId); // Set the square where promotion occurs
    setActivePieceType(activePieceType); // Set the type of the active piece (pawn)
    setShowPromotionModal(true); // Show the promotion modal
    setIsPromotion(true); // Indicate that a promotion is in progress
    setPromotingPawnType(activePieceType); // Store the type of the pawn being promoted
    setPromotionColor(activePieceType.startsWith('W') ? 'white' : 'black'); // Set the color of the promoting piece
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
  
    const normalizedPieceType = pieceType.replace(/\d+$/, ''); // Remove digits from piece type
    const fromRow = Math.floor(from / 8);
    const fromCol = from % 8;
    const toRow = Math.floor(to / 8);
    const toCol = to % 8;
  
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
  
    const targetPiece = positions[to];
  
    console.log(`Validating move for ${normalizedPieceType} from ${from} to ${to}`);
    console.log(`Target piece: ${targetPiece}, Row difference: ${rowDiff}, Column difference: ${colDiff}`);
  
    // Check if the move is trying to capture a piece of the same color
    if (targetPiece && targetPiece[0] === pieceType[0]) {
      console.log("Invalid move: cannot capture a piece of the same color.");
      return false;
    }
  
    // Piece-specific move logic
    switch (normalizedPieceType) {
      case 'WP': // White Pawn
        if (toRow === fromRow - 1 && colDiff === 0 && !targetPiece) return true; // Normal forward move
        if (fromRow === 6 && toRow === 4 && colDiff === 0 && !targetPiece && !positions[to + 8]) return true; // Double move
        if (toRow === fromRow - 1 && colDiff === 1 && targetPiece?.startsWith('B')) return true; // Diagonal capture
  
        // En passant capture for white pawn
        if (fromRow === 3 && toRow === 2 && colDiff === 1 && !targetPiece) {
          if (
            lastMove &&
            lastMove.piece.startsWith('BP') &&
            lastMove.from === to + 8 &&
            lastMove.to === from + 1
          ) {
            console.log("Valid en passant capture for white pawn");
            return true;
          }
        }
        return false;
  
      case 'BP': // Black Pawn
        if (toRow === fromRow + 1 && colDiff === 0 && !targetPiece) return true; // Normal forward move
        if (fromRow === 1 && toRow === 3 && colDiff === 0 && !targetPiece && !positions[to - 8]) return true; // Double move
        if (toRow === fromRow + 1 && colDiff === 1 && targetPiece?.startsWith('W')) return true; // Diagonal capture
  
        // En passant capture for black pawn
        if (fromRow === 4 && toRow === 5 && colDiff === 1 && !targetPiece) {
          if (
            lastMove &&
            lastMove.piece.startsWith('WP') &&
            lastMove.from === to - 8 &&
            lastMove.to === from - 1
          ) {
            console.log("Valid en passant capture for black pawn");
            return true;
          }
        }
        return false;
  
      case 'WR': // White Rook
      case 'BR': // Black Rook
        if (rowDiff === 0 || colDiff === 0) {
          // Ensure the path is clear
          for (let i = Math.min(from, to) + 1; i < Math.max(from, to); i++) {
            if (positions[i] !== null) return false; // Path is not clear
          }
          return true;
        }
        break;
  
      case 'WN': // White Knight
      case 'BN': // Black Knight
        if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
          return true; // Valid knight move
        }
        break;
  
      case 'WB': // White Bishop
      case 'BB': // Black Bishop
        if (rowDiff === colDiff) {
          // Ensure the path is clear
          for (let i = 1; i < rowDiff; i++) {
            const intermediateRow = fromRow < toRow ? fromRow + i : fromRow - i;
            const intermediateCol = fromCol < toCol ? fromCol + i : fromCol - i;
            if (positions[intermediateRow * 8 + intermediateCol] !== null) return false; // Path is not clear
          }
          return true;
        }
        break;
  
      case 'WQ': // White Queen
      case 'BQ': // Black Queen
        if (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) {
          // Ensure the path is clear for diagonal or straight moves
          const stepRow = toRow === fromRow ? 0 : toRow > fromRow ? 1 : -1;
          const stepCol = toCol === fromCol ? 0 : toCol > fromCol ? 1 : -1;
          let currentRow = fromRow + stepRow;
          let currentCol = fromCol + stepCol;
  
          while (currentRow !== toRow || currentCol !== toCol) {
            if (positions[currentRow * 8 + currentCol] !== null) return false; // Path is not clear
            currentRow += stepRow;
            currentCol += stepCol;
          }
          return true;
        }
        break;
  
      case 'WK': // White King
      case 'BK': // Black King
        if (rowDiff <= 1 && colDiff <= 1) {
          return true; // Valid king move
        }
        // Castling logic can be added here
        break;
  
      default:
        console.log("Piece type not recognized.");
        return false;
    }
  
    console.log("Invalid move for the piece type.");
    return false;
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
      event.preventDefault();
      event.stopPropagation();
  
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
      console.log(`Current activeId: ${activeId}`);
      console.log(`Current activePieceType: ${activePieceType}`);
  
      if (
        positions[clickedId] &&
        ((turn === "white" && positions[clickedId]!.startsWith("W")) ||
          (turn === "black" && positions[clickedId]!.startsWith("B")))
      ) {
        // If a new piece is clicked, set it as the active piece and clear the previous one
        console.log(`Selecting new piece at cell-${clickedId}`);
        setActiveId(grandParentElement.id); // Set the new piece's ID as active
        setActivePieceType(positions[clickedId]); // Set the new piece's type as active
  
        const newHighlightedSquares = getHighlightIndices(
          grandParentElement.id,
          positions,
          positions[clickedId],
          lastMove
        );
        setHighlightedSquares(new Set(newHighlightedSquares));
      } else {
        // Attempt to move the currently active piece
        if (activeId !== null) {
          const previousId = parseInt(activeId.match(/[0-9]+/)![0], 10);
          console.log(`Attempting to move ${activePieceType} from ${previousId} to ${clickedId}`);
  
          const fromRow = Math.floor(previousId / 8);
          const toRow = Math.floor(clickedId / 8);
          const fromCol = previousId % 8;
          const toCol = clickedId % 8;
          const colDiff = Math.abs(toCol - fromCol);
          const targetPiece = positions[clickedId];
  
          console.log(`From row: ${fromRow}, To row: ${toRow}, From column: ${fromCol}, To column: ${toCol}`);
          console.log(`Target piece: ${targetPiece}`);
  
          if (
            activePieceType &&
            isValidMove(activePieceType, previousId, clickedId, positions, turn, lastMove)
          ) {
            console.log("Valid move detected");
          
            const newPositions = [...positions];
            newPositions[previousId] = null; // Clear the pawn from its previous position
          
            // Correct the promotion logic to handle named pawns
            if (
              (activePieceType.startsWith("WP") && toRow === 0) || 
              (activePieceType.startsWith("BP") && toRow === 7)
            ) {
              triggerPromotion(clickedId, activePieceType); // Trigger promotion
              return; // Exit early to avoid clearing state
            }
          
            newPositions[clickedId] = activePieceType; // Move the piece to the new position
            setPositions(newPositions);
          
            // Clear the state and set the next turn
            forceClearState(setActiveId, setActivePieceType, setHighlightedSquares, setPositions);
            setTurn(turn === "white" ? "black" : "white");
            setLastMove({ from: previousId, to: clickedId, piece: activePieceType! });
          } else {
            console.log("Invalid move detected: clearing state.");
            forceClearState(setActiveId, setActivePieceType, setHighlightedSquares, setPositions);
          }
        } else {
          console.log("Invalid selection or move: clearing state.");
          forceClearState(setActiveId, setActivePieceType, setHighlightedSquares, setPositions);
        }
      }
    },
    [turn, activeId, positions, highlightedSquares, activePieceType, lastMove]
  );
  
  
  // Helper function to force clear state
  const forceClearState = (
    setActiveId: React.Dispatch<React.SetStateAction<string | null>>,
    setActivePieceType: React.Dispatch<React.SetStateAction<string | null>>,
    setHighlightedSquares: React.Dispatch<React.SetStateAction<Set<number>>>,
    setPositions: React.Dispatch<React.SetStateAction<(string | null)[]>>
  ) => {
    console.log("Forcing state clear...");
  
    setActiveId((prev) => null); // Use functional updates
    setActivePieceType((prev) => null);
    setHighlightedSquares((prev) => new Set());
    setPositions((prev) => [...prev]); // Force React to re-render with a new reference
  };
  
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
  
      if (highlightedSquares.has(currentId) && activeId && activePieceType) {
        const previousId = parseInt(activeId.match(/[0-9]+/)![0], 10);
        const newPositions = [...positions];
        newPositions[previousId] = null;
        newPositions[currentId] = activePieceType;
        setPositions(newPositions);
        console.log("Valid move executed from", previousId, "to", currentId);
  
        // Handle any special cases, such as en passant or promotion
        let shouldResetState = true; // Flag to control state reset
  
        const fromRow = Math.floor(previousId / 8);
        const toRow = Math.floor(currentId / 8);
        const colDiff = Math.abs((previousId % 8) - (currentId % 8));
        const targetPiece = positions[currentId];
  
        // Check for special moves
        if (activePieceType.startsWith('W') && fromRow === 3 && toRow === 2 && colDiff === 1 && !targetPiece) {
          console.log("En passant capture by white pawn");
          newPositions[currentId + 8] = null; // Remove the black pawn captured en passant
          shouldResetState = false; // Prevent immediate reset to handle en passant
        } else if (activePieceType.startsWith('B') && fromRow === 4 && toRow === 5 && colDiff === 1 && !targetPiece) {
          console.log("En passant capture by black pawn");
          newPositions[currentId - 8] = null; // Remove the white pawn captured en passant
          shouldResetState = false; // Prevent immediate reset to handle en passant
        }
  
        // Check for promotion and handle it
        if (activePieceType && /^(WP|BP)/.test(activePieceType) && (toRow === 0 || toRow === 7)) {
          console.log("Pawn promotion detected");
          newPositions[previousId] = null;
          setPositions(newPositions);
          triggerPromotion(currentId, activePieceType);
          shouldResetState = false; // Prevent immediate reset to handle promotion
        }
  
        // Handle captures
        if (positions[currentId] !== null) {
          if (
            (turn === "white" && positions[currentId]?.startsWith("B")) ||
            (turn === "black" && positions[currentId]?.startsWith("W"))
          ) {
            console.log("Normal capture detected");
            setTaken((prev) => {
              const newTaken = [...prev];
              const capturedPiece = positions[currentId];
              const index = newTaken.findIndex((item) => item === null);
              if (index !== -1) newTaken[index] = capturedPiece;
              return newTaken;
            });
          }
        }
  
        // Prepare for the next state updates
        setLastMove({ from: previousId, to: currentId, piece: activePieceType });
        setTurn(turn === "white" ? "black" : "white");
  
        // Reset state only if necessary
        if (shouldResetState) {
          setTimeout(() => {
            console.log("Resetting state after move");
            setActiveId(null);
            setActivePieceType(null);
            setHighlightedSquares(new Set());
          }, 50); // Slight delay to ensure all updates are properly processed
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
          console.log("this also happened")
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
  
    if (!isPromotion) {
      setActiveId(null);
      setActivePieceType(null);
    }
  
    console.log("State management check for promotion.");
  }, [turn, isPromotion]); // Add `isPromotion` to dependencies
  
  
  
  
  useEffect(() => {
    console.log("Promotion square set to:", promotionSquare);
    console.log("Active piece type set to:", activePieceType);
  }, [promotionSquare, activePieceType]);

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
