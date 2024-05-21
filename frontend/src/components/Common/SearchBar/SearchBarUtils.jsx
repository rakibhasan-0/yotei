/**
 * This file contains utility functions for the SearchBar component.
 * It is intended to be used with the useMap hook.
 *
 * @module SearchBarUtils
 * @category SearchBar
 * @author Kraken, Team Tomato (Group 6)
 */

/**
 * The type for the args for a technique request.
 *
 * @typedef {Object} techniqueRequestArguments
 * @property {string} text The searchbox text
 * @property {string[]} selectedBelts The selected belts
 * @property {boolean} kihon Whether to display kihon techniques exclusively or not
 * @property {string[]} selectedTags The selected tags
 */
export const techniqueRequestArguments = {
	text: "",
	selectedBelts: [],
	kihon: false,
	selectedTags: [],
}

/**
 * The type for the args for a exercise request.
 *
 * @typedef {Object} exerciseRequestArguments
 * @property {string} text The searchbox text
 * @property {string[]} selectedTags The selected tags
 */
export const exerciseRequestArguments = {
	text: "",
	selectedTags: [],
}

/**
 * The type for the args for a workout request.
 *
 * @typedef {Object} workoutRequestArguments
 * @property {number} id The id of the workout
 * @property {string} text The searchbox text
 * @property {string} from The start date
 * @property {string} to The end date
 * @property {string[]} selectedTags The selected tags
 * @property {boolean} isFavorite Whether to display favorite workouts exclusively or not
 */
export const workoutRequestArguments = {
	id: 0,
	text: "",
	from: "",
	to: "",
	selectedTags: [],
	isFavorite: false,
}

/**
 * The type for the args for a list request.
 *
 * @typedef {Object} listRequestArguments
 * @property {string} text The searchbox text
 */
export const listRequestArguments = {
	text: "",
}

/**
 * The type for the args for a list content request.
 */
export const listContentRequestArguments = {
	id: 0,
}

/**
 *
 * Fetches techniques data. If the query already exists in the cache, the cached data is returned.
 * Otherwise, the data is fetched from the server and stored in the cache, but also returned to the caller.
 *
 * This is intended to be used with the useMap hook.
 * map and mapActions are expected to come from: const [map, mapActions] = useMap()
 *
 * @param {techniqueRequestArguments} args The arguments for the request
 * @param {*} token The session token
 * @param {*} map The cache map (please use the useMap hook for this). To avoid using a cache pass null.
 * @param {*} mapActions The cache map actions (please use the useMapActions hook for this)
 * @param {*} callBack The callback function to call when the data is fetched
 * @returns The results of the fetch. If the result is valid, it will simply return the data.
 * If the result is invalid, it will return an object with an error property.
 */

