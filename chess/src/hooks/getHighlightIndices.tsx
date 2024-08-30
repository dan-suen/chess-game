const getHighlightIndices = function (
  activeId: string | null,
  positions: (string | null)[],
  activeElement: string | null
): number[] {
  console.log("getHighlightIndices called with:", { activeId, positions, activeElement });
  if (!activeId || !activeElement) return [];

  const activeIndex = parseInt(activeId.match(/[0-9]+/)![0], 10);
  const [row, col] = [Math.floor(activeIndex / 8), activeIndex % 8];

  const posToIndex = (row: number, col: number): number => row * 8 + col;
  const indexToPos = (index: number): [number, number] => [Math.floor(index / 8), index % 8];

  // Utility function to determine if a piece belongs to the opponent
  const isOpponentPiece = (piece: string | null, activeElement: string): boolean => {
    if (!piece) return false;
    return (activeElement.startsWith("W") && piece.startsWith("B")) || (activeElement.startsWith("B") && piece.startsWith("W"));
  };

  const getRookMoves = (index: number): number[] => {
    const [row, col] = indexToPos(index);
    let moves: number[] = [];

    // Horizontal and Vertical Directions
    const directions = [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    directions.forEach(([dr, dc]) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break; // Out of bounds
        const targetIndex = posToIndex(newRow, newCol);
        if (positions[targetIndex]) {
          if (isOpponentPiece(positions[targetIndex], activeElement)) {
            moves.push(targetIndex); // Capture opponent piece
          }
          break; // Stop at the first piece (cannot jump over)
        }
        moves.push(targetIndex); // Empty square
      }
    });

    return moves;
  };

  const getBishopMoves = (index: number): number[] => {
    const [row, col] = indexToPos(index);
    let moves: number[] = [];

    // Diagonal Directions
    const directions = [
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    directions.forEach(([dr, dc]) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break; // Out of bounds
        const targetIndex = posToIndex(newRow, newCol);
        if (positions[targetIndex]) {
          if (isOpponentPiece(positions[targetIndex], activeElement)) {
            moves.push(targetIndex); // Capture opponent piece
          }
          break; // Stop at the first piece
        }
        moves.push(targetIndex); // Empty square
      }
    });

    return moves;
  };

  const getKnightMoves = (index: number): number[] => {
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

  const getQueenMoves = (index: number): number[] => {
    return [...getRookMoves(index), ...getBishopMoves(index)];
  };

  const getKingMoves = (index: number): number[] => {
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

  const getPawnMoves = (index: number): number[] => {
    const [row, col] = indexToPos(index);
    const isBlackPawn = activeElement.startsWith("B");
    const direction = isBlackPawn ? 1 : -1;
    let moves: number[] = [];

    // Forward moves
    const oneSquareForward = posToIndex(row + direction, col);
    if (row + direction >= 0 && row + direction < 8 && !positions[oneSquareForward]) {
      moves.push(oneSquareForward);
    }

    // Two squares forward from initial position
    if ((isBlackPawn && row === 1) || (!isBlackPawn && row === 6)) {
      const twoSquaresForward = posToIndex(row + 2 * direction, col);
      if (!positions[twoSquaresForward] && !positions[oneSquareForward]) {
        moves.push(twoSquaresForward);
      }
    }

    // Diagonal captures
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

    return moves;
  };

  let moves: number[] = [];

  // Determine the type of piece and get its moves
  if (/^(WR|BR)/.test(activeElement)) {
    moves = getRookMoves(activeIndex);
  } else if (/^(WB|BB)/.test(activeElement)) {
    moves = getBishopMoves(activeIndex);
  } else if (/^(WN|BN)/.test(activeElement)) {
    moves = getKnightMoves(activeIndex);
  } else if (/^(WQ|BQ)/.test(activeElement)) {
    moves = getQueenMoves(activeIndex);
  } else if (/^(WK|BK)/.test(activeElement)) {
    moves = getKingMoves(activeIndex);
  } else if (/^(WP|BP)/.test(activeElement)) {
    moves = getPawnMoves(activeIndex);
  }

  console.log("Computed highlight indices:", moves);
  return moves;
};

export default getHighlightIndices;
