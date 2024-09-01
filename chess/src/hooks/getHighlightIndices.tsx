import isValidMove from "./isValid";
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

// Tracking the movement of pieces
const hasMoved = {
  WK: false,
  WR1: false, // White King-side rook
  WR2: false, // White Queen-side rook
  BK: false,
  BR1: false, // Black King-side rook
  BR2: false  // Black Queen-side rook
};

// Check if castling is possible for the king
const canCastle = (kingIndex: number, rookIndex: number, positions: (string | null)[], turn: string): boolean => {
  const isKingSide = rookIndex > kingIndex;
  const kingRow = indexToPos(kingIndex)[0];

  // Check if the king or the rook has moved
  if ((turn === 'W' && hasMoved.WK) || (turn === 'B' && hasMoved.BK)) return false;
  if (isKingSide && ((turn === 'W' && hasMoved.WR1) || (turn === 'B' && hasMoved.BR1))) return false;
  if (!isKingSide && ((turn === 'W' && hasMoved.WR2) || (turn === 'B' && hasMoved.BR2))) return false;

  // Ensure all squares between the king and rook are empty
  const betweenSquares = isKingSide ? [kingIndex + 1, kingIndex + 2] : [kingIndex - 1, kingIndex - 2, kingIndex - 3];
  for (const square of betweenSquares) {
    if (positions[square]) return false;
  }

  // Ensure none of the squares the king moves through is in check
  const checkSquares = isKingSide ? [kingIndex, kingIndex + 1, kingIndex + 2] : [kingIndex, kingIndex - 1, kingIndex - 2];
  for (const square of checkSquares) {
    if (isKingInCheck(square, getAllOpponentMoves(positions, turn, null))) return false;
  }

  return true;
};

// Adjusted getKingMoves function to include castling
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

  // Add castling moves
  const turn = activeElement[0];
  if (canCastle(index, turn === 'W' ? 7 : 63, positions, turn)) {
    moves.push(turn === 'W' ? 6 : 62); // King-side castling target
  }
  if (canCastle(index, turn === 'W' ? 0 : 56, positions, turn)) {
    moves.push(turn === 'W' ? 2 : 58); // Queen-side castling target
  }

  return moves;
};

// Execute the castling move
const executeCastling = (kingIndex: number, rookIndex: number, positions: (string | null)[], turn: string): void => {
  const isKingSide = rookIndex > kingIndex;
  const newKingIndex = isKingSide ? kingIndex + 2 : kingIndex - 2;
  const newRookIndex = isKingSide ? kingIndex + 1 : kingIndex - 1;

  // Move the king and rook to their new positions
  positions[newKingIndex] = positions[kingIndex];
  positions[newRookIndex] = positions[rookIndex];
  positions[kingIndex] = null;
  positions[rookIndex] = null;

  // Mark pieces as moved
  if (turn === 'W') {
    hasMoved.WK = true;
    if (isKingSide) hasMoved.WR1 = true;
    else hasMoved.WR2 = true;
  } else {
    hasMoved.BK = true;
    if (isKingSide) hasMoved.BR1 = true;
    else hasMoved.BR2 = true;
  }
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
  const possibleMoves: number[] = getMovesForPiece(activeIndex, activeElement, positions, lastMove);

  console.log(`Possible moves for ${activeElement} at index ${activeIndex}:`, possibleMoves);

  // Filter moves that are valid and do not put the active player's king in check
  const filteredMoves = possibleMoves.filter(move => {
    const newPositions = [...positions];
    newPositions[activeIndex] = null;
    newPositions[move] = activeElement;

    const isValid = isValidMove(activeElement, activeIndex, move, positions, activePlayer === 'W' ? 'white' : 'black', lastMove);
    console.log(`Checking move from ${activeIndex} to ${move} for ${activeElement}: isValid = ${isValid}`);

    return isValid && !isCheck(newPositions, activePlayer, lastMove);
  });

  console.log(`Filtered valid moves for ${activeElement} at index ${activeIndex}:`, filteredMoves);
  return filteredMoves;
};



export {isCheck, getHighlightIndices, executeCastling, canCastle};
