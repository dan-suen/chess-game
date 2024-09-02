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
const canCastle = (
  kingIndex: number, 
  rookIndex: number, 
  positions: (string | null)[], 
  turn: string, 
  opponentMoves: number[]
): boolean => {
  const isKingSide = rookIndex > kingIndex; // Determine if castling is king-side

  console.log(`Checking canCastle for ${turn} king from ${kingIndex} with rook at ${rookIndex} (${isKingSide ? 'king-side' : 'queen-side'})`);

  // Check if the king or the rook has moved
  if ((turn === 'W' && hasMoved.WK) || (turn === 'B' && hasMoved.BK)) {
    console.log(`King has already moved for ${turn}, castling not allowed.`);
    return false;
  }

  if (isKingSide && ((turn === 'W' && hasMoved.WR2) || (turn === 'B' && hasMoved.BR2))) {
    console.log(`${turn} King-side rook has already moved, castling not allowed.`);
    return false;
  }
  if (!isKingSide && ((turn === 'W' && hasMoved.WR1) || (turn === 'B' && hasMoved.BR1))) {
    console.log(`${turn} Queen-side rook has already moved, castling not allowed.`);
    return false;
  }

  // Ensure all squares between the king and rook are empty
  const betweenSquares = isKingSide
    ? (turn === 'W' ? [61, 62] : [5, 6]) // White king-side: squares 61, 62; Black king-side: squares 5, 6
    : (turn === 'W' ? [57, 58, 59] : [1, 2, 3]); // White queen-side: squares 57, 58, 59; Black queen-side: squares 1, 2, 3

  console.log(`Checking squares between king and rook: ${betweenSquares}`);
  for (const square of betweenSquares) {
    console.log(`Square ${square} state: ${positions[square]}`);
    if (positions[square]) {
      console.log(`Square ${square} is not empty between king and rook, castling not allowed.`);
      return false;
    }
  }

  // Ensure none of the squares the king moves through or ends on is in check
  const checkSquares = isKingSide
    ? (turn === 'W' ? [60, 61, 62] : [4, 5, 6]) // White king-side: squares 60, 61, 62; Black king-side: squares 4, 5, 6
    : (turn === 'W' ? [60, 59, 58] : [4, 3, 2]); // White queen-side: squares 60, 59, 58; Black queen-side: squares 4, 3, 2

  console.log(`Checking if any square in ${checkSquares} is under attack.`);
  for (const square of checkSquares) {
    if (isKingInCheck(square, opponentMoves)) {
      console.log(`Square ${square} is under attack, castling not allowed.`);
      return false;
    }
  }

  console.log(`Castling is allowed for ${turn} on ${isKingSide ? 'king-side' : 'queen-side'}`);
  return true;
};



const getKingMoves = (
  index: number,
  positions: (string | null)[],
  activeElement: string,
  opponentMoves: number[]
): number[] => {
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
  console.log(`Checking castling moves for ${activeElement} at index ${index}`);

  // King-side castling check
  if (canCastle(index, turn === 'W' ? 63 : 7, positions, turn, opponentMoves)) {
    console.log(`King-side castling move added for ${activeElement}`);
    moves.push(turn === 'W' ? 62 : 6); // Corrected king-side castling target
  }

  // Queen-side castling check
  if (canCastle(index, turn === 'W' ? 56 : 0, positions, turn, opponentMoves)) {
    console.log(`Queen-side castling move added for ${activeElement}`);
    moves.push(turn === 'W' ? 58 : 2); // Corrected queen-side castling target
  }

  console.log(`Final king moves for ${activeElement} at index ${index}:`, moves);
  return moves;
};



const executeCastling = (
  kingIndex: number,
  rookIndex: number,
  positions: (string | null)[],
  turn: string
): void => {
  // Determine if it's a king-side or queen-side castling
  const isKingSide = rookIndex > kingIndex;
  console.log("rookIndex:", rookIndex, "kingIndex:", kingIndex);

  // Calculate new positions for king and rook
  const newKingIndex = isKingSide ? kingIndex + 2 : kingIndex - 2;
  const newRookIndex = isKingSide ? kingIndex + 1 : kingIndex - 1;

  // Move the King to its new position
  positions[newKingIndex] = positions[kingIndex];
  positions[kingIndex] = null;

  // Move the Rook to its new position
  positions[newRookIndex] = positions[rookIndex];
  positions[rookIndex] = null;

  // Mark the pieces as having moved
  if (turn === 'W') {
    hasMoved.WK = true; // White King
    if (isKingSide) {
      hasMoved.WR2 = true; // White King-side Rook
    } else {
      hasMoved.WR1 = true; // White Queen-side Rook
    }
  } else {
    hasMoved.BK = true; // Black King
    if (isKingSide) {
      hasMoved.BR2 = true; // Black King-side Rook
    } else {
      hasMoved.BR1 = true; // Black Queen-side Rook
    }
  }
};




