import React from 'react';

const DynamicTable = ({ data, headerMapping }) => {
    const headers = Object.keys(headerMapping);

    return (
        <table className="table table-bordered">
            <thead className="table-dark">
                <tr className='text-center'>
                    {headers.map((key, index) => (
                        <th key={index} className='p-1'>{headerMapping[key]}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? data.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                        {headers.map((key, colIndex) => (
                            <td key={colIndex} className='p-1'>{item[key]}</td>
                        ))}
                    </tr>
                )) : <tr><td colSpan={headers.length} className='text-center'>No Records to Display.</td></tr>}
            </tbody>
        </table>
    );
};

export default DynamicTable;
