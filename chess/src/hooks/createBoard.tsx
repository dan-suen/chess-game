
const createBoard = function (positions:(string|null)[], setPositions:React.Dispatch<React.SetStateAction<(string | null)[]>>) {
    let target = document.getElementById("chessboard");
    if (target === null) {
        console.error('Target element not found');
        return;
    }
    if (target) {
        target.innerHTML = '';
    }
    for (let i= 0 ; i< positions.length; i += 8 ) {
        let row = document.createElement('tr');
        for (let j = 0; j < 8; j ++) {
            let cell = document.createElement('th');
            cell.setAttribute("id", `cell-${i+j}`);
                if ((i/8+j)%2 === 0) {
                    cell.classList.add(`blank`);
                } else {
                    cell.classList.add(`brown`);
                }
            row.appendChild(cell);
        }
        target.appendChild(row);
    }
    let array = Array(64).fill(null);
        array[0] = "BR1";  // Black Rook on a8
        array[1] = "BN1";  // Black Knight on b8
        array[2] = "BB1";  // Black Bishop on c8
        array[3] = "BQ";   // Black Queen on d8 (corrected)
        array[4] = "BK";   // Black King on e8 (corrected)
        array[5] = "BB2";  // Black Bishop on f8
        array[6] = "BN2";  // Black Knight on g8
        array[7] = "BR2";  // Black Rook on h8
        array[8] = "BP1";
        array[9] = "BP2";
        array[10] = "BP3";
        array[11] = "BP4";
        array[12] = "BP5";
        array[13] = "BP6";
        array[14] = "BP7";
        array[15] = "BP8";

        

        array[48] = "WP1";        
        array[49] = "WP2";
        array[50] = "WP3";
        array[51] = "WP4";
        array[52] = "WP5";
        array[53] = "WP6";
        array[54] = "WP7";
        array[55] = "WP8";
        array[56] = "WR1"; // White Rook on a1
        array[57] = "WN1"; // White Knight on b1
        array[58] = "WB1"; // White Bishop on c1
        array[59] = "WQ";  // White Queen on d1 (corrected)
        array[60] = "WK";  // White King on e1 (corrected)
        array[61] = "WB2"; // White Bishop on f1
        array[62] = "WN2"; // White Knight on g1
        array[63] = "WR2"; // White Rook on h1
    setPositions(array)
}

export default createBoard;