const getPawnMoves = (
  index: number,
  positions: (string | null)[],
  activeElement: string,
  lastMove: { from: number; to: number; piece: string } | null
): number[] => {
  const [row, col] = indexToPos(index);
  const isBlackPawn = activeElement.startsWith("B");
  const direction = isBlackPawn ? 1 : -1; // Direction of movement for pawns
  let moves: number[] = [];

  // Regular pawn moves (1 or 2 squares forward)
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

  // Capture moves (diagonal moves)
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

  // En Passant logic
  if (
    lastMove &&
    /^(WP|BP)/.test(lastMove.piece) && // The last move was made by a pawn
    Math.abs(lastMove.from - lastMove.to) === 16 // The opponent's pawn moved two squares last move
  ) {
    const [lastRow, lastCol] = indexToPos(lastMove.to);
    const enPassantRow = isBlackPawn ? 4 : 3; // En passant capture row for black and white pawns
    if (
      row === enPassantRow && // The pawn is in the correct row for en passant
      Math.abs(lastCol - col) === 1 && // The opponent's pawn is adjacent
      lastRow === row // The opponent's pawn is on the same row
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
  lastMove: { from: number; to: number; piece: string } | null,
  opponentMoves: number[] // Add opponentMoves as an argument
): number[] => {
  if (/^(WR|BR)/.test(piece)) return getRookMoves(index, positions, piece);
  if (/^(WB|BB)/.test(piece)) return getBishopMoves(index, positions, piece);
  if (/^(WN|BN)/.test(piece)) return getKnightMoves(index, positions, piece);
  if (/^(WQ|BQ)/.test(piece)) return getQueenMoves(index, positions, piece);
  if (/^(WK|BK)/.test(piece)) return getKingMoves(index, positions, piece, opponentMoves);
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

  // Iterate through all pieces on the board
  positions.forEach((piece, index) => {
    if (piece && isOpponentPiece(piece, `${activePlayer[0]}K`)) { // Check if the piece is an opponent's piece
      //console.log(`This is an opponent's piece: ${piece} at ${index}`);

      let pieceMoves: number[] = [];

      // Calculate moves based on the piece type
      if (/^(WR|BR)/.test(piece)) {
        pieceMoves = getRookMoves(index, positions, piece);
        //console.log(`Rook at ${index} (${piece}) possible moves: ${pieceMoves}`);
      } else if (/^(WB|BB)/.test(piece)) {
        pieceMoves = getBishopMoves(index, positions, piece);
        //console.log(`Bishop at ${index} (${piece}) possible moves: ${pieceMoves}`);
      } else if (/^(WN|BN)/.test(piece)) {
        pieceMoves = getKnightMoves(index, positions, piece);
        //console.log(`Knight at ${index} (${piece}) possible moves: ${pieceMoves}`);
      } else if (/^(WQ|BQ)/.test(piece)) {
        pieceMoves = getQueenMoves(index, positions, piece);
        //console.log(`Queen at ${index} (${piece}) possible moves: ${pieceMoves}`);
      } else if (/^(WP|BP)/.test(piece)) {
        pieceMoves = getPawnMoves(index, positions, piece, lastMove);
        //console.log(`Pawn at ${index} (${piece}) possible moves: ${pieceMoves}`);
      }

      opponentMoves.push(...pieceMoves); // Add the piece's moves to the list of opponent moves
    }
  });

  console.log(`All opponent moves calculated: ${opponentMoves}`);
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
  const opponentMoves = getAllOpponentMoves(positions, activePlayer === 'W' ? 'black' : 'white', lastMove);
  const possibleMoves: number[] = getMovesForPiece(activeIndex, activeElement, positions, lastMove, opponentMoves);

  console.log(`Possible moves for ${activeElement} at index ${activeIndex}:`, possibleMoves);

  // Filter moves that are valid and do not put the active player's king in check
  const filteredMoves = possibleMoves.filter(move => {
    const newPositions = [...positions];
    newPositions[activeIndex] = null;
    newPositions[move] = activeElement;

    const isValid = isValidMove(
      activeElement, 
      activeIndex, 
      move, 
      positions, 
      activePlayer === 'W' ? 'white' : 'black', 
      lastMove, 
      opponentMoves // Pass the seventh argument
    );

    console.log(`Checking move from ${activeIndex} to ${move} for ${activeElement}: isValid = ${isValid}`);

    return isValid && !isCheck(newPositions, activePlayer, lastMove);
  });

  console.log(`Filtered valid moves for ${activeElement} at index ${activeIndex}:`, filteredMoves);
  return filteredMoves;
};


export {isCheck, getHighlightIndices, executeCastling, canCastle, getAllOpponentMoves};
