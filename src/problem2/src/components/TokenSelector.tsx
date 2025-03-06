import React, { useState } from 'react';
import { TokenOption } from '../hooks/useTokenPrices';

interface TokenSelectorProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: TokenOption[];
    id: string;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
    label,
    value,
    onChange,
    options,
    id,
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredOptions = options.filter(token =>
        token.symbol.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleSelect = (symbol: string) => {
        setInputValue(symbol);
        onChange(symbol);
        setShowSuggestions(false);
    };

    return (
        <div className="flex flex-row items-center space-x-2">
            <label htmlFor={id} className="mb-1 w-16 text-gray-700 font-medium">{label}:</label>
            <div className="relative flex-1">
                <input
                    id={id}
                    value={inputValue}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
                {showSuggestions && filteredOptions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                        {filteredOptions.map(token => (
                            <li
                                key={`${id}-${token.symbol}`}
                                onClick={() => handleSelect(token.symbol)}
                                className="flex items-center p-2 hover:bg-blue-100 cursor-pointer"
                            >
                                <img
                                    src={token.icon}
                                    alt={token.symbol}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    className="w-6 h-6 mr-2"
                                />
                                {token.symbol}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};