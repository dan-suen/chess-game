import "./App.css";
import { useState, useEffect } from "react";
import Toggle from "react-toggle";
import createBoard from "./hooks/createBoard";
import updateSentence from "./hooks/updateSentence";
import updateTaken from "./hooks/updateTaken";
function App() {
  const [positions, setPositions] = useState<(string|null)[]>(
    (() => {
      const initialPositions = Array(64).fill(null);
      initialPositions[0] = "WK";
      initialPositions[4] = "BK";
      return initialPositions;
    })()
    //Array(64).fill(null)
  );
  const [flip, setFlip] = useState<boolean>(false);
  const [turn, setTurn] = useState<"black" | "white">("white");
  const [taken, setTaken] = useState<(string|null)[]>(Array(64).fill(null));
  useEffect(() => {
    createBoard(positions, setPositions, flip)
  }, []);
  
  useEffect(() => {
    createBoard(positions, setPositions, flip);
    setTurn(flip ? "black" : "white")
    setTaken(Array(64).fill(null))
  }, [flip]);
  useEffect(() => {
    //updatePositions(setPositions)
    updateTaken(positions, taken, setTaken);
    updateSentence(turn);
  }, [turn]);
 



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
