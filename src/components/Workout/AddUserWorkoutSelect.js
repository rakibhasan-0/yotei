import React, { useState, useContext, useEffect } from "react"
import { AccountContext } from "../../context"
import Select from "react-select"
import "./AddUserWorkoutSelect.css"

/**
 * This component is used to add users to comment on a workout. 
 * 
 * @author Cappriciosa (2022-05-16)
 */
function AddUserWorkoutSelect(props) {

	const [isActive, setIsActive] = useState(false)
	const [users, setUsers] = useState([])
	const { token, userId } = useContext(
		AccountContext
	)
	const [author, setAuthor] = useState("")

	// Added users are users that have been added on a previous occasion. 
	let addedUsers = []
	if (props.addedUsers !== undefined) {
		addedUsers = props.addedUsers.map(user => {
			return { label: user.label, value: user.value }
		})
	}
    
	useEffect(() => {
		// If the workout exists we use the author of the workout, otherwise we fetch the current logged in user.
		if (props.author !== undefined) {
			setAuthor(props.author)
		} else {
			try {
				fetch(`/user/getname/${userId}`, { headers: { token }, method: "GET" })
					.then(resp => resp.json())
					.then(data => setAuthor(data.username))
			} catch (error) {
				alert("Could not find author")
				console.log("error :", error)
			}
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	/**
     * Fetches the data from the API and sets the states.
    */
	const fetchData = async () => {
		try {
			const response = await fetch("/user/all", { headers: { token } })
			const json = await response.json()

			const allUsers = json.map(user => {
				return { label: user.username, value: user.userId }
			})

			// Remove the user thta
			allUsers.forEach((user) => {
				if (user.label === author) {
					allUsers.splice(allUsers.indexOf(user), 1)
				}
			})

			// Set the list of users to the difference between all fetched users, and users added. 
			setUsers(getDifferenceOfLists(allUsers, addedUsers))

		} catch (error) {
			alert("Could not find users")
			console.log("error", error)
		}

	}

	/**
     *  Calculates the difference between a list and another list, and returns the differentiated list. 
     * 
     * @param {*} list1  
     * @param {*} list2
     * @returns A list containing the difference of list1 and list2.  
     */
	function getDifferenceOfLists(list1, list2) {
		const difference = []

		for (let user in list1) {
			let found = false
			for (let currentUser in list2) {
				if (list1[user].label === list2[currentUser].label) {
					found = true
					break
				}
			}
			if (!found) difference.push(list1[user])
		}
		return difference
	}

	return (
		<>
			<div>
				{!isActive ?
					<img className="add-user-img" src="/add_user_icon.svg" alt="Add users" onClick={() => {
						setIsActive(!isActive)
						fetchData()
					}
					} />
					:
					<Select
						value={addedUsers}
						options={users}
						placeholder="Lägg till Användare"
						formatCreateLabel={(inputText) => `${inputText}`}
						isMulti
						onChange={(currentUsers) => {

							// If a user is removed from the list of addedUsers, we want to push it to the 
							// list of all users, if it's not already in the list of all users. 
							addedUsers.forEach(user => {
								let found = false
								currentUsers.forEach(a => {
									if (a.label === user.label) {
										found = true
									}
								})

								if (!found) {
									users.forEach(u => {
										if (u.label === user.label) {
											found = true
										}
									})
								}

								if (!found) users.push(user)
							})

							props.setSelectedUsers(currentUsers)
						}
						}
					/>
				}
			</div>
		</>
	)
}


export default AddUserWorkoutSelect