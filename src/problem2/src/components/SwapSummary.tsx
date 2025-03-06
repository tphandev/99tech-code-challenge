
import React from 'react';

interface SwapSummaryProps {
    estimatedOutput: string;
    toToken: string;
    submitting: boolean;
}

export const SwapSummary: React.FC<SwapSummaryProps> = ({
    estimatedOutput,
    toToken,
    submitting
}) => {
    return (
        <>
            {estimatedOutput && (
                <div className="text-center font-semibold mb-4 py-2 px-3 bg-blue-50 rounded-md text-blue-800">
                    Estimated Output: {estimatedOutput} {toToken}
                </div>
            )}
            <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {submitting ? 'Swapping...' : 'Swap'}
            </button>
        </>
    );
};