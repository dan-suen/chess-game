import "./App.css";
import { useState, useEffect, useCallback } from "react";
import Toggle from "react-toggle";
import createBoard from "./hooks/createBoard";
import updateSentence from "./hooks/updateSentence";
import addPieces from "./hooks/addPieces";
import { isCheck } from "./hooks/gamelogic";
import TakenPieces from "./components/takenPieces";
import getHighlightIndices from "./hooks/getHighlightIndices"; 

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
        setActivePieceType: React.Dispatch<React.SetStateAction<string | null>>
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
      console.log("Clicked square ID:", clickedId);

      // Handle piece selection and deselection
      if (activeId) {
          const previousIdMatch = activeId.match(/[0-9]+/);
          if (!previousIdMatch) {
              console.error("Failed to extract previous ID from active ID");
              return;
          }

          const previousId = parseInt(previousIdMatch[0], 10);
          const currentSymbol = positions[previousId];

          if (highlightedSquares.has(clickedId)) {
              // Move the piece to the highlighted square
              const targetPiece = positions[clickedId];
              if (
                  !targetPiece || // Empty square
                  (turn === "white" ? targetPiece.startsWith("B") : targetPiece.startsWith("W")) // Opponent's piece
              ) {
                  console.log("Moving piece to:", clickedId);
                  const newPositions = [...positions];
                  newPositions[previousId] = null; // Clear the original square
                  newPositions[clickedId] = currentSymbol; // Move piece to new square
                  setPositions(newPositions); // Update positions state
                  setActiveId(null); // Clear the active ID
                  setActivePieceType(null); // Clear active piece type
                  setHighlightedSquares(new Set()); // Clear highlighted squares
                  setTurn(turn === "white" ? "black" : "white"); // Switch turn
                  return;
              }
          }

          // Deselect the piece if clicking on a non-highlighted square
          console.log("Deselecting piece.");
          setActiveId(null);
          setActivePieceType(null);
          setHighlightedSquares(new Set());
      } else {
          // No active piece, so select a piece if clicked on a user's piece
          const targetPiece = positions[clickedId];
          if (
              targetPiece &&
              ((turn === "white" && targetPiece.startsWith("W")) || (turn === "black" && targetPiece.startsWith("B")))
          ) {
              console.log("Selecting new piece:", targetPiece, "at ID:", clickedId);
              setActiveId(grandParentElement.id);
              setActivePieceType(targetPiece);
              const newHighlightedSquares = getHighlightIndices(grandParentElement.id, positions, targetPiece);
              setHighlightedSquares(new Set(newHighlightedSquares));
              console.log("New highlighted squares:", Array.from(newHighlightedSquares));
          } else {
              console.log("Cannot select this square.");
          }
      }
  },
  [turn, activeId, positions, highlightedSquares, activePieceType]
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
        setActivePieceType: React.Dispatch<React.SetStateAction<string | null>>
    ) =>  {
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

      console.log("Current ID:", currentId);
      console.log("Active ID:", activeId);
      console.log("Highlighted squares:", Array.from(highlightedSquares));
      console.log("Current turn:", turn);

      if (activeId && activePieceType) {
          // There is an active piece
          if (highlightedSquares.has(currentId)) {
              // If the clicked square is a highlighted square, move the piece
              console.log("Moving active piece to empty highlighted square:", currentId);
              const previousId = parseInt(activeId.match(/[0-9]+/)![0], 10);
              const newPositions = [...positions];
              newPositions[previousId] = null; // Clear the original square
              newPositions[currentId] = activePieceType; // Move piece to new square
              setPositions(newPositions); // Update positions state
              setActiveId(null); // Clear the active ID
              setActivePieceType(null); // Clear active piece type
              setHighlightedSquares(new Set()); // Clear highlighted squares
              setTurn(turn === "white" ? "black" : "white"); // Switch turn
          } else {
              console.log("Clicking on a non-highlighted square does nothing.");
          }
      } else {
          // If no active piece, try to select a piece if it belongs to the current player
          const targetPiece = positions[currentId];
          if (targetPiece && ((turn === "white" && targetPiece.startsWith("W")) || (turn === "black" && targetPiece.startsWith("B")))) {
              console.log("Selecting new piece:", targetPiece, "at ID:", currentId);
              setActiveId(parentElement.id);
              setActivePieceType(targetPiece);
              const newHighlightedSquares = getHighlightIndices(parentElement.id, positions, targetPiece);
              setHighlightedSquares(new Set(newHighlightedSquares));
              console.log("New Highlighted Squares:", Array.from(newHighlightedSquares));
          } else {
              console.log("Cannot select this square: Empty or not your turn.");
              setActiveId(null); // Deselect if clicking on an invalid square
              setActivePieceType(null);
              setHighlightedSquares(new Set());
          }
      }
  },
  [turn, activeId, positions, highlightedSquares, activePieceType]
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
        clickFunctionEmpty // Add clickFunctionEmpty
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
        clickFunctionEmpty // Add clickFunctionEmpty
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
        clickFunctionEmpty // Add clickFunctionEmpty
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
      clickFunctionEmpty // Add clickFunctionEmpty
  );
    updateSentence(turn);
    setCheck(isCheck(positions, turn));
    setHighlightedSquares(new Set());
  }, [turn]);

  return (
    <div className="App">
      <Toggle
        id="flip"
        defaultChecked={flip}
        onChange={() => {
          setFlip(!flip);
        }}
      />
      <label htmlFor="flip">Play as Black</label>
      <p id="turnDisplay"></p>
      <p id="isCheck">{check ? "Check" : ""}</p>
      <button onClick={() => {
        createBoard(flip, positions, setPositions);
        setTurn(flip ? "black" : "white");
      }}>New Game</button>
      <TakenPieces positions={positions} />

      <table id="chessboard">
        {/* Render chessboard here */}
      </table>
    </div>
  );
}

export default App;
