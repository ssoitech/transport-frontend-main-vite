import React from 'react';
import "./searchStyle.css";

// function SuggestionList({
//     suggestions = [],
//     highlight,
//     dataKey,
//     onSuggestionClick
// }) {
//     return (
//         <React.Fragment>
//             {suggestions.map((suggestion, index) => {
//                 return (
//                     <li
//                         key={index}
//                         onClick={() => { onSuggestionClick(suggestion) }}
//                         className='suggestion-item'

//                     >
//                         {suggestion.name}

//                     </li>
//                 )
//             })}
//         </React.Fragment>
//     )
// }

// export default SuggestionList;





function SuggestionList({
    suggestions = [],
    highlight,
    dataKey,
    onSuggestionClick
}) {
    return (
        <React.Fragment>
            {suggestions.map((suggestion, index) => {
                return (
                    <li
                        key={index}
                        onMouseDown={() => onSuggestionClick(suggestion)} // ✅ Use onMouseDown instead of onClick
                        className='suggestion-item'
                    >
                        {suggestion[dataKey]} {/* ✅ Use dataKey dynamically */}
                    </li>
                );
            })}
        </React.Fragment>
    );
}

export default SuggestionList;



