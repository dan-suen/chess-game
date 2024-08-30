const updatePositions = function (positions:(string|null)[], setPositions:React.Dispatch<React.SetStateAction<(string | null)[]>>, piece:string, oldPosition:number, newPosition:number) {
    let array:(string|null)[] = [... positions]
    array[oldPosition] = null;
    array[newPosition] = piece;
    setPositions(array)
}

export default updatePositions;