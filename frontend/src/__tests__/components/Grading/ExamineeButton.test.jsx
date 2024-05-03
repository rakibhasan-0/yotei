/** @jest-environment jsdom */
import React from 'react'
import { render, configure, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import ExamineeButton from "../../../components/Grading/ExamineeButton"
/**
 * Tests for the examinee pass/fail button that should be used during grading.
 * 
 * @author Apelsin
 * @since 2024-05-03
 * @version 1.0 
 */

configure({testIdAttribute: "id"})

describe('ExamineeButton', () => {
    it('renders the button with the correct text', () => {
        const { getByText } = render(<ExamineeButton>Test Button</ExamineeButton>);
        expect(getByText('Test Button')).toBeInTheDocument();
    });

    it('calls onClick prop when clicked', () => {
        const handleClick = jest.fn();
        const { getByText } = render(<ExamineeButton onClick={handleClick}>Click Me</ExamineeButton>);
        fireEvent.click(getByText('Click Me'));
        expect(handleClick).toHaveBeenCalled();
    });

    it('applies the correct width style', () => {
        const { getByText } = render(<ExamineeButton width="50%">Width Test</ExamineeButton>);
        expect(getByText('Width Test')).toHaveStyle({ width: '50%' });
    });
});
