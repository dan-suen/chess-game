import "./App.css";
import { useState, useEffect, useCallback } from "react";
import Toggle from "react-toggle";
import createBoard from "./hooks/createBoard";
import updateSentence from "./hooks/updateSentence";
import addPieces from "./hooks/addPieces";
import { isCheck } from "./hooks/gamelogic";
import TakenPieces from "./components/takenPieces";
import getHighlightIndices from "./hooks/getHighlightIndices";
import PromotionModal from "./components/PromotionModal";

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
  
  // Utility function for calculating indices
  const posToIndex = (row: number, col: number): number => row * 8 + col;
  const handleNewGame = () => {
    // Reset all state variables
    setPositions([...initialPositions]); // Reset positions
    setTurn(flip ? "black" : "white"); // Reset turn based on flip state
    setTaken(Array(64).fill(null)); // Clear taken pieces
    setActiveId(null); // Clear active square
    setActivePieceType(null); // Clear active piece type
    setHighlightedSquares(new Set()); // Clear highlighted squares
    setCheck(false); // Reset check state
    setLastMove(null); // Reset last move
    
    // Recreate the board and pieces after resetting the state
    setTimeout(() => {
      createBoard(flip, initialPositions, setPositions); // Use initial positions to recreate the board
      addPieces(
        flip ? "black" : "white", // Ensure correct initial turn
        setTurn,
        initialPositions,
        setPositions,
        null, // No active ID initially
        setActiveId,
        new Set(), // No highlighted squares initially
        setHighlightedSquares,
        null, // No active piece type initially
        setActivePieceType,
        clickFunction, // Add clickFunction
        clickFunctionEmpty, // Add clickFunctionEmpty
        null // No last move initially
      );
    }, 0); // Use a timeout to ensure state updates apply before recreating the board
  };

  const handlePromotionChoice = (choice: string) => {
    if (promotionSquare !== null && activePieceType) {
      // Determine the base name for the new piece
      const basePieceName = activePieceType.startsWith("W") ? `W${choice}` : `B${choice}`;
  
      // Determine a unique identifier for the promoted piece
      let suffix = 1;
      while (positions.includes(`${basePieceName}${suffix}`)) {
        suffix++; // Increment suffix until an unused identifier is found
      }
  
      const newPieceType = `${basePieceName}${suffix}`; // Create the unique piece name
  
      console.log("Promoting pawn to:", newPieceType); // Log the new piece name
  
      const newPositions = [...positions];
      newPositions[promotionSquare!] = newPieceType; // Replace pawn with the selected piece at the promotion square
  
      console.log("Before promotion, positions:", positions);
      setPositions(newPositions);
      console.log("After promotion, positions:", newPositions);
  
      setShowPromotionModal(false); // Hide the modal
      setTurn(turn === "white" ? "black" : "white"); // Switch the turn
      setPromotionSquare(null); // Clear the promotion square
  
      // Clear active states to avoid lingering effects
      setActiveId(null);
      setActivePieceType(null);
      setHighlightedSquares(new Set<number>());
    }
  };
  const triggerPromotion = (clickedId: number, activePieceType: string) => {
    //console.log("Triggering promotion at square:", clickedId);
    setPromotionSquare(clickedId); // Track where the promotion happens
    setActivePieceType(activePieceType); // Keep track of the piece being promoted
    setShowPromotionModal(true); // Show the promotion modal
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
      //console.log("Clicked square ID:", clickedId);
  
      if (activeId) {
        const previousIdMatch = activeId.match(/[0-9]+/);
        if (!previousIdMatch) {
          console.error("Failed to extract previous ID from active ID");
          return;
        }
  
        const previousId = parseInt(previousIdMatch[0], 10);
        const currentSymbol = positions[previousId];
  
        // Only move if the clicked square is a valid highlighted square
        if (highlightedSquares.has(clickedId)) {
          const [prevRow, prevCol] = [Math.floor(previousId / 8), previousId % 8];
          const [clickedRow, clickedCol] = [Math.floor(clickedId / 8), clickedId % 8];
          
              // Check for pawn promotion
          if (activePieceType && /^(WP|BP)/.test(activePieceType) && (clickedRow === 0 || clickedRow === 7)) {
            // Promotion detected
            //console.log("Promotion detected at square:", clickedId);
          
            const newPositions = [...positions];
            newPositions[previousId] = null; // Clear the original pawn position
            setPositions(newPositions); // Update state to reflect removal
          
            // Trigger promotion modal
            triggerPromotion(clickedId, activePieceType); // Pass necessary arguments
            return; // Exit to prevent further processing
          }
          if (
            activePieceType?.includes("Pawn") &&
            Math.abs(clickedCol - prevCol) === 1 && // Diagonal move
            Math.abs(clickedRow - prevRow) === 1 && // Moving one rank forward
            !positions[clickedId] && // Destination square is empty
            lastMove && // Ensure lastMove is available
            lastMove.piece.includes("Pawn") && // Last move was a pawn move
            Math.abs(lastMove.from - lastMove.to) === 16 && // The pawn moved 2 squares forward last turn
            lastMove.to === posToIndex(prevRow, clickedCol) // The pawn to capture is on the correct square
          ) {
            // En passant capture
            const enPassantCapturedPawnIndex = posToIndex(prevRow, clickedCol);
            const newPositions = [...positions];
            newPositions[enPassantCapturedPawnIndex] = null; // Remove captured pawn
            newPositions[previousId] = null; // Clear original position
            newPositions[clickedId] = activePieceType; // Move to new position
            setPositions(newPositions);
          } else {
            // Normal move
            const newPositions = [...positions];
            newPositions[previousId] = null; // Clear original position
            newPositions[clickedId] = activePieceType; // Move to new position
            setPositions(newPositions);
          }
        
          // Update state
          setActiveId(null);
          setActivePieceType(null);
          setHighlightedSquares(new Set());
          setTurn(turn === "white" ? "black" : "white");
          setLastMove({ from: previousId, to: clickedId, piece: activePieceType! });
        } else if (
          positions[clickedId] &&
          ((turn === "white" && positions[clickedId]!.startsWith("W")) ||
            (turn === "black" && positions[clickedId]!.startsWith("B")))
        ) {
          // Transfer active status if a new piece of the same color is clicked
          //console.log("Transferring active piece status to:", positions[clickedId]);
          setActiveId(grandParentElement.id);
          setActivePieceType(positions[clickedId]);
          const newHighlightedSquares = getHighlightIndices(
            grandParentElement.id,
            positions,
            positions[clickedId],
            lastMove
          );
          setHighlightedSquares(new Set(newHighlightedSquares));
          //console.log("New highlighted squares:", Array.from(newHighlightedSquares));
        } else {
          // Deselect only if clicking on a non-highlighted square
          //console.log("Deselecting piece.");
          setActiveId(null);
          setActivePieceType(null);
          setHighlightedSquares(new Set());
        }
      } else {
        // Select a piece if clicked on a user's piece
        const targetPiece = positions[clickedId];
        if (
          targetPiece &&
          ((turn === "white" && targetPiece.startsWith("W")) || (turn === "black" && targetPiece.startsWith("B")))
        ) {
          //console.log("Selecting new piece:", targetPiece, "at ID:", clickedId);
          setActiveId(grandParentElement.id);
          setActivePieceType(targetPiece);
          const newHighlightedSquares = getHighlightIndices(grandParentElement.id, positions, targetPiece, lastMove);
          setHighlightedSquares(new Set(newHighlightedSquares));
          //console.log("New highlighted squares:", Array.from(newHighlightedSquares));
        } else {
          //console.log("Cannot select this square.");
        }
      }
    },
    [turn, activeId, positions, highlightedSquares, activePieceType, lastMove] // Add lastMove as a dependency
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

      // console.log("Current ID:", currentId);
      // console.log("Active ID:", activeId);
      // console.log("Highlighted squares:", Array.from(highlightedSquares));
      // console.log("Current turn:", turn);

      if (activeId && activePieceType) {
        if (highlightedSquares.has(currentId)) {
          // Move the piece
          //console.log("Moving active piece to empty highlighted square:", currentId);
          const previousId = parseInt(activeId.match(/[0-9]+/)![0], 10);
          const newPositions = [...positions];
          newPositions[previousId] = null; // Clear the original square
          newPositions[currentId] = activePieceType; // Move piece to new square
          setPositions(newPositions); // Update positions state
          setActiveId(null); // Clear the active ID
          setActivePieceType(null); // Clear active piece type
          setHighlightedSquares(new Set()); // Clear highlighted squares
          setTurn(turn === "white" ? "black" : "white"); // Switch turn
          setLastMove({ from: previousId, to: currentId, piece: activePieceType }); // Update last move
        } else {
          //console.log("Clicking on a non-highlighted square does nothing.");
        }
      } else {
        const targetPiece = positions[currentId];
        if (
          targetPiece &&
          ((turn === "white" && targetPiece.startsWith("W")) || (turn === "black" && targetPiece.startsWith("B")))
        ) {
         // console.log("Selecting new piece:", targetPiece, "at ID:", currentId);
          setActiveId(parentElement.id);
          setActivePieceType(targetPiece);
          const newHighlightedSquares = getHighlightIndices(parentElement.id, positions, targetPiece, lastMove); // Pass lastMove
          setHighlightedSquares(new Set(newHighlightedSquares));
          //console.log("New Highlighted Squares:", Array.from(newHighlightedSquares));
        } else {
          //console.log("Cannot select this square: Empty or not your turn.");
          setActiveId(null); // Deselect if clicking on an invalid square
          setActivePieceType(null);
          setHighlightedSquares(new Set());
        }
      }
    },
    [turn, activeId, positions, highlightedSquares, activePieceType, lastMove] // Add lastMove as dependency
  );

  // Initialize the board when the component mounts
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
        clickFunction, // Add clickFunction
        clickFunctionEmpty, // Add clickFunctionEmpty
        lastMove
    );
  }, []); // Empty dependency array means this runs only once when the component mounts

  // Re-render pieces and update the board when positions or activeId change
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
        clickFunction, // Add clickFunction
        clickFunctionEmpty, // Add clickFunctionEmpty
        lastMove
    );
  }, [positions, activeId, turn]); // Added 'turn' to dependencies

  // Handle changes when the board is flipped
  useEffect(() => {
    setTurn(flip ? "black" : "white");
    createBoard(flip, positions, setPositions);
    setTaken(Array(64).fill(null)); // Reset taken pieces when flip changes
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
        clickFunction, // Add clickFunction
        clickFunctionEmpty, // Add clickFunctionEmpty
        lastMove
    );
  }, [flip]);

  // Update game state when the turn changes
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
      clickFunction, // Add clickFunction
      clickFunctionEmpty, // Add clickFunctionEmpty
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
          handleNewGame()
        }}
      />
      <label htmlFor="flip">Play as Black</label>
      <p id="turnDisplay"></p>
      <p id="isCheck">{check ? "Check" : ""}</p>
      <button onClick={handleNewGame}>New Game</button>
      {showPromotionModal && (
      <PromotionModal onPromote={handlePromotionChoice} />
    )}
      <TakenPieces positions={positions} />

      <table id="chessboard">
        {/* Render chessboard here */}
      </table>
    </div>
  );
}

export default App;
