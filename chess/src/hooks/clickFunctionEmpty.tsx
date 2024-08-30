const clickFunctionEmpty = function (
    event: React.MouseEvent<SVGSVGElement>,
    turn: "black" | "white",
    setTurn: React.Dispatch<React.SetStateAction<"black" | "white">>,
    activeId: string | null,
    setActiveId: React.Dispatch<React.SetStateAction<string | null>>,
    positions: (string | null)[],
    setPositions: React.Dispatch<React.SetStateAction<(string | null)[]>>
) {
    if (activeId) {
        const target = document.getElementById(activeId);
        if (target) {
            const parentElement = event.currentTarget.parentElement?.parentElement;

    
            if (!parentElement || !parentElement.id) {
                console.error('Parent element or its ID not found.');
                return;
            }

            const currentIdMatch = parentElement.id.match(/[0-9]+/);
            if (!currentIdMatch) {
                console.error('Failed to extract current ID from parent element.');
                return;
            }
            const currentId = parseInt(currentIdMatch[0], 10);

            const previousIdMatch = activeId.match(/[0-9]+/);
            if (!previousIdMatch) {
                console.error('Failed to extract previous ID from active ID.');
                return;
            }
            const previousId = parseInt(previousIdMatch[0], 10);

 
            const currentSymbol = positions[previousId] || null;

   
            const newPositions = [...positions];
            newPositions[currentId] = currentSymbol;
            newPositions[previousId] = null;


            setPositions(newPositions);
            setActiveId(null);
            const previousActiveElement = document.getElementById(activeId);
            if (previousActiveElement) {
                previousActiveElement.classList.remove('active');
            }
            setTurn(turn === "white" ? "black" : "white");
        } else {
            console.error('Target element not found.');
        }
    } else {
        console.error('No active ID to process.');
    }
};

export default clickFunctionEmpty;
