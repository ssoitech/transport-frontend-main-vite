import React, { useCallback, useEffect, useState } from 'react';
import "./searchStyle.css";
import SuggestionList from './SuggestionList';
import { debounce } from 'lodash';
import axiosInstance from '../../config/AxiosConfig';

function AutoComplete({
    placeholder = "",
    url = "",
    datakey = "name",
    customLoading = "Loading...",
    onSelect = () => { },
    onChange = () => { },
    onBlur = () => { },
    onFocus = () => { },
    customStyles = {}
}) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(false);
    const [isFocused, setIsFocused] = useState(false); // ✅ Track input focus

    console.log("Suggestions:", suggestions);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        setSelected(false); // ✅ Reset selected state when user types
        onChange(value);
    };

    const getSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const response = await axiosInstance.get(`${url}${query}`);
            setSuggestions(response.data.length ? response.data : []);
        } catch (error) {
            setError("Failed to fetch data");
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const getSuggestionsDebounced = useCallback(debounce(getSuggestions, 300), []);

    useEffect(() => {
        if (inputValue.length > 0 && !selected) {
            getSuggestionsDebounced(inputValue);
        } else if (inputValue.length === 0) {
            setSuggestions([]); // ✅ Clear suggestions only if input is empty
        }
    }, [inputValue, selected]);

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion[datakey] || ""); // ✅ Set input value to selected suggestion
        setSelected(true);
        setSuggestions([]); // ✅ Hide suggestions after selection
        onSelect(suggestion);
    };

    return (
        <div className='input-container' style={{ position: "relative" }}>
            <input
                className='form-control form-control-sm custom-border'
                type="search"
                value={inputValue}
                placeholder={placeholder}
                style={customStyles}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // ✅ Delay to allow click event to register
                onChange={handleInputChange}
            />
            {
                (isFocused && (suggestions.length > 0 || loading || error)) && (
                    <ul className='suggestions-list'>
                        {error && <div className='error'>{error}</div>}
                        {loading && <div className='loading'>{customLoading}</div>}
                        {suggestions.length > 0 ? (
                            <SuggestionList
                                highlight={inputValue}
                                suggestions={suggestions}
                                dataKey={datakey}
                                onSuggestionClick={handleSuggestionClick}
                            />
                        ) : (
                            !loading && <div className="no-results">No results found</div>
                        )}
                    </ul>
                )
            }
        </div>
    );
}

export default AutoComplete;
