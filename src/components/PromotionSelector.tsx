// PromotionSelector.tsx

import React from 'react';
import { ReactComponent as BBishopIcon } from "./Chess_bdt45.svg";
import { ReactComponent as WBishopIcon } from "./Chess_blt45.svg";
import { ReactComponent as BKnightIcon } from "./Chess_ndt45.svg";
import { ReactComponent as WKnightIcon } from "./Chess_nlt45.svg";
import { ReactComponent as BQueenIcon } from "./Chess_qdt45.svg";
import { ReactComponent as WQueenIcon } from "./Chess_qlt45.svg";
import { ReactComponent as BRookIcon } from "./Chess_rdt45.svg";
import { ReactComponent as WRookIcon } from "./Chess_rlt45.svg";

interface PromotionSelectorProps {
  onSelect: (piece: string) => void;
  color: 'white' | 'black';
}

const PromotionSelector: React.FC<PromotionSelectorProps> = ({ onSelect, color }) => {
  return (
    <div className="promotion-selector">
      <button onClick={() => onSelect('Q')}>
        {color === 'white' ? <WQueenIcon /> : <BQueenIcon />}
      </button>
      <button onClick={() => onSelect('R')}>
        {color === 'white' ? <WRookIcon /> : <BRookIcon />}
      </button>
      <button onClick={() => onSelect('B')}>
        {color === 'white' ? <WBishopIcon /> : <BBishopIcon />}
      </button>
      <button onClick={() => onSelect('N')}>
        {color === 'white' ? <WKnightIcon /> : <BKnightIcon />}
      </button>
    </div>
  );
};

export default PromotionSelector;
