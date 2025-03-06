import React from 'react';

interface AmountInputProps {
    value: string;
    onChange: (value: string) => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({ value, onChange }) => {
    return (
        <div className="flex items-center mb-4 space-x-2">
            <label htmlFor="amount" className="w-16 text-gray-700 font-medium">Amount:</label>
            <input
                id="amount"
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter amount"
                className=" text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            />
        </div>
    );
};