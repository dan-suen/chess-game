
const createBoard = function (flip:boolean,positions:(string|null)[], setPositions:React.Dispatch<React.SetStateAction<(string | null)[]>>) {
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
            if (!flip){

                if ((i/8+j)%2 === 0) {
                    cell.classList.add(`blank`);
                } else {
                    cell.classList.add(`brown`);
                }
            } else {
                if ((i/8+j)%2 === 0) {
                    cell.classList.add(`brown`);
                } else {
                    cell.classList.add(`blank`);
                }
            }
            row.appendChild(cell);
        }
        target.appendChild(row);
    }
    let array = Array(64).fill(null);
    if (!flip) {
        array[0] = "BR1";
        array[1] = "BN1";
        array[2] = "BB1";
        array[3] = "BK";
        array[4] = "BQ";
        array[5] = "BB2";
        array[6] = "BN2";
        array[7] = "BR2";
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
        array[56] = "WR1";
        array[57] = "WN1";
        array[58] = "WB1";
        array[59] = "WK";
        array[60] = "WQ";
        array[61] = "WB2";
        array[62] = "WN2";
        array[63] = "WR2";
        
    } else {
        array[0] = "WR1";
        array[1] = "WN1";
        array[2] = "WB1";
        array[3] = "WK";
        array[4] = "WQ";
        array[5] = "WB2";
        array[6] = "WN2";
        array[7] = "WR2";
        array[8] = "WP1";
        array[9] = "WP2";
        array[10] = "WP3";
        array[11] = "WP4";
        array[12] = "WP5";
        array[13] = "WP6";
        array[14] = "WP7";
        array[15] = "WP8";

        

        array[48] = "BP1";        
        array[49] = "BP2";
        array[50] = "BP3";
        array[51] = "BP4";
        array[52] = "BP5";
        array[53] = "BP6";
        array[54] = "BP7";
        array[55] = "BP8";
        array[56] = "BR1";
        array[57] = "BN1";
        array[58] = "BB1";
        array[59] = "BK";
        array[60] = "BQ";
        array[61] = "BB2";
        array[62] = "BN2";
        array[63] = "BR2";
    }
    setPositions(array)
}

export default createBoard;