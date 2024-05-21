import React from "react"
import { render, screen, configure} from "@testing-library/react"
import "@testing-library/jest-dom"
import EditableListItem from "../../../components/Common/EditableListItem/EditableListItem.jsx"
import { BrowserRouter } from "react-router-dom"

/**
 * Test for the EditableListItem component.
 *
 * @author Group Granatäpple (Group 1) (2024-05-21)
 * @version 1.0
 */

test("User can be created test", async() => {
    var name = "Test 123"
	var id = 1
	var index = 0

    render(
        <BrowserRouter>
            <EditableListItem
                id={id}
                item={name}
                index={index}
            />
        </BrowserRouter>
    )
    expect(screen.getByTestId("EditableListItem")).toHaveTextContent(id, 1)
})

test("Trash icon rendered test", async() => {
    var name = "Test 123"
	var id = 1
	var index = 0
    
    render(
        <BrowserRouter>
            <EditableListItem
                id={id}
                item={name}
                index={index}
                showTrash={true}
            />
        </BrowserRouter>
    )
    expect(screen.getByTestId("trash-icon")).toBeInTheDocument()
})
