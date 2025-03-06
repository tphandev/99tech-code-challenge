import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import CurrencySwapForm from '../CurrencySwapForm';
import { useTokenPrices } from '../../hooks/useTokenPrices';
import { describe, test, expect, vi, beforeEach, } from 'vitest';

// Mock the custom hook
vi.mock('../../hooks/useTokenPrices', () => ({
    useTokenPrices: vi.fn(),
}));

describe('CurrencySwapForm', () => {
    const mockPrices = {
        'BTC': 50000,
        'ETH': 2000,
        'USDT': 1
    };

    const mockTokenOptions = [
        { symbol: 'BTC', icon: 'btc-icon.svg' },
        { symbol: 'ETH', icon: 'eth-icon.svg' },
        { symbol: 'USDT', icon: 'usdt-icon.svg' }
    ];

    beforeEach(() => {
        // Reset all mocks
        vi.resetAllMocks();

        // Default mock implementation
        vi.mocked(useTokenPrices).mockReturnValue({
            prices: mockPrices,
            tokenOptions: mockTokenOptions,
            loading: false,
            error: null
        });
    });

    test('renders loading state', () => {
        vi.mocked(useTokenPrices).mockReturnValue({
            prices: {},
            tokenOptions: [],
            loading: true,
            error: null
        });

        render(<CurrencySwapForm />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    test('renders error state', () => {
        vi.mocked(useTokenPrices).mockReturnValue({
            prices: {},
            tokenOptions: [],
            loading: false,
            error: 'Failed to load token prices'
        });

        render(<CurrencySwapForm />);
        expect(screen.getByText('Failed to load token prices')).toBeInTheDocument();
    });

    test('renders form with proper elements', () => {
        render(<CurrencySwapForm />);

        expect(screen.getByRole('heading')).toHaveTextContent('Currency Swap');
        expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /swap/i })).toBeInTheDocument();
    });

    // test('handles swapping tokens', () => {
    //     render(<CurrencySwapForm />);

    //     // Select from token
    //     fireEvent.change(screen.getByLabelText(/from/i), { target: { value: 'BTC' } });

    //     // Select to token
    //     fireEvent.change(screen.getByLabelText(/to/i), { target: { value: 'ETH' } });

    //     // Click the swap button
    //     const swapButton = screen.getByRole('button', { name: '' });
    //     fireEvent.click(swapButton);

    //     // Check if the tokens were swapped
    //     expect(screen.getByLabelText(/from/i)).toHaveValue('ETH');
    //     expect(screen.getByLabelText(/to/i)).toHaveValue('BTC');
    // });

    test('calculates estimated output correctly', () => {
        render(<CurrencySwapForm />);

        // Select from token (BTC at 50000)
        fireEvent.change(screen.getByLabelText(/from/i), { target: { value: 'BTC' } });

        // Select to token (ETH at 2000)
        fireEvent.change(screen.getByLabelText(/to/i), { target: { value: 'ETH' } });

        // Enter amount
        fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '1' } });

        // Check estimated output (1 BTC = 25 ETH because 50000/2000 = 25)
        expect(screen.getByText(/estimated output:/i)).toHaveTextContent('25.0000 ETH');
    });

    test('shows validation errors when submitting with missing fields', async () => {
        render(<CurrencySwapForm />);

        // Submit with all fields empty
        fireEvent.click(screen.getByRole('button', { name: /swap/i }));

        // Check for error message
        expect(screen.getByText('Please select both tokens.')).toBeInTheDocument();

        // Set only from token
        fireEvent.change(screen.getByLabelText(/from/i), { target: { value: 'BTC' } });
        fireEvent.click(screen.getByRole('button', { name: /swap/i }));

        // Check for error message
        expect(screen.getByText('Please select both tokens.')).toBeInTheDocument();

        // Set same token for both fields
        fireEvent.change(screen.getByLabelText(/to/i), { target: { value: 'BTC' } });
        fireEvent.click(screen.getByRole('button', { name: /swap/i }));

        // Check for error message
        expect(screen.getByText('Please choose two different tokens.')).toBeInTheDocument();

        // Set different token but no amount
        fireEvent.change(screen.getByLabelText(/to/i), { target: { value: 'ETH' } });
        fireEvent.click(screen.getByRole('button', { name: /swap/i }));

        // Check for error message
        expect(screen.getByText('Please enter a valid amount.')).toBeInTheDocument();

        // Set invalid amount
        fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '-5' } });
        fireEvent.click(screen.getByRole('button', { name: /swap/i }));

        // Check for error message
        expect(screen.getByText('Please enter a valid amount.')).toBeInTheDocument();
    });

    test('shows success message after successful form submission', async () => {
        render(<CurrencySwapForm />);

        // Fill the form
        fireEvent.change(screen.getByLabelText(/from/i), { target: { value: 'BTC' } });
        fireEvent.change(screen.getByLabelText(/to/i), { target: { value: 'ETH' } });
        fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '1' } });

        // Submit form
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /swap/i }));
        });

        await waitFor(() => {
            expect(screen.getByText(/swapped 1 btc to ~25.0000 eth/i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});