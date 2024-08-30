import getHighlightIndices from './getHighlightIndices';

const isKingInCheck = (
  kingPosition: number,
  opponentMoves: number[]
): boolean => {
  return opponentMoves.includes(kingPosition);
};

const getAllOpponentMoves = (
  positions: (string | null)[],
  activePlayer: string
): number[] => {
  const opponentMoves: number[] = [];
  const opponentPieces = positions
    .map((piece, index) => ({ piece, index }))
    .filter(({ piece }) => piece && piece[0] !== activePlayer[0]); // Opponent pieces

  opponentPieces.forEach(({ piece, index }) => {
    const pieceMoves = getHighlightIndices(
      index.toString(),
      positions,
      piece
    );
    opponentMoves.push(...pieceMoves);
  });

  return opponentMoves;
};

const isCheck = (
    positions: (string | null)[],
    turn: string
  ): boolean => {
    // Determine the king's identifier based on the turn
    const kingIdentifier = `${turn[0].toUpperCase()}K`;
    console.log(`Searching for king: ${kingIdentifier}`);
    
    const kingIndex = positions.findIndex(piece => piece === kingIdentifier); // Find king's position
    console.log(`King index: ${kingIndex}`);
    
    if (kingIndex === -1) {
      console.log(`No king found for ${turn}`);
      return false; // No king found
    }
  
    const opponentMoves = getAllOpponentMoves(positions, turn);
  
    return isKingInCheck(kingIndex, opponentMoves);
  };

export { isCheck };
