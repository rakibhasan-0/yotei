import React from "react"
import { render, screen, configure, fireEvent } from "@testing-library/react"
import EditableInputTextField from "../../../../components/Common/EditableInputTextField/EditableInputTextField"
import "@testing-library/jest-dom"
import { BrowserRouter } from "react-router-dom"


/**
 * Test for the editableinputtextfield component
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-21
 */

configure({testIdAttribute: "id"})

describe("Initialization", () => {
    test("Should contain initial text", () => {
        render(
            <BrowserRouter>
                <EditableInputTextField id="field" item={"Hello"} />
            </BrowserRouter>
        )
        expect(screen.getByText("Hello")).toBeInTheDocument()
    })

    test("Should have correct id", () => {
        render(
            <BrowserRouter>
                <EditableInputTextField id="editableID" />
            </BrowserRouter>
        )
        expect(screen.getByTestId("editableID")).toBeInTheDocument()
    })
})

describe("Functionality", () => {
    test("Opens edit window when clicked", () => {
        render(
            <BrowserRouter>
                <EditableInputTextField id="field" item="Hello there!"/>
            </BrowserRouter>
        )
        expect(screen.queryByTestId("edit-element")).toBeNull()
        fireEvent.click(screen.getByTestId("edit-clickable"))
        expect(screen.getByTestId("edit-element")).toBeInTheDocument()
    })

    /*test("Calls onedit on enter", () => {
        const onEditFn = jest.fn()
        const validateFn = jest.fn()
        render(
            <BrowserRouter>
                <EditableInputTextField id="field" item="Hello there!" onEdit={onEditFn} validateInput={validateFn}/>
            </BrowserRouter>
        )
        fireEvent.click(screen.getByTestId("edit-clickable"))

        const input = screen.getByTestId("edit-element")
        fireEvent.change(input, { target: { value: "New text" } })
        input.focus()
        fireEvent.keyPress(input, {key: 'Enter', code: 13, charCode: 13})

        expect(onEditFn).toHaveBeenCalled()
        expect(validateFn).toHaveBeenCalled()
    })*/
})