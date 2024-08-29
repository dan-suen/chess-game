import React from "react";

const createBoard = function (positions:(string|null)[], flip:boolean) {
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
            cell.classList.add(`${i+j}`);
            if (!flip){

                if ((i/8+j)%2 === 0) {
                    cell.classList.add(`white`);
                } else {
                    cell.classList.add(`brown`);
                }
            } else {
                if ((i/8+j)%2 === 0) {
                    cell.classList.add(`brown`);
                } else {
                    cell.classList.add(`white`);
                }
            }
            row.appendChild(cell);
        }
        target.appendChild(row);
    }
}

export default createBoard;