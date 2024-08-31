import React from "react";

const PromotionModal = ({ onPromote }: { onPromote: (piece: string) => void }) => {
  return (
    <div className="promotion-modal">
      <h3>Choose a piece for promotion:</h3>
      <button onClick={() => onPromote("Q")}>Queen</button>
      <button onClick={() => onPromote("R")}>Rook</button>
      <button onClick={() => onPromote("B")}>Bishop</button>
      <button onClick={() => onPromote("N")}>Knight</button>
    </div>
  );
};

export default PromotionModal;
