import React from "react"
import { render, fireEvent, configure } from "@testing-library/react"
import SearchBar from "../../../../components/Common/SearchBar/SearchBar"
import "@testing-library/jest-dom"

configure({ testIdAttribute: "id" })

describe("SearchBar", () => {
	const placeholder = "Search"
	const text = "test"
	const addedTags = ["tag1", "tag2"]
	const suggestedTags = ["tag3", "tag4"]
	const onChange = jest.fn()
	const setAddedTags = jest.fn()
	const setSuggestedTags = jest.fn()


	afterEach(() => {
		jest.clearAllMocks()
	})

	test("renders without crashing", () => {
		//ARRANGE
		render(<SearchBar id="search-bar-test"
			placeholder={placeholder}
			text={text}
			addedTags={addedTags}
			suggestedTags={suggestedTags}
			onChange={onChange}
			setAddedTags={setAddedTags}
			setSuggestedTags={setSuggestedTags}
		/>)
	})

	test("renders input element with correct props", () => {
		//ARRANGE
		const { getByPlaceholderText, getByDisplayValue } = render(
			<SearchBar id="search-bar-test"
				placeholder={placeholder}
				text={text}
				addedTags={addedTags}
				suggestedTags={suggestedTags}
				onChange={onChange}
				setAddedTags={setAddedTags}
				setSuggestedTags={setSuggestedTags}
			/>
		)
		//ASSERT
		expect(getByPlaceholderText(placeholder)).toBeInTheDocument()
		expect(getByDisplayValue(text)).toBeInTheDocument()
	})

	test("calls onChange callback when input value changes", () => {
		//ARRANGE
		const { getByDisplayValue } = render(
			<SearchBar id="search-bar-test"
				placeholder={placeholder}
				text={text}
				addedTags={addedTags}
				suggestedTags={suggestedTags}
				onChange={onChange}
				setAddedTags={setAddedTags}
				setSuggestedTags={setSuggestedTags}
			/>
		)
		//ACT
		fireEvent.change(getByDisplayValue(text), { target: { value: "new value" } })
		//ASSERT
		expect(onChange).toHaveBeenCalled()
	})

	test("calls onFocus and onBlur callbacks when input is focused and blurred", () => {
		//ARRANGE
		const { getByDisplayValue, getByTestId } = render(
			<SearchBar id="search-bar-test"
				placeholder={placeholder}
				text={text}
				addedTags={addedTags}
				suggestedTags={suggestedTags}
				onChange={onChange}
				setAddedTags={setAddedTags}
				setSuggestedTags={setSuggestedTags}
			/>
		)
		const inputElement = getByDisplayValue(text)
		const inputElementContainer = getByTestId("search-bar-test")
		//ACT
		fireEvent.focus(inputElement)
		//ASSERT
		expect(inputElementContainer).toHaveClass("open")
		//ACT
		fireEvent.blur(inputElement)
		//ASSERT
		expect(inputElementContainer).not.toHaveClass("open")
	})

	test("calls handleAddTag callback when tag is added", () => {
		//ARRANGE
		const { getByText } = render(
			<SearchBar id="search-bar-test"
				placeholder={placeholder}
				text={text}
				addedTags={addedTags}
				suggestedTags={suggestedTags}
				onChange={onChange}
				setAddedTags={setAddedTags}
				setSuggestedTags={setSuggestedTags}
			/>
		)
		//ACT
		fireEvent.click(getByText(suggestedTags[0]))
		//ASSERT
		expect(setAddedTags).toHaveBeenCalledWith([...addedTags, suggestedTags[0]])
		expect(setSuggestedTags).toHaveBeenCalledWith(suggestedTags.slice(1))
	})

	test("calls handleRemoveTag callback when tag is removed", () => {
		//ARRANGE
		const { getByText } = render(
			<SearchBar id="search-bar-test"
				placeholder={placeholder}
				text={text}
				addedTags={addedTags}
				suggestedTags={suggestedTags}
				onChange={onChange}
				setAddedTags={setAddedTags}
				setSuggestedTags={setSuggestedTags}
			/>
		)
		//ACT
		fireEvent.click(getByText(addedTags[0]))
		//ASSERT
		expect(setAddedTags).toHaveBeenCalledWith(addedTags.slice(1))
		expect(setSuggestedTags).toHaveBeenCalledWith([...suggestedTags, addedTags[0]])
	})

	test("renders Tag components with correct props", () => {
		const { getByText } = render(
			<SearchBar id="search-bar-test"
				placeholder={placeholder}
				text={text}
				addedTags={addedTags}
				suggestedTags={suggestedTags}
				onChange={onChange}
				setAddedTags={setAddedTags}
				setSuggestedTags={setSuggestedTags}
			/>
		)
		addedTags.forEach(tag => {
			expect(getByText(tag)).toBeInTheDocument()
		})
		suggestedTags.forEach(tag => {
			expect(getByText(tag)).toBeInTheDocument()
		})
	})

})
