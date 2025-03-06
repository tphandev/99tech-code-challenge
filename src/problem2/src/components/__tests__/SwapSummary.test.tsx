import { render, screen } from '@testing-library/react';
import { SwapSummary } from '../SwapSummary';
import { describe, test, expect } from 'vitest';

describe('SwapSummary', () => {
    test('displays estimated output when available', () => {
        render(
            <SwapSummary
                estimatedOutput="123.45"
                toToken="ETH"
                submitting={false}
            />
        );

        expect(screen.getByText(/estimated output:/i)).toBeInTheDocument();
        expect(screen.getByText(/123.45 ETH/i)).toBeInTheDocument();
    });

    test('does not display estimated output when not available', () => {
        render(
            <SwapSummary
                estimatedOutput=""
                toToken="ETH"
                submitting={false}
            />
        );

        expect(screen.queryByText(/estimated output:/i)).not.toBeInTheDocument();
    });

    test('shows "Swap" text when not submitting', () => {
        render(
            <SwapSummary
                estimatedOutput="123.45"
                toToken="ETH"
                submitting={false}
            />
        );

        expect(screen.getByRole('button')).toHaveTextContent('Swap');
    });

    test('shows "Swapping..." text when submitting', () => {
        render(
            <SwapSummary
                estimatedOutput="123.45"
                toToken="ETH"
                submitting={true}
            />
        );

        expect(screen.getByRole('button')).toHaveTextContent('Swapping...');
    });

    test('button is disabled when submitting', () => {
        render(
            <SwapSummary
                estimatedOutput="123.45"
                toToken="ETH"
                submitting={true}
            />
        );

        expect(screen.getByRole('button')).toBeDisabled();
    });

    test('button is enabled when not submitting', () => {
        render(
            <SwapSummary
                estimatedOutput="123.45"
                toToken="ETH"
                submitting={false}
            />
        );

        expect(screen.getByRole('button')).not.toBeDisabled();
    });

    test('button has correct styling classes', () => {
        render(
            <SwapSummary
                estimatedOutput="123.45"
                toToken="ETH"
                submitting={false}
            />
        );

        const button = screen.getByRole('button');
        expect(button).toHaveClass('w-full');
        expect(button).toHaveClass('bg-blue-600');
        expect(button).toHaveClass('text-white');
        expect(button).toHaveClass('font-bold');
        expect(button).toHaveClass('rounded-md');
    });
});