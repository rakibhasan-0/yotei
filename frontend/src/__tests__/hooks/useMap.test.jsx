import useMap from "../../hooks/useMap"
import { renderHook, act } from "@testing-library/react"

/**
 * Test suite for useMap hook
 *
 * @author Team Kraken (Hamza Budeir)
 * @updated 2020-12-02
 */

describe("useMap", () => {
	test("should initialize the map with the given entries", () => {
		const { result } = renderHook(() =>
			useMap([
				["a", 1],
				["b", 2],
			]),
		)
		expect(result.current[0].size).toBe(2)
		expect(result.current[0].get("a")).toBe(1)
		expect(result.current[0].get("b")).toBe(2)
	})

	test("should insert a new entry into the map", () => {
		const { result } = renderHook(() => useMap())
		act(() => {
			result.current[1].insert("a", 1)
		})
		expect(result.current[0].size).toBe(1)
		expect(result.current[0].get("a")).toBe(1)
	})

	test("should overwrite the value if the key already exists", () => {
		const { result } = renderHook(() => useMap([["a", 1]]))
		act(() => {
			result.current[1].insert("a", 2)
		})
		expect(result.current[0].size).toBe(1)
		expect(result.current[0].get("a")).toBe(2)
	})

	test("should lookup a value in the map by key", () => {
		const { result } = renderHook(() => useMap([["a", 1]]))
		const value = result.current[1].lookup("a")
		expect(value).toBe(1)
	})

	test("should return undefined if the key does not exist", () => {
		const { result } = renderHook(() => useMap())
		const value = result.current[1].lookup("a")
		expect(value).toBe(undefined)
	})

	test("should get the size of the map", () => {
		const { result } = renderHook(() =>
			useMap([
				["a", 1],
				["b", 2],
			]),
		)
		const size = result.current[1].mapSize()
		expect(size).toBe(2)
	})

	test("should delete an entry from the map by key", () => {
		const { result } = renderHook(() => useMap([["a", 1]]))
		act(() => {
			result.current[1].delete("a")
		})
		expect(result.current[0].size).toBe(0)
		expect(result.current[0].get("a")).toBe(undefined)
	})

	test("should clear the map", () => {
		const { result } = renderHook(() =>
			useMap([
				["a", 1],
				["b", 2],
			]),
		)
		act(() => {
			result.current[1].clear()
		})
		expect(result.current[0].size).toBe(0)
		expect(result.current[0].get("a")).toBe(undefined)
		expect(result.current[0].get("b")).toBe(undefined)
	})
})
