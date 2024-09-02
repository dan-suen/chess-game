import { canCastle } from "./getHighlightIndices";

const isValidMove = (
  pieceType: string | null,
  from: number,
  to: number,
  positions: (string | null)[],
  turn: "black" | "white",
  lastMove: { from: number; to: number; piece: string } | null,
  opponentMoves: number[]
): boolean => {
  if (!pieceType) return false;

  // Normalize the piece type to ignore any numbers (e.g., WP5 -> WP)
  const normalizedPieceType = pieceType.replace(/\d+$/, ''); // Remove any numbers at the end
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

  // Piece-specific move logic
  switch (normalizedPieceType) {
    case 'WP': // White Pawn
      if (toRow === fromRow - 1 && colDiff === 0 && !targetPiece) return true; // Normal forward move
      if (fromRow === 6 && toRow === 4 && colDiff === 0 && !targetPiece && !positions[to + 8]) return true; // Double move
      if (toRow === fromRow - 1 && colDiff === 1 && targetPiece?.startsWith('B')) return true; // Diagonal capture

      // En passant capture for white pawn
      if (fromRow === 3 && toRow === 2 && colDiff === 1 && !targetPiece) {
        if (
          lastMove &&
          lastMove.piece.startsWith('BP') && // Match any black pawn (e.g., BP1, BP2, etc.)
          Math.abs(lastMove.from - lastMove.to) === 16 && // The black pawn moved two squares forward
          lastMove.to === from - 1 && // The black pawn ended up directly adjacent
          to === lastMove.to - 8 // Moving to the correct en passant square
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
          lastMove.piece.startsWith('WP') && // Match any white pawn (e.g., WP1, WP2, etc.)
          Math.abs(lastMove.from - lastMove.to) === 16 && // The white pawn moved two squares forward
          lastMove.to === from + 1 && // The white pawn ended up directly adjacent
          to === lastMove.to + 8 // Moving to the correct en passant square
        ) {
          console.log("Valid en passant capture for black pawn");
          return true;
        }
      }
      return false;

    case 'WR': // White Rook
    case 'BR': // Black Rook
      // Check if move is in a straight line and path is clear
      if (rowDiff === 0 || colDiff === 0) {
        const step = rowDiff === 0 ? (toCol > fromCol ? 1 : -1) : (toRow > fromRow ? 8 : -8);
        for (let i = from + step; i !== to; i += step) {
          if (positions[i]) return false; // Blocked by another piece
        }
        return true;
      }
      return false;

    case 'WB': // White Bishop
    case 'BB': // Black Bishop
      // Check if move is diagonal and path is clear
      if (rowDiff === colDiff) {
        const step = (toRow > fromRow ? 8 : -8) + (toCol > fromCol ? 1 : -1);
        for (let i = from + step; i !== to; i += step) {
          if (positions[i]) return false; // Blocked by another piece
        }
        return true;
      }
      return false;

    case 'WN': // White Knight
    case 'BN': // Black Knight
      // Check if move is an L-shape
      if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
        return true;
      }
      return false;

    case 'WQ': // White Queen
    case 'BQ': // Black Queen
      // Combine rook and bishop moves
      if (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) {
        const step = rowDiff === colDiff ? ((toRow > fromRow ? 8 : -8) + (toCol > fromCol ? 1 : -1)) : 
                    (rowDiff === 0 ? (toCol > fromCol ? 1 : -1) : (toRow > fromRow ? 8 : -8));
        for (let i = from + step; i !== to; i += step) {
          if (positions[i]) return false; // Blocked by another piece
        }
        return true;
      }
      return false;

    case 'WK': // White King
    case 'BK': // Black King
      // Normal king move (one square in any direction)
      if (rowDiff <= 1 && colDiff <= 1) return true;

      // Castling logic
      if (colDiff === 2 && rowDiff === 0) { // Castling is a horizontal move by 2 columns
        const isKingSideCastle = to > from;
        const rookIndex = isKingSideCastle ? (normalizedPieceType === 'WK' ? 63 : 7) : (normalizedPieceType === 'WK' ? 56 : 0);

        if (canCastle(from, rookIndex, positions, turn[0], opponentMoves)) {
          console.log(`Valid castling move for ${pieceType}`);
          return true;
        } else {
          console.log(`Invalid castling move for ${pieceType}`);
          return false;
        }
      }
      return false;

    default:
      console.log("Piece type not recognized.");
      return false;
  }
};

export default isValidMove;
