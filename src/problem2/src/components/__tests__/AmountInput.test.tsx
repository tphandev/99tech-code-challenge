import { render, screen, fireEvent } from '@testing-library/react';
import { AmountInput } from '../AmountInput';
import { describe, test, expect, vi } from 'vitest';

describe('AmountInput', () => {
    test('renders with label', () => {
        const onChange = vi.fn();
        render(<AmountInput value="" onChange={onChange} />);

        expect(screen.getByLabelText(/amount:/i)).toBeInTheDocument();
    });

    test('displays the correct value', () => {
        const onChange = vi.fn();
        render(<AmountInput value="123.45" onChange={onChange} />);

        const input = screen.getByLabelText(/amount:/i) as HTMLInputElement;
        expect(input.value).toBe('123.45');
    });

    test('calls onChange when input value changes', () => {
        const onChange = vi.fn();
        render(<AmountInput value="" onChange={onChange} />);

        const input = screen.getByLabelText(/amount:/i);
        fireEvent.change(input, { target: { value: '50' } });

        expect(onChange).toHaveBeenCalledWith('50');
    });

    test('input has number type', () => {
        const onChange = vi.fn();
        render(<AmountInput value="" onChange={onChange} />);

        const input = screen.getByLabelText(/amount:/i);
        expect(input).toHaveAttribute('type', 'number');
    });

    test('input has placeholder text', () => {
        const onChange = vi.fn();
        render(<AmountInput value="" onChange={onChange} />);

        const input = screen.getByLabelText(/amount:/i);
        expect(input).toHaveAttribute('placeholder', 'Enter amount');
    });

    test('input has correct styling classes', () => {
        const onChange = vi.fn();
        render(<AmountInput value="" onChange={onChange} />);

        const input = screen.getByLabelText(/amount:/i);
        expect(input).toHaveClass('text-gray-700');
        expect(input).toHaveClass('p-2');
        expect(input).toHaveClass('border');
        expect(input).toHaveClass('border-gray-300');
        expect(input).toHaveClass('rounded-md');
        expect(input).toHaveClass('flex-1');
    });
});