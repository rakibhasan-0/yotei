// TechniqueNavigation.test.js
import React from 'react'
import { screen, configure, render } from '@testing-library/react'
import TechniqueNavigation from '../../../components/Grading/TechniqueNavigation'
import "@testing-library/jest-dom"
import { act } from 'react-dom/test-utils'

configure({testIdAttribute: "id"})

describe('TechniqueNavigation component', () => {
    it('renders without crashing', () => {
        render(<TechniqueNavigation id="test-technique-navigation" />)
    })

    it('opens the popup when "Tekniker" button is clicked', () => {
        // ARRANGE
        const { rerender } = render(<TechniqueNavigation id="test-technique-navigation" />)
        // ACT
        act(() => {
            screen.getByTestId("test-technique-navigation").click()
        })
        rerender(<TechniqueNavigation id="test-technique-navigation" />)
        const popupTitle = screen.getByTestId('navigation-popup')
        // ASSERT
        expect(popupTitle).toBeInTheDocument()
    })

  {/*
    it('closes the popup when "Fortsätt till summering" button is clicked', () => {
        // ARRANGE
        const { rerender } = render(<TechniqueNavigation id="test-technique-navigation" />)    
        // ACT
        act(() => {
            screen.getByTestId("test-technique-navigation").click()
        })
        rerender(<TechniqueNavigation id="test-technique-navigation" />)

        const popupTitle = screen.getByTestId('navigation-popup')
        act(() => {
            screen.getByTestId("summering-button").click()
        })
        rerender(<TechniqueNavigation id="test-technique-navigation" />)

        expect(popupTitle).not.toBeInTheDocument()
    }) */}
  
  // Add more tests as needed for other functionalities
})