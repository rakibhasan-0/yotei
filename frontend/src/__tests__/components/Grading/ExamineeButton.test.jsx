/** @jest-environment jsdom */
import React from 'react'
import { render, screen, configure, fireEvent, act } from "@testing-library/react"
import "@testing-library/jest-dom"
import ExamineeButton from "../../../components/Grading/ExamineeButton"
import styles from "../../../components/Grading/EcamineeButton.module.css"
/**
 * Tests for the examinee pass/fail button that should be used during grading.
 * 
 * @author Apelsin
 * @since 2024-05-02
 * @version 1.0 
 */

configure({testIdAttribute: "id"})

test('ExamineeButton: Should change color on click', () => {
    const { container } = render(<ExamineeButton id="testButton" type="green"></ExamineeButton>)
    expect(container.firstChild).toHaveClass(styles.buttonDefault)
})

test('ExamineeButton: Should call onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(
        <ExamineeButton 
            id="testButton" 
            type="green" 
            onClick={handleClick}
        ></ExamineeButton>
    )
    // ACT
    act(() => {
        screen.getByTestId("testButton").click()
    })

    // ASSERT
    expect(handleClick).toHaveBeenCalledTimes(1)
})

  


