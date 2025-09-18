import React from 'react';

// Helper function to generate pagination pages starting with page 0
const getPaginationPages = (totalPages, currentPage) => {
    const pageLimit = 5; // Number of visible pages
    let pages = [];

    // Always show the first page (starting with 0)
    pages.push(0);

    if (currentPage > pageLimit) {
        pages.push('...');
    }

    // Pages around the current page
    let startPage = Math.max(currentPage - 2, 1); // Start from 1, as 0 is already included
    let endPage = Math.min(currentPage + 2, totalPages - 2); // Subtract 2 for 0-based index

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (currentPage < totalPages - pageLimit) {
        pages.push('...');
    }

    // Always show the last page (totalPages - 1)
    if (totalPages > 1) {
        pages.push(totalPages - 1);
    }

    return pages;
};

const PaginationComponent = ({ totalPages, currentPage, onPageChange }) => {
    const paginationPages = getPaginationPages(totalPages, currentPage);

    return (
        <ul className="pagination">
            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(0)} disabled={currentPage === 0}>
                    First
                </button>
            </li>
            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>
                    Prev
                </button>
            </li>

            {paginationPages.map((page, index) => (
                <li
                    key={index}
                    className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
                >
                    <button className="page-link" onClick={() => page !== '...' && onPageChange(page)}>
                        {page}
                    </button>
                </li>
            ))}

            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
                    Next
                </button>
            </li>
            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(totalPages - 1)} disabled={currentPage === totalPages - 1}>
                    Last
                </button>
            </li>
        </ul>
    );
};

export default PaginationComponent;
