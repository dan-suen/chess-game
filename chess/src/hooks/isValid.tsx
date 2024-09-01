const isValidMove = (
    pieceType: string | null,
    from: number,
    to: number,
    positions: (string | null)[],
    turn: "black" | "white",
    lastMove: { from: number; to: number; piece: string } | null
  ): boolean => {
    if (!pieceType) return false;
  
    const normalizedPieceType = pieceType.replace(/\d+$/, '');
    const fromRow = Math.floor(from / 8);
    const fromCol = from % 8;
    const toRow = Math.floor(to / 8);
    const toCol = to % 8;
  
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
  
    const targetPiece = positions[to];
  
    console.log(`Validating move for ${normalizedPieceType} from ${from} to ${to}`);
    console.log(`Target piece: ${targetPiece}, Row difference: ${rowDiff}, Column difference: ${colDiff}`);
  
    // Check if the move is trying to capture a piece of the same color
    if (targetPiece && targetPiece[0] === pieceType[0]) {
      console.log("Invalid move: cannot capture a piece of the same color.");
      return false;
    }
  
    // Pawn-specific move logic
    switch (normalizedPieceType) {
      case 'WP': // White Pawn
        if (toRow === fromRow - 1 && colDiff === 0 && !targetPiece) return true; // Normal forward move
        if (fromRow === 6 && toRow === 4 && colDiff === 0 && !targetPiece && !positions[to + 8]) return true; // Double move
        if (toRow === fromRow - 1 && colDiff === 1 && targetPiece?.startsWith('B')) return true; // Diagonal capture
  
        // En passant capture for white pawn
        if (fromRow === 3 && toRow === 2 && colDiff === 1 && !targetPiece) {
          if (
            lastMove &&
            lastMove.piece === 'BP' &&
            lastMove.from === to + 8 &&
            lastMove.to === from + 1
          ) {
            console.log("Valid en passant capture for white pawn");
            return true;
          }
        }
        return false;
  
      case 'BP': // Black Pawn
        if (toRow === fromRow + 1 && colDiff === 0 && !targetPiece) return true; // Normal forward move
        if (fromRow === 1 && toRow === 3 && colDiff === 0 && !targetPiece && !positions[to - 8]) return true; // Double move
        if (toRow === fromRow + 1 && colDiff === 1 && targetPiece?.startsWith('W')) return true; // Diagonal capture
  
        // En passant capture for black pawn
        if (fromRow === 4 && toRow === 5 && colDiff === 1 && !targetPiece) {
          if (
            lastMove &&
            lastMove.piece === 'WP' &&
            lastMove.from === to - 8 &&
            lastMove.to === from - 1
          ) {
            console.log("Valid en passant capture for black pawn");
            return true;
          }
        }
        return false;
  
      // Other pieces (rook, knight, bishop, queen, king) logic...
    }
  
    console.log("Piece type not recognized.");
    return false;
  };
  export default isValidMove;