import { useCallback, useMemo, useState } from "react"

/**
 * This module implements a hook for managing a Map. It returns a tuple
 * containing the Map and an object with actions for managing the Map.
 * The actions are memoized.
 * 
 * @module useMap
 * @author Kraken (Hamza Budeir)
 * @updated 2020-12-02
 */

/**
 * @template K, V
 * @typedef {(Map<K, V> | [K, V][])} MapOrEntries
 */

/**
 * @template K, V
 * @typedef {{
 *   lookup: (key: K) => V | undefined,
 *   delete: (keyToRemove: K) => void,
 *   insert: (key: K, value: V) => void,
 *   clear: () => void,
 *   initialize: (pairsOrMap: MapOrEntries<K, V>) => void,
 * }} UseMapActions
 */

/**
 * @template K, V
 * @typedef {[Map<K, V>, UseMapActions<K, V>]} UseMap
 */


/**
 * @template K, V
 * @param {MapOrEntries<K, V>} [initialState=new Map()]
 * @returns {UseMap<K, V>}
 */
function useMap(initialState = new Map()) {
	const [map, setMap] = useState(
		Array.isArray(initialState) ? new Map(initialState) : initialState,
	)

	/**
	 * Initialize the map with the given entries. See the example below.
	 * 
	 * @param {MapOrEntries<K, V>} [mapOrTuple]
	 * @returns {void}
	 * @type {UseMapActions<K, V>["initialize"]}
	 * @example initialize([['a', 1], ['b', 2]])
	 */
	const initialize = useCallback((mapOrTuple = []) => {
		setMap(() => new Map(mapOrTuple))
	}, [])

	/**
	 * Insert a new entry into the map. If the key already exists, 
	 * the value will be overwritten.
	 * 
	 * @param {K} key The key to insert
	 * @param {V} value The value to insert
	 * @returns {void}
	 * @type {UseMapActions<K, V>["insert"]}
	 * @example insert('a', 1)
	 */
	const set = useCallback((key, value) => {
		setMap((aMap) => {
			const newMap = new Map(aMap)
			newMap.set(key, value)
			return newMap
		})
	}, [])

	/**
	 * Lookup a value in the map by key. Returns undefined if the key
	 * does not exist.
	 * 
	 * @param {K} key The key to lookup
	 * @returns {V | undefined} The value associated with the key, or undefined
	 * @type {UseMapActions<K, V>["lookup"]}
	 * @example lookup('a')
	 */
	const lookup = useCallback((key) => {
		return map.get(key)
	}, [map])


	/**
	 * Get the size of the map.
	 */
	const mapSize = useCallback(() => {
		return map.size
	}, [map])

	/**
	 * Delete an entry from the map by key. If the key does not exist,
	 * nothing happens.
	 * 
	 * @param {K} key The key to delete
	 * @returns {void}
	 * @type {UseMapActions<K, V>["delete"]}
	 * @example delete('a')
	 */
	const deleteByKey = useCallback((key) => {
		setMap((aMap) => {
			const newMap = new Map(aMap)
			newMap.delete(key)
			return newMap
		})
	}, [])

	/**
	 * Clear the map. This is equivalent to setting the map to a new,
	 * empty map.
	 * 
	 * @returns {void}
	 * @type {UseMapActions<K, V>["clear"]}
	 * @example clear()
	 */
	const clear = useCallback(() => {
		setMap(() => new Map())
	}, [])

	/**
	 * The actions object contains all the actions that can be performed
	 * on the map. The actions are memoized.
	 * 
	 * @type {UseMapActions<K, V>}
	 * @example actions.lookup('a')
	 * @example actions.insert('a', 1)
	 * @example actions.delete('a')
	 * @example actions.clear()
	 * @example actions.initialize([['a', 1], ['b', 2]])
	 */
	const actions = useMemo(
		() => ({
			lookup,
			clear,
			insert: set,
			delete: deleteByKey,
			initialize,
			mapSize
		}),
		[clear, deleteByKey, initialize, lookup, mapSize, set],
	)

	return [map, actions]
}

export default useMap
