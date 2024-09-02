const updateSentence = function (turn:"black" | "white" ) {
    let target = document.getElementById("turnDisplay");
    if (target === null) {
        console.error('Target element not found');
        return;
    }
    if (target) {
        target.innerHTML = '';
    }
    if (turn === "white"){
        target.innerText = "It's White's turn..."
    } else {
        target.innerText = "It's Black's turn..."
    }
}

export default updateSentence;