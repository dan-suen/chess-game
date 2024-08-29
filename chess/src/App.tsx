import "./App.css";
import { useState, useEffect } from "react";
import Toggle from "react-toggle";
import addPieces from "./hooks/addPieces";
import createBoard from "./hooks/createBoard";
import updateSentence from "./hooks/updateSentence";
import updateTaken from "./hooks/updateTaken";
function App() {
  const [positions, setPositions] = useState<(string|null)[]>(Array(64).fill(null));
  const [flip, setFlip] = useState<boolean>(false);
  const [turn, setTurn] = useState<"black" | "white">("white");
  const [taken, setTaken] = useState<(string|null)[]>(Array(64).fill(null));
  useEffect(() => {
    createBoard(positions, flip);
    setTurn(flip ? "black" : "white")
  }, [flip]);
  useEffect(() => {
    addPieces();
    setTurn(flip ? "black" : "white")
  }, [positions]);
  useEffect(() => {
    updateTaken(positions, taken, setTaken);
    updateSentence(turn);
  }, [turn, taken]);





  return (
    <div className="App">
      <Toggle
        id="flip"
        defaultChecked={flip}
        onChange={() => {
          setFlip(!flip)
          setPositions([...positions].fill(null))
        }}
      />
      <label htmlFor="flip">Play as Black</label>
      <p id="turnDisplay"></p>
      <button onClick={() => {
          setPositions([...positions].fill(null))
        }}>New Game</button>
        <div id="taken"></div>

      <table id="chessboard">





      </table>
    </div>
  );
}

export default App;
