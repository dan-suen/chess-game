import React from 'react';

const PromotionSelector = ({ onSelectPromotion }: { onSelectPromotion: (piece: string) => void }) => {
  return (
    <div className="promotion-selector">
      <button onClick={() => onSelectPromotion('Q')}>Queen</button>
      <button onClick={() => onSelectPromotion('R')}>Rook</button>
      <button onClick={() => onSelectPromotion('B')}>Bishop</button>
      <button onClick={() => onSelectPromotion('N')}>Knight</button>
    </div>
  );
};

export default PromotionSelector;