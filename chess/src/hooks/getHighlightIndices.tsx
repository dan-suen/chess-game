const getHighlightIndices = function (
  activeId: string | null,
  positions: (string | null)[],
  activeElement: string | null
): number[] {
  if (!activeId || !activeElement) return [];

  const activeIndex = parseInt(activeId.match(/[0-9]+/)![0], 10);
  const [row, col] = [Math.floor(activeIndex / 8), activeIndex % 8];
  
  const posToIndex = (row: number, col: number): number => row * 8 + col;
  
  const indexToPos = (index: number): [number, number] => [Math.floor(index / 8), index % 8];
  
  const getRookMoves = (index: number): number[] => {
    const [row, col] = indexToPos(index);
    let moves: number[] = [];
  
    // Horizontal and Vertical Moves
    for (let i = row + 1; i < 8; i++) {
      const targetIndex = posToIndex(i, col);
      if (positions[targetIndex]) {
        if (positions[targetIndex] !== activeElement) {
          moves.push(targetIndex);
        }
        break;
      }
      moves.push(targetIndex);
    }
  
    for (let i = row - 1; i >= 0; i--) {
      const targetIndex = posToIndex(i, col);
      if (positions[targetIndex]) {
        if (positions[targetIndex] !== activeElement) {
          moves.push(targetIndex);
        }
        break;
      }
      moves.push(targetIndex);
    }
  
    for (let i = col + 1; i < 8; i++) {
      const targetIndex = posToIndex(row, i);
      if (positions[targetIndex]) {
        if (positions[targetIndex] !== activeElement) {
          moves.push(targetIndex);
        }
        break;
      }
      moves.push(targetIndex);
    }
  
    for (let i = col - 1; i >= 0; i--) {
      const targetIndex = posToIndex(row, i);
      if (positions[targetIndex]) {
        if (positions[targetIndex] !== activeElement) {
          moves.push(targetIndex);
        }
        break;
      }
      moves.push(targetIndex);
    }
  
    return moves;
  };
  
  const getBishopMoves = (index: number): number[] => {
    const [row, col] = indexToPos(index);
    let moves: number[] = [];
  
    // Diagonal Moves
    const directions = [
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    directions.forEach(([r, c]) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + i * r;
        const newCol = col + i * c;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const targetIndex = posToIndex(newRow, newCol);
          if (positions[targetIndex]) {
            if (positions[targetIndex] !== activeElement) {
              moves.push(targetIndex);
            }
            break;
          }
          moves.push(targetIndex);
        } else {
          break;
        }
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
  
    knightMoves.forEach(([r, c]) => {
      const newRow = row + r;
      const newCol = col + c;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetIndex = posToIndex(newRow, newCol);
        moves.push(targetIndex);
      }
    });
  
    return moves;
  };
  
  const getQueenMoves = (index: number): number[] => {
    return [...getRookMoves(index), ...getBishopMoves(index)];
  };
  
  let moves: number[] = []; // Define moves at the beginning of the function

  if (/R[0-9]/.test(activeElement)) {
    moves = getRookMoves(activeIndex);
  } else if (/B[0-9]/.test(activeElement)) {
    moves = getBishopMoves(activeIndex);
  } else if (/N[0-9]/.test(activeElement)) {
    moves = getKnightMoves(activeIndex);
  } else if (/Q/.test(activeElement)) {
    moves = getQueenMoves(activeIndex);
  } else if (/K$/.test(activeElement)) {
    const kingMoves = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
    kingMoves.forEach(([r, c]) => {
      const newRow = row + r;
      const newCol = col + c;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        moves.push(posToIndex(newRow, newCol));
      }
    });
  } else if (/P/.test(activeElement)) {
    const isBlackPawn = activeElement.startsWith('B');
    const direction = isBlackPawn ? 1 : -1;

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
        if (positions[captureIndex] && positions[captureIndex] !== activeElement) {
          moves.push(captureIndex);
        }
      }
    });
  }
  
  return moves;
};

export default getHighlightIndices;
