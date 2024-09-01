import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";
import { canCastle } from "./getHighlightIndices";
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

  // Piece-specific move logic
  //console.log(normalizedPieceType)
  switch (normalizedPieceType) {
    case 'WP': // White Pawn
    if (toRow === fromRow - 1 && colDiff === 0 && !targetPiece) return true; // Normal forward move
    if (fromRow === 6 && toRow === 4 && colDiff === 0 && !targetPiece && !positions[to + 8]) return true; // Double move
    if (toRow === fromRow - 1 && colDiff === 1 && targetPiece?.startsWith('B')) return true; // Diagonal capture

    // En passant capture for white pawn
    if (fromRow === 3 && toRow === 2 && colDiff === 1 && !targetPiece) {
      console.log("Checking en passant conditions for white pawn.");
      if (
        lastMove &&
        lastMove.piece.startsWith('BP') && // Match any black pawn (e.g., BP1, BP2, etc.)
        Math.abs(lastMove.from - lastMove.to) === 16 && // The black pawn moved two squares forward
        lastMove.to === from - 1 && // The black pawn ended up directly adjacent
        to === lastMove.to - 8 // Moving to the correct en passant square
      ) {
        console.log("Valid en passant capture for white pawn");
        return true;
      } else {
        console.log("Invalid en passant capture for white pawn: conditions not met.");
      }
    }
    return false;

  case 'BP': // Black Pawn
    if (toRow === fromRow + 1 && colDiff === 0 && !targetPiece) return true; // Normal forward move
    if (fromRow === 1 && toRow === 3 && colDiff === 0 && !targetPiece && !positions[to - 8]) return true; // Double move
    if (toRow === fromRow + 1 && colDiff === 1 && targetPiece?.startsWith('W')) return true; // Diagonal capture

    // En passant capture for black pawn
    if (fromRow === 4 && toRow === 5 && colDiff === 1 && !targetPiece) {
      console.log("Checking en passant conditions for black pawn.");
      if (lastMove) {
        console.log("En passant check for black pawn:");
        console.log("lastMove.piece.startsWith('WP'):", lastMove.piece.startsWith('WP'));
        console.log("Moved two squares forward:", Math.abs(lastMove.from - lastMove.to) === 16);
        console.log("Ended up directly adjacent:", lastMove.to === from + 1);
        console.log("Moving to correct en passant square:", to === lastMove.to + 8);
      }
      
      if (
        lastMove &&
        lastMove.piece.startsWith('WP') && // Match any white pawn (e.g., WP1, WP2, etc.)
        Math.abs(lastMove.from - lastMove.to) === 16 && // The white pawn moved two squares forward
        lastMove.to === from + 1 && // The white pawn ended up directly adjacent
        to === lastMove.to + 8 // Moving to the correct en passant square
      ) {
        console.log("Valid en passant capture for black pawn");
        return true;
      } else {
        console.log("Invalid en passant capture for black pawn: conditions not met.");
      }
    }
    return false;

    case 'WK': // White King
    case 'BK': // Black King
      // Normal king move (one square in any direction)
      if (rowDiff <= 1 && colDiff <= 1) return true;

      // Castling logic
      if (colDiff === 2 && rowDiff === 0) { // Castling is a horizontal move by 2 columns
        const isKingSideCastle = to > from;
        const rookIndex = isKingSideCastle ? (normalizedPieceType === 'WK' ? 7 : 63) : (normalizedPieceType === 'WK' ? 0 : 56);

        if (canCastle(from, rookIndex, positions, turn[0])) {
          console.log(`Valid castling move for ${pieceType}`);
          return true;
        } else {
          console.log(`Invalid castling move for ${pieceType}`);
          return false;
        }
      }
      return false;

    case 'WR': // White Rook
    case 'BR': // Black Rook
      // Rook moves in straight lines (either row or column)
      if (rowDiff === 0 || colDiff === 0) {
        // Check for any pieces in between
        const step = rowDiff === 0 ? (toCol > fromCol ? 1 : -1) : (toRow > fromRow ? 8 : -8);
        for (let i = from + step; i !== to; i += step) {
          if (positions[i]) {
            console.log("Invalid rook move: path is blocked.");
            return false;
          }
        }
        return true;
      }
      return false;

    case 'WN': // White Knight
    case 'BN': // Black Knight
      // Knight moves in L-shape: 2 squares in one direction and 1 in the perpendicular direction
      if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) return true;
      return false;

      case 'WB': // White Bishop
      case 'BB': // Black Bishop
        // Bishop moves diagonally (same row and column difference)
        if (rowDiff === colDiff) {
          console.log(`Checking bishop diagonal move from ${from} to ${to}`);
          // Determine step direction based on from and to positions
          const step = (to > from) ? (toCol > fromCol ? 9 : 7) : (toCol > fromCol ? -7 : -9);
      
          for (let i = from + step; i !== to; i += step) {
            if (positions[i]) {
              console.log("Invalid bishop move: path is blocked at index", i);
              return false;
            }
          }
          return true;
        }
        return false;

    case 'WQ': // White Queen
    case 'BQ': // Black Queen
      // Queen moves like both a rook and a bishop
      if (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) {
        // Check for any pieces in between
        const step = rowDiff === colDiff
          ? (to > from ? 9 : -9) // Diagonal moves
          : (rowDiff === 0 ? (toCol > fromCol ? 1 : -1) : (toRow > fromRow ? 8 : -8)); // Straight moves

        for (let i = from + step; i !== to; i += step) {
          if (positions[i]) {
            console.log("Invalid queen move: path is blocked.");
            return false;
          }
        }
        return true;
      }
      return false;

    default:
      console.log("Piece type not recognized.");
      return false;
  }
};

export default isValidMove;

