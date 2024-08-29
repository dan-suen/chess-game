import "./App.css";
import { useState, useEffect } from "react";
import Toggle from "react-toggle";
import addPieces from "./hooks/addPieces";
import createBoard from "./hooks/createBoard";
import updateSentence from "./hooks/updateSentence";
import updateTaken from "./hooks/updateTaken";
function App() {
  const [positions, setPositions] = useState<string[]>(Array(64).fill(null));
  const [flip, setFlip] = useState<boolean>(false);
  const [turn, setTurn] = useState<"black" | "white">("white");
  useEffect(() => {
    createBoard();
    setTurn(flip ? "black" : "white")
  }, [flip]);
  useEffect(() => {
    addPieces();
  }, [positions]);
  useEffect(() => {
    updateTaken();
    updateSentence();
  }, [turn]);

  return (
    <div className="App">
      <Toggle
        id="flip"
        defaultChecked={flip}
        onChange={() => setFlip(!flip)}
      />
      <label htmlFor="flip">Play as Black</label>
    </div>
  );
}

export default App;
