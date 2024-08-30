const clickFunction = function (
    event: React.MouseEvent<SVGSVGElement>,
    turn: "black" | "white",
    setTurn: React.Dispatch<React.SetStateAction<"black" | "white">>,
    activeId: string | null,
    setActiveId: React.Dispatch<React.SetStateAction<string | null>>,
    positions: (string | null)[],
    setPositions: React.Dispatch<React.SetStateAction<(string | null)[]>>
) {
    const target = event.currentTarget;
    const parentElement = target.parentElement;
    
    if (!parentElement) {
        console.error('Parent element not found');
        return;
    }

    const grandParentElement = parentElement.parentElement;
    
    if (!grandParentElement || !grandParentElement.id) {
        console.error('Grandparent element or its ID not found');
        return;
    }
    
    const clickedIdMatch = grandParentElement.id.match(/[0-9]+/);
    if (!clickedIdMatch) {
        console.error('Failed to extract clicked ID from grandparent element');
        return;
    }
    
    const clickedId = parseInt(clickedIdMatch[0], 10);

    if (activeId) {
        const previousActiveElement = document.getElementById(activeId);
        if (previousActiveElement) {
            previousActiveElement.classList.remove('active');
        }
        
        const previousIdMatch = activeId.match(/[0-9]+/);
        if (!previousIdMatch) {
            console.error('Failed to extract previous ID from active ID');
            return;
        }
        
        const previousId = parseInt(previousIdMatch[0], 10);
        const currentSymbol = positions[previousId] || null;
        
        if (clickedId !== previousId && !target.classList.contains(turn)) {
            const newPositions = [...positions];
            newPositions[previousId] = null;
            newPositions[clickedId] = currentSymbol;
            setPositions(newPositions);
            setActiveId(null);
            setTurn(turn === "white" ? "black" : "white");
        }
    }
    const match = activeId ? activeId.match(/[0-9]+/) : null;
    const activeIdNumber = match ? parseInt(match[0], 10) : -1;
    if (clickedId !== activeIdNumber && target.classList.contains(turn)) {
        grandParentElement.classList.add('active');
        setActiveId(grandParentElement.id);
    } else {
        setActiveId(null);
    }
};

export default clickFunction;