export async function getTechniques(args, token, map, mapActions, callBack) {
	let query = `/api/search/techniques?name=${args.text}&beltColors=${args.selectedBelts}&kihon=${args.kihon}&tags=${args.selectedTags}`

	// Checks if the query is cached and if so return it.
	if (map && mapActions.lookup(query) !== undefined) {
		callBack(mapActions.lookup(query))
		return
	}

	// eslint-disable-next-line quotes
	await fetch(query, {
		method: "GET",
		headers: {
			token: token,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (map) mapActions.insert(query, data)
			callBack(data)
			return
		})
		.catch((error) => {
			callBack({ error: error })
			return
		})
}

/**
 *
 * Fetches exercises data. If the query already exists in the cache, the cached data is returned.
 * Otherwise, the data is fetched from the server and stored in the cache, but also returned to the caller.
 *
 * This is intended to be used with the useMap hook.
 * map and mapActions are expected to come from: const [map, mapActions] = useMap()
 *
 * @param {exerciseRequestArguments} args The arguments for the request
 * @param {*} token The session token
 * @param {*} map The cache map (please use the useMap hook for this). To avoid using a cache pass null.
 * @param {*} mapActions The cache map actions (please use the useMapActions hook for this)
 * @param {*} callBack The callback function to call when the data is fetched.
 * @returns The results of the fetch. If the result is valid, it will simply return the data. If the result is invalid, it will return an object with an error property.
 */
export async function getExercises(args, token, map, mapActions, callBack) {
	let query = `/api/search/exercises?name=${args.text}&tags=${args.selectedTags}`

	// Checks if the query is cached and if so return it.
	if (map && mapActions.lookup(query) !== undefined) {
		callBack(mapActions.lookup(query))
		return
	}

	await fetch(query, {
		method: "GET",
		headers: {
			token: token,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (map) mapActions.insert(query, data)
			callBack(data)
			return
		})
		.catch((error) => {
			callBack({ error: error })
			return
		})
}

/**
 * Fetches the lists. If the query already exists in the cache, the cached data is returned.
 * Otherwise, the data is fetched from the server and store in the cahce, but also returned to the caller.
 *
 * This is intended to be used with the useMap hook.
 * map and mapActions are expected to come from: const [map, mapActions] = useMap()
 *
 * @param {listRequestArguments} args The arguments for the request.
 * @param {*} token The session token
 * @param {*} map The cache map (please use the useMap hook for this). To avoid using a cache pass null.
 * @param {*} mapActions The cache map actions (please use the useMapActions hook for this)
 * @param {*} callBack The callback function to call when the data is fetched.
 * @returns The results of the fetch. If the result is valid, it will simply return the data. If the result is invalid, it will return an object with an error property.
 */
export async function getLists(args, token, map, mapActions, callBack) {

	let query = `/api/search/activitylists/?&name=${args.text}&isAuthor=${args.isAuthor}&hidden=${args.hidden}&isShared=${args.isShared}`

	// Checks if the query is cached and if so return it.
	if (map && mapActions.lookup(query) !== undefined) {
		callBack(mapActions.lookup(query))
		return
	}

	await fetch(query, {
		method: "GET",
		headers: {
			token: token,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (map) mapActions.insert(query, data)
			callBack(data)
			return
		})
		.catch((error) => {
			callBack({ error: error })
			return
		})
}

/**
 * Fetches the content of a list. If the query already exists in the cache, the cached data is returned.
 * Otherwise, the data is fetched from the server and store in the cahce, but also returned to the caller.
 *
 * This is intended to be used with the useMap hook.
 * map and mapActions are expected to come from: const [map, mapActions] = useMap()
 *
 * @param {listContentRequestArguments} args The arguments for the request.
 * @param {*} token The session token
 * @param {*} map The cache map (please use the useMap hook for this). To avoid using a cache pass null.
 * @param {*} mapActions The cache map actions (please use the useMapActions hook for this)
 * @param {*} callBack The callback function to call when the data is fetched.
 * @returns The results of the fetch. If the result is valid, it will simply return the data. If the result is invalid, it will return an object with an error property.
 */
export async function getListContent(args, token, map, mapActions, callBack) {
	let query = `/api/activitylists/${args.id}`

	// Checks if the query is cached and if so return it.
	if (map && mapActions.lookup(query) !== undefined) {
		callBack(mapActions.lookup(query))
		return
	}

	await fetch(query, {
		method: "GET",
		headers: {
			token: token,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (map) mapActions.insert(query, data)
			callBack(data)
			return
		})
		.catch((error) => {
			callBack({ error: error })
			return
		})
}

/**
 * Fetches workouts data. If the query already exists in the cache, the cached data is returned.
 * Otherwise, the data is fetched from the server and stored in the cache, but also returned to the caller.
 *
 * This is intended to be used with the useMap hook.
 * map and mapActions are expected to come from: const [map, mapActions] = useMap()
 *
 *
 * @param {workoutRequestArguments} args The arguments for the request
 * @param {*} token The session token
 * @param {*} map The cache map (please use the useMap hook for this). To avoid using a cache pass null.
 * @param {*} mapActions The cache map actions (please use the useMapActions hook for this)
 * @param {*} callBack The callback function to call when the data is fetched.
 * @returns The results of the fetch. If the result is valid, it will simply return the data.
 * If the result is invalid, it will return an object with an error property.
 */

export async function getWorkouts(args, token, map, mapActions, callBack) {
	let query = `/api/search/workouts?name=${args.text}&from=${args.from}&to=${args.to}&favourite=${args.isFavorite}&tags=${args.selectedTags}`
	if (args.id) {
		query += `&id=${args.id}`
	}

	if (map && mapActions.lookup(query) !== undefined) {
		callBack(mapActions.lookup(query))
		return
	}

	fetch(query, {
		method: "GET",
		headers: {
			token: token,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (map) mapActions.insert(query, data)
			callBack(data)
			return
		})
		.catch((error) => {
			callBack({ error: error })
			return
		})
}
