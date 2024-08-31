import React from 'react';

// Import SVG icons
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
  // Determine the correct set of icons based on the color prop
  const BishopIcon = color === 'white' ? WBishopIcon : BBishopIcon;
  const KnightIcon = color === 'white' ? WKnightIcon : BKnightIcon;
  const QueenIcon = color === 'white' ? WQueenIcon : BQueenIcon;
  const RookIcon = color === 'white' ? WRookIcon : BRookIcon;

  return (
    <div className="promotion-selector">
      <button onClick={() => onSelect('Q')}>
        <QueenIcon />
      </button>
      <button onClick={() => onSelect('R')}>
        <RookIcon />
      </button>
      <button onClick={() => onSelect('B')}>
        <BishopIcon />
      </button>
      <button onClick={() => onSelect('N')}>
        <KnightIcon />
      </button>
    </div>
  );
};

export default PromotionSelector;
