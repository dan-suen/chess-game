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
        
            if (!grandParentElement) {
                console.error('Grandparent element not found');
                return;
            }
        
            const clickedId = grandParentElement.id;
        
            if (activeId) {
                const previousActiveElement = document.getElementById(activeId);
                if (previousActiveElement) {
                    previousActiveElement.classList.remove('active');
                }
            }
        
            if (clickedId !== activeId && target.classList.contains(turn)) {
                grandParentElement.classList.add('active');
                setActiveId(clickedId);
            } else {
                setActiveId(null);
            }
        };


export default clickFunction;