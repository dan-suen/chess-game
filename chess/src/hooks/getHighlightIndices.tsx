const posToIndex = (row: number, col: number): number => row * 8 + col;
const indexToPos = (index: number): [number, number] => [Math.floor(index / 8), index % 8];

const isOpponentPiece = (piece: string | null, activeElement: string): boolean => {
  if (!piece) return false;
  return (activeElement.startsWith("W") && piece.startsWith("B")) || (activeElement.startsWith("B") && piece.startsWith("W"));
};




const isKingInCheck = (
  kingPosition: number,
  opponentMoves: number[]
): boolean => {
  return opponentMoves.includes(kingPosition);
};



const isCheck = (
    positions: (string | null)[],
    turn: string,
    lastMove: { from: number; to: number; piece: string } | null 
  ): boolean => {
    // Determine the king's identifier based on the turn
    const kingIdentifier = `${turn[0].toUpperCase()}K`;
    //console.log(`Searching for king: ${kingIdentifier}`);
    
    const kingIndex = positions.findIndex(piece => piece === kingIdentifier); // Find king's position
    //console.log(`King index: ${kingIndex}`);
    
    if (kingIndex === -1) {
      //console.log(`No king found for ${turn}`);
      return false; // No king found
    }
  
    const opponentMoves = getAllOpponentMoves(positions, turn, lastMove);
  
    return isKingInCheck(kingIndex, opponentMoves);
  };


// Move generation functions
const getRookMoves = (index: number, positions: (string | null)[], activeElement: string): number[] => {
  const [row, col] = indexToPos(index);
  let moves: number[] = [];
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1]
  ];

  directions.forEach(([dr, dc]) => {
    for (let i = 1; i < 8; i++) {
      const newRow = row + dr * i;
      const newCol = col + dc * i;
      if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break; 
      const targetIndex = posToIndex(newRow, newCol);
      if (positions[targetIndex]) {
        if (isOpponentPiece(positions[targetIndex], activeElement)) {
          moves.push(targetIndex);
        }
        break; 
      }
      moves.push(targetIndex); 
    }
  });
  return moves;
};

const getBishopMoves = (index: number, positions: (string | null)[], activeElement: string): number[] => {
  const [row, col] = indexToPos(index);
  let moves: number[] = [];
  const directions = [
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];

  directions.forEach(([dr, dc]) => {
    for (let i = 1; i < 8; i++) {
      const newRow = row + dr * i;
      const newCol = col + dc * i;
      if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break; 
      const targetIndex = posToIndex(newRow, newCol);
      if (positions[targetIndex]) {
        if (isOpponentPiece(positions[targetIndex], activeElement)) {
          moves.push(targetIndex);
        }
        break; 
      }
      moves.push(targetIndex); 
    }
  });

  return moves;
};

const getKnightMoves = (index: number, positions: (string | null)[], activeElement: string): number[] => {
  const [row, col] = indexToPos(index);
  const knightMoves = [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2]
  ];
  let moves: number[] = [];

  knightMoves.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const targetIndex = posToIndex(newRow, newCol);
      if (!positions[targetIndex] || isOpponentPiece(positions[targetIndex], activeElement)) {
        moves.push(targetIndex);
      }
    }
  });

  return moves;
};

const getQueenMoves = (index: number, positions: (string | null)[], activeElement: string): number[] => {
  return [...getRookMoves(index, positions, activeElement), ...getBishopMoves(index, positions, activeElement)];
};

const getKingMoves = (index: number, positions: (string | null)[], activeElement: string): number[] => {
  const [row, col] = indexToPos(index);
  const kingMoves = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];
  let moves: number[] = [];

  kingMoves.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const targetIndex = posToIndex(newRow, newCol);
      if (!positions[targetIndex] || isOpponentPiece(positions[targetIndex], activeElement)) {
        moves.push(targetIndex);
      }
    }
  });

  return moves;
};

