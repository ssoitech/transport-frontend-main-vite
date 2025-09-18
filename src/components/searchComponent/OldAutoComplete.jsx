import React, { useCallback, useEffect, useState } from 'react';
import "./searchStyle.css";
import SuggestionList from './SuggestionList';
import { debounce } from 'lodash';
import axiosInstance from '../../config/AxiosConfig';

function OldAutoComplete({
    placeholder = "",
    url = "",
    datakey = "",
    customLoading = "Loading..",
    onSelect = () => { },
    onChange = () => { },
    onBlur = () => { },
    onFocus = () => { },
    customStyles = {}
}) {

    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState();
    const [error, setError] = useState();

    console.log(suggestions);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        onChange(event.target.value);
    }


    const getSuggestions = async (query) => {
        setError(null);
        setLoading(true);
        try {

            const URL = url + `${query}`;
            console.log(URL)
            await axiosInstance.get(URL)
                .then(function (response) {
                    // handle success
                    setSuggestions(response.data);
                })

        } catch (error) {
            setError("Faild to fetch data");
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }

    const getSuggestionsDebounced = useCallback(
        debounce(getSuggestions, 300),
        []
    );

    useEffect(() => {
        if (inputValue.length > 0) {
            getSuggestionsDebounced(inputValue);
        } else {
            setSuggestions([])
        }
    }, [inputValue])

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion.name);
        onSelect(suggestion);
        setSuggestions([]);
    }

    return (
        <div className='input-container'>
            <input
                className='form-control form-control-sm custom-border'
                type="text"
                value={inputValue}
                placeholder={placeholder}
                style={customStyles}
                onBlur={onBlur}
                onFocus={onFocus}
                onChange={handleInputChange}
            />
            {
                (suggestions.length > 0 || loading || error) &&
                <ul className='suggestions-list'>
                    {error && <div className='error'>{error}</div>}
                    {loading && <div className='loading'>{customLoading}</div>}
                    <SuggestionList

                        highlight={inputValue}
                        suggestions={suggestions}
                        onSuggestionClick={handleSuggestionClick}
                    />
                </ul>
            }

        </div>
    )
}

export default OldAutoComplete;
