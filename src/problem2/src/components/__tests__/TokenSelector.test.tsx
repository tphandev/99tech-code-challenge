import { render, screen, fireEvent } from '@testing-library/react';
import { TokenSelector } from '../TokenSelector';
import { TokenOption } from '../../hooks/useTokenPrices';
import { describe, test, expect, vi } from 'vitest';
const mockOptions: TokenOption[] = [
    { symbol: 'ETH', icon: 'eth-icon.svg' },
    { symbol: 'BTC', icon: 'btc-icon.svg' },
    { symbol: 'USDT', icon: 'usdt-icon.svg' }
];

describe('TokenSelector', () => {
    test('renders correctly with label', () => {
        const onChange = vi.fn();
        render(
            <TokenSelector
                id="test-selector"
                label="Test"
                value=""
                onChange={onChange}
                options={mockOptions}
            />
        );

        expect(screen.getByLabelText(/test:/i)).toBeInTheDocument();
    });

    test('shows options when focused', () => {
        const onChange = vi.fn();
        render(
            <TokenSelector
                id="test-selector"
                label="Test"
                value=""
                onChange={onChange}
                options={mockOptions}
            />
        );

        const input = screen.getByLabelText(/test:/i);
        fireEvent.focus(input);

        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('BTC')).toBeInTheDocument();
        expect(screen.getByText('USDT')).toBeInTheDocument();
    });

    test('filters options based on input', () => {
        const onChange = vi.fn();
        render(
            <TokenSelector
                id="test-selector"
                label="Test"
                value=""
                onChange={onChange}
                options={mockOptions}
            />
        );

        const input = screen.getByLabelText(/test:/i);
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'BT' } });

        expect(screen.getByText('BTC')).toBeInTheDocument();
        expect(screen.queryByText('ETH')).not.toBeInTheDocument();
        expect(screen.queryByText('USDT')).not.toBeInTheDocument();
    });

    test('calls onChange when an option is selected', () => {
        const onChange = vi.fn();
        render(
            <TokenSelector
                id="test-selector"
                label="Test"
                value=""
                onChange={onChange}
                options={mockOptions}
            />
        );

        const input = screen.getByLabelText(/test:/i);
        fireEvent.focus(input);
        fireEvent.click(screen.getByText('BTC'));

        expect(onChange).toHaveBeenCalledWith('BTC');
    });

    test('displays token icons when available', () => {
        const onChange = vi.fn();
        render(
            <TokenSelector
                id="test-selector"
                label="Test"
                value=""
                onChange={onChange}
                options={mockOptions}
            />
        );

        const input = screen.getByLabelText(/test:/i);
        fireEvent.focus(input);

        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(3);
        expect(images[0]).toHaveAttribute('src', 'eth-icon.svg');
        expect(images[1]).toHaveAttribute('src', 'btc-icon.svg');
        expect(images[2]).toHaveAttribute('src', 'usdt-icon.svg');
    });
});