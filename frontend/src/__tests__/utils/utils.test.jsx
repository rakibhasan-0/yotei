/** @jest-environment jsdom */
import { USER_PERMISSION_LIST_ALL, isAdminUser } from "../../utils"
import { configure } from "@testing-library/react"
import "@testing-library/jest-dom"

/**
 * Test for utils file.
 * 
 * @author UNKNOWN, Team Mango (Grupp 4) (2024-05-22)
 * Updated 2024-05-22: changed to new isAdmin check and removed editor test
 *                     because editor do not exist anymore.
 */

configure({testIdAttribute: "id"})

describe("Authorization tests", () => {

	test("should be admin if role is 'ADMIN'", async() => {
		let adminUser = ({token: "nan", userId: 0, permissions: USER_PERMISSION_LIST_ALL, setToken: jest.fn()})
		
		expect(isAdminUser(adminUser)).toBe(true)
	})

	test("should not be admin if role is not 'ADMIN'", async() => {
		let user = ({token: "nan", userId: 0, setToken: jest.fn()})
		let editor = ({token: "nan", userId: 0, setToken: jest.fn()})

		expect(isAdminUser(user)).toBe(false)
		expect(isAdminUser(editor)).toBe(false)
	})

// Test removed because editor do not exist anymore!!!!
//	test("should be editor", async() => {
//		let editor = ({token: "nan", role: Roles.editor, userId: 0, setToken: jest.fn()})
//		let admin = ({token: "nan", role: Roles.editor, userId: 0, setToken: jest.fn()})
//		
//		expect(isEditor(editor)).toBe(true)
//		expect(isEditor(admin)).toBe(true)
//	})
//
//	test("should not be editor", async() => {
//		let user = ({token: "nan", role: Roles.other, userId: 0, setToken: jest.fn()})
//
//		expect(isEditor(user)).toBe(false)
//	})
//
//	test("should return false on 'undefined' context", async() => {
//		let user
//
//		expect(isEditor(user)).toBe(false)
//	})
//
//	test("should return false on 'null' context", async() => {
//		let user = null
//
//		expect(isEditor(user)).toBe(false)
//	})
//
//	test("should return false on 'undefined' role", async() => {
//		let user = ({token: "nan", userId: 0, setToken: jest.fn()})
//
//		expect(isEditor(user)).toBe(false)
//	})
})