const getPawnMoves = (index: number, positions: (string | null)[], activeElement: string, lastMove: { from: number; to: number; piece: string } | null): number[] => {
  const [row, col] = indexToPos(index);
  const isBlackPawn = activeElement.startsWith("B");
  const direction = isBlackPawn ? 1 : -1;
  let moves: number[] = [];

  const oneSquareForward = posToIndex(row + direction, col);
  if (row + direction >= 0 && row + direction < 8 && !positions[oneSquareForward]) {
    moves.push(oneSquareForward);
  }

  if ((isBlackPawn && row === 1) || (!isBlackPawn && row === 6)) {
    const twoSquaresForward = posToIndex(row + 2 * direction, col);
    if (!positions[twoSquaresForward] && !positions[oneSquareForward]) {
      moves.push(twoSquaresForward);
    }
  }

  const captureMoves = [
    [row + direction, col - 1],
    [row + direction, col + 1]
  ];
  captureMoves.forEach(([newRow, newCol]) => {
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const captureIndex = posToIndex(newRow, newCol);
      if (positions[captureIndex] && isOpponentPiece(positions[captureIndex], activeElement)) {
        moves.push(captureIndex);
      }
    }
  });

  if (
    lastMove &&
    /^(WP|BP)/.test(lastMove.piece) && 
    Math.abs(lastMove.from - lastMove.to) === 16 
  ) {
    const [lastRow, lastCol] = indexToPos(lastMove.to);
    const enPassantRow = isBlackPawn ? 4 : 3;
    if (
      row === enPassantRow && 
      Math.abs(lastCol - col) === 1 && 
      lastRow === row 
    ) {
      const enPassantCaptureIndex = posToIndex(row + direction, lastCol);
      moves.push(enPassantCaptureIndex); 
    }
  }

  return moves;
};
const getMovesForPiece = (
  index: number,
  piece: string,
  positions: (string | null)[],
  lastMove: { from: number; to: number; piece: string } | null
): number[] => {
  if (/^(WR|BR)/.test(piece)) return getRookMoves(index, positions, piece);
  if (/^(WB|BB)/.test(piece)) return getBishopMoves(index, positions, piece);
  if (/^(WN|BN)/.test(piece)) return getKnightMoves(index, positions, piece);
  if (/^(WQ|BQ)/.test(piece)) return getQueenMoves(index, positions, piece);
  if (/^(WK|BK)/.test(piece)) return getKingMoves(index, positions, piece);
  if (/^(WP|BP)/.test(piece)) return getPawnMoves(index, positions, piece, lastMove);
  return [];
};
// Refactored getAllOpponentMoves function
const getAllOpponentMoves = (
  positions: (string | null)[],
  activePlayer: string,
  lastMove: { from: number; to: number; piece: string } | null
): number[] => {
  const opponentMoves: number[] = [];

  const opponentPieces = positions
    .map((piece, index) => ({ piece, index }))
    .filter(({ piece }) => piece && piece[0] !== activePlayer[0]);

  opponentPieces.forEach(({ piece, index }) => {
    let pieceMoves: number[] = [];

    if (/^(WR|BR)/.test(piece!)) pieceMoves = getRookMoves(index, positions, piece!);
    else if (/^(WB|BB)/.test(piece!)) pieceMoves = getBishopMoves(index, positions, piece!);
    else if (/^(WN|BN)/.test(piece!)) pieceMoves = getKnightMoves(index, positions, piece!);
    else if (/^(WQ|BQ)/.test(piece!)) pieceMoves = getQueenMoves(index, positions, piece!);
    else if (/^(WK|BK)/.test(piece!)) pieceMoves = getKingMoves(index, positions, piece!);
    else if (/^(WP|BP)/.test(piece!)) pieceMoves = getPawnMoves(index, positions, piece!, lastMove);

    opponentMoves.push(...pieceMoves);
  });

  return opponentMoves;
};

// Refactored getHighlightIndices function
const getHighlightIndices = function (
  activeId: string | null,
  positions: (string | null)[],
  activeElement: string | null,
  lastMove: { from: number; to: number; piece: string } | null
): number[] {
  if (!activeId || !activeElement) return [];

  const activeIndex = parseInt(activeId.match(/[0-9]+/)![0], 10);

  const activePlayer = activeElement[0];

  const moves: number[] = getMovesForPiece(activeIndex, activeElement, positions, lastMove);

  // Precompute opponent moves once, to avoid circular dependency
  const opponentMoves = getAllOpponentMoves(positions, activePlayer, lastMove);

  // Filter moves that do not put the active player's king in check
  const filteredMoves = moves.filter(move => {
    const newPositions = [...positions];
    newPositions[activeIndex] = null;
    newPositions[move] = activeElement;

    return !isCheck(newPositions, activePlayer, lastMove);
  });

  return filteredMoves;
};

export {isCheck, getHighlightIndices};
