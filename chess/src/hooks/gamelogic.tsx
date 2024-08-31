import getHighlightIndices from './getHighlightIndices';

const isKingInCheck = (
  kingPosition: number,
  opponentMoves: number[]
): boolean => {
  return opponentMoves.includes(kingPosition);
};

const getAllOpponentMoves = (
  positions: (string | null)[],
  activePlayer: string,
  lastMove: { from: number; to: number; piece: string } | null 
): number[] => {
  const opponentMoves: number[] = [];
  const opponentPieces = positions
    .map((piece, index) => ({ piece, index }))
    .filter(({ piece }) => piece && piece[0] !== activePlayer[0]); // Opponent pieces

  opponentPieces.forEach(({ piece, index }) => {
    const pieceMoves = getHighlightIndices(
      index.toString(),
      positions,
      piece,
      lastMove 
    );
    opponentMoves.push(...pieceMoves);
  });

  return opponentMoves;
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

export { isCheck };
