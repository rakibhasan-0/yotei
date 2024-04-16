/** @jest-environment jsdom */
import { isAdmin, isEditor } from "../../utils"
import { configure } from "@testing-library/react"
import { Roles } from "../../context"
import "@testing-library/jest-dom"

configure({testIdAttribute: "id"})

describe("Authorization tests", () => {

	test("should be admin if role is 'ADMIN'", async() => {
		let user = ({token: "nan", role: Roles.admin, userId: 0, setToken: jest.fn()})
		
		expect(isAdmin(user)).toBe(true)
	})

	test("should not be admin if role is not 'ADMIN'", async() => {
		let user = ({token: "nan", role: Roles.other, userId: 0, setToken: jest.fn()})
		let editor = ({token: "nan", role: Roles.editor, userId: 0, setToken: jest.fn()})

		expect(isAdmin(user)).toBe(false)
		expect(isAdmin(editor)).toBe(false)
	})

	test("should be editor", async() => {
		let editor = ({token: "nan", role: Roles.editor, userId: 0, setToken: jest.fn()})
		let admin = ({token: "nan", role: Roles.editor, userId: 0, setToken: jest.fn()})
		
		expect(isEditor(editor)).toBe(true)
		expect(isEditor(admin)).toBe(true)
	})

	test("should not be editor", async() => {
		let user = ({token: "nan", role: Roles.other, userId: 0, setToken: jest.fn()})

		expect(isEditor(user)).toBe(false)
	})

	test("should return false on 'undefined' context", async() => {
		let user

		expect(isEditor(user)).toBe(false)
	})

	test("should return false on 'null' context", async() => {
		let user = null

		expect(isEditor(user)).toBe(false)
	})

	test("should return false on 'undefined' role", async() => {
		let user = ({token: "nan", userId: 0, setToken: jest.fn()})

		expect(isEditor(user)).toBe(false)
	})
})