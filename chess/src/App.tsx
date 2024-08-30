import "./App.css";
import { useState, useEffect } from "react";
import Toggle from "react-toggle";
import createBoard from "./hooks/createBoard";
import updateSentence from "./hooks/updateSentence";
import updateTaken from "./hooks/updateTaken";
import addPieces from "./hooks/addPieces";
function App() {
  const [positions, setPositions] = useState<(string|null)[]>(
    (() => {
      const initialPositions = Array(64).fill(null);
      return initialPositions;
    })()
    //Array(64).fill(null)
  );
  const [flip, setFlip] = useState<boolean>(false);
  const [turn, setTurn] = useState<"black" | "white">("white");
  const [taken, setTaken] = useState<(string|null)[]>(Array(64).fill(null));
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    createBoard(flip, positions, setPositions)
  }, []);
  useEffect(() => {
    addPieces(turn, setTurn, positions, setPositions, activeId, setActiveId);
  }, [positions, activeId]);
  useEffect(() => {
    setTurn(flip ? "black" : "white")
    createBoard(flip, positions, setPositions);
    setTaken(Array(64).fill(null))
    addPieces(turn, setTurn, positions, setPositions, activeId, setActiveId);
  }, [flip]);
  useEffect(() => {
    addPieces(turn, setTurn, positions, setPositions, activeId, setActiveId);
    updateTaken(positions, taken, setTaken)
    updateSentence(turn);
  }, [turn]);
 



  return (
    <div className="App">
      <Toggle
        id="flip"
        defaultChecked={flip}
        onChange={() => {
          setFlip(!flip)
        }}
      />
      <label htmlFor="flip">Play as Black</label>
      <p id="turnDisplay"></p>
      <button onClick={() => {
          addPieces(turn, setTurn, positions, setPositions, activeId, setActiveId);
        }}>New Game</button>
        <div id="taken"></div>

      <table id="chessboard">





      </table>
    </div>
  );
}

export default App;
