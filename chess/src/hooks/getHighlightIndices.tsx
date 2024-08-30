const getHighlightIndices = function (
    activeId: string | null,
    positions: (string | null)[],
    activeElement: string | null
  ): number[] {
    if (!activeId || !activeElement) return [];
  
    const activeIndex = parseInt(activeId.match(/[0-9]+/)![0], 10);
    const [row, col] = [Math.floor(activeIndex / 8), activeIndex % 8];
    const moves: number[] = [];

    const posToIndex = (row: number, col: number): number => row * 8 + col;

    if (/P/.test(activeElement)) {
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