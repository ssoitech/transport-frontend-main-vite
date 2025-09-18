import React, { useEffect } from 'react'

function OpenChallanHolderPageInNewTab() {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'F2') {
                window.open('http://localhost:3000/truck-owner', '_blank');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleClick = () => {
        window.open('http://localhost:3000/truck-owner', '_blank');
    }

    return (
        <div>
            <button type="button" onClick={handleClick} class="btn btn-sm btn-primary mb-3" >{"<F2>"}</button>
        </div>
    )
}

export default OpenChallanHolderPageInNewTab;
