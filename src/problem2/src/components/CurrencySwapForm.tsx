import React, { useState, useMemo } from 'react';
import { useTokenPrices } from '../hooks/useTokenPrices';
import { TokenSelector } from './TokenSelector';
import { AmountInput } from './AmountInput';
import { SwapSummary } from './SwapSummary';

const CurrencySwapForm: React.FC = () => {
    const { prices, tokenOptions, loading, error: priceError } = useTokenPrices();

    const [fromToken, setFromToken] = useState<string>('');
    const [toToken, setToToken] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');

    const estimatedOutput = useMemo(() => {
        if (!fromToken || !toToken || !amount) return '';

        const input = Number(amount);
        if (isNaN(input) || input <= 0) return '';

        const fromPrice = prices[fromToken];
        const toPrice = prices[toToken];

        if (!fromPrice || !toPrice) return '';

        const rate = fromPrice / toPrice;

        return (input * rate).toFixed(4);
    }, [fromToken, toToken, amount, prices]);

    const handleSwapTokens = () => {
        setFromToken(toToken);
        setToToken(fromToken);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!fromToken || !toToken) {
            setError('Please select both tokens.');
            return;
        }
        if (fromToken === toToken) {
            setError('Please choose two different tokens.');
            return;
        }
        const input = Number(amount);
        if (isNaN(input) || input <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        // Simulate a network request on swap submit
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSuccessMessage(`Swapped ${amount} ${fromToken} to ~${estimatedOutput} ${toToken}`);
        }, 2000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" role="status"></div>
            </div>
        );
    }

    if (priceError) {
        return <div className="text-red-600 text-center p-4">{priceError}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="w-sm lg:w-lg mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl text-center mb-6 text-gray-800 font-bold">Currency Swap</h2>

            {error && <div className="text-center mb-4 text-red-600 bg-red-50 p-2 rounded-md">{error}</div>}
            {successMessage && <div className="text-center mb-4 text-green-600 bg-green-50 p-2 rounded-md">{successMessage}</div>}

            <TokenSelector
                id="fromToken"
                label="From"
                value={fromToken}
                onChange={setFromToken}
                options={tokenOptions}
            />
            {fromToken && prices[fromToken] && (
                <div className="text-sm text-gray-500 mt-1 ml-18">
                    Price: {prices[fromToken]}
                </div>
            )}

            <div className="flex justify-center my-2">
                <button
                    name="btn-swap-tokens"
                    type="button"
                    onClick={handleSwapTokens}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                </button>
            </div>

            <TokenSelector
                id="toToken"
                label="To"
                value={toToken}
                onChange={setToToken}
                options={tokenOptions}
            />
            {toToken && prices[toToken] && (
                <div className="text-sm text-gray-500 mt-1 ml-18 mb-4">
                    Price: {prices[toToken]}
                </div>
            )}

            <AmountInput value={amount} onChange={setAmount} />

            <SwapSummary
                estimatedOutput={estimatedOutput}
                toToken={toToken}
                submitting={submitting}
            />
        </form>
    );
};

export default CurrencySwapForm;