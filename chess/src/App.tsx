import "./App.css";
import { useState, useEffect } from "react";
import Toggle from "react-toggle";
import createBoard from "./hooks/createBoard";
import updateSentence from "./hooks/updateSentence";
import updateTaken from "./hooks/updateTaken";
import addPieces from "./hooks/addPieces";
import { isCheck } from "./hooks/gamelogic";
function App() {
  const [positions, setPositions] = useState<(string|null)[]>(
    (() => {
      const initialPositions = Array(64).fill(null);
      initialPositions[0] = "BR1";
      initialPositions[1] = "BN1";
      initialPositions[2] = "BB1";
      initialPositions[3] = "BK";
      initialPositions[4] = "BQ";
      initialPositions[5] = "BB2";
      initialPositions[6] = "BN2";
      initialPositions[7] = "BR2";
      initialPositions[8] = "BP1";
      initialPositions[9] = "BP2";
      initialPositions[10] = "BP3";
      initialPositions[11] = "BP4";
      initialPositions[12] = "BP5";
      initialPositions[13] = "BP6";
      initialPositions[14] = "BP7";
      initialPositions[15] = "BP8";

        

      initialPositions[48] = "WP1";        
      initialPositions[49] = "WP2";
      initialPositions[50] = "WP3";
      initialPositions[51] = "WP4";
      initialPositions[52] = "WP5";
      initialPositions[53] = "WP6";
      initialPositions[54] = "WP7";
      initialPositions[55] = "WP8";
      initialPositions[56] = "WR1";
      initialPositions[57] = "WN1";
      initialPositions[58] = "WB1";
      initialPositions[59] = "WK";
      initialPositions[60] = "WQ";
      initialPositions[61] = "WB2";
      initialPositions[62] = "WN2";
      initialPositions[63] = "WR2";
        
      return initialPositions;
    })()
  );
  const [flip, setFlip] = useState<boolean>(false);
  const [turn, setTurn] = useState<"black" | "white">("white");
  const [taken, setTaken] = useState<(string|null)[]>(Array(64).fill(null));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [check, setCheck] = useState<boolean>(false);

  useEffect(() => {
    createBoard(flip, positions, setPositions)
  }, []);
  useEffect(() => {
    addPieces(turn, setTurn, positions, setPositions, activeId, setActiveId);
    updateTaken(positions, taken, setTaken)
  }, [positions, activeId]);
  useEffect(() => {
    setTurn(flip ? "black" : "white")
    createBoard(flip, positions, setPositions);
    setTaken(Array(64).fill(null))
    addPieces(turn, setTurn, positions, setPositions, activeId, setActiveId);
  }, [flip]);
  useEffect(() => {
    addPieces(turn, setTurn, positions, setPositions, activeId, setActiveId);
    updateSentence(turn);
    updateTaken(positions, taken, setTaken);
    setCheck(isCheck(positions, turn));
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
      <p id="isCheck">{check ? "Check" : ""}</p>
      <button onClick={() => {
         createBoard(flip, positions, setPositions)
         setTurn(flip ? "black" : "white")
        }}>New Game</button>
        <div id="taken"></div>

      <table id="chessboard">





      </table>
    </div>
  );
}

export default App;
