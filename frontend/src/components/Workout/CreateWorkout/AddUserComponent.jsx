import styles from "./AddUserComponent.module.css"
import { useEffect, useState, useContext } from "react"
import { AccountContext } from "../../../context"
import SearchableDropdown from "../../Common/List/SearchableDropdown"
import { PlusLg, CheckLg } from "react-bootstrap-icons"
import Tag from "../../Common/Tag/Tag"

/**
 * A builder for a list element inside the dropdown inside the 'Add user' component.
 * 
 * @param userObject the object which the list entry should represent.
 * @param addedUsers The getter for the state of added users.
 * @param setAddedUsers The setter for the state of added users.
 * 
 * @author: Olle Lögdahl (Minotaur)
 */
function UserListItem({userObject, addedUsers, setAddedUsers}) {
	const isChecked = () => addedUsers.find(e => e.userId == userObject.userId) != undefined

	// Helper function that removes a given user from addedUsers
	const handleRemoveUser = () => {
		const to_remove = addedUsers.findIndex(e => e.userId == userObject.userId)
		setAddedUsers([
			...addedUsers.slice(0, to_remove),
			...addedUsers.slice(to_remove + 1)
		])  
	}
	// Helper function that adds a given user to addedUsers
	const handleAddUser = () => {
		setAddedUsers([
			...addedUsers,
			userObject
		])
	}

	return (
		<span className={styles.userListItem} onClick={isChecked() ? handleRemoveUser : handleAddUser}>
			<h2>{userObject.username}</h2>
			{isChecked() ? <CheckLg size={28} /> : <PlusLg size={28} />}
		</span>
	)
}

/**
 * A builder for the dropdown inside the 'Add user' component.
 * 
 * @param addedUsers The getter for the state of added users.
 * @param setAddedUsers The setter for the state of added users.
 * 
 * @author: Olle Lögdahl (Minotaur)
 */
function AddUserDropdown({addedUsers, setAddedUsers}) {
	const [query, setQuery] = useState("")
	const [users, setUsers] = useState([])
	const { token } = useContext(AccountContext)

	useEffect(() => {
		// Gör en slagning. testar med att ta bort från users
		fetch("/api/search/users?name=" + query, { headers: { token }, method: "GET"})
			.then(resp => resp.json())
			.then(data => setUsers(
				data.results.map(u => ({ userId: u.userId, username: u.name }))
			))
		

	}, [query, token])

	return (
		<SearchableDropdown 
			id="search-user-dropdown" 
			query={query} 
			setQuery={setQuery} 
			placeholder={"Ge tillgång till användare"} 
			centered={true} 
			autoClose={false} >
			{users && users.map((userObject) => (
				<UserListItem 
					key={"userId-" + userObject.userId} 
					userObject={userObject} 
					addedUsers={addedUsers} 
					setAddedUsers={setAddedUsers} />
			))}
		</SearchableDropdown>
	)
}

/**
 * Builds the 'Add user' component.
 * 
 * The component contains a dropdown where a search can be made for users,
 * and a list of selected users. The component expects a `state` @type {array}
 * which will be populated when users are added by the component.
 * 
 * @param id id for the component.
 * @param addedUsers The getter for the state of added users.
 * @param setAddedUsers The setter for the state of added users.
 * 
 * Can be used as following:
 * <pre><code>
 * const [addedUsers, setAddedUsers] = useState([])
 * return (
 * 	<AddUserDropdown id="test" addedUsers={addedUsers} setAddedUsers={setAddedUsers} />
 * )
 * </code></pre>
 * 
 * @author: Olle Lögdahl (Minotaur)
 */
export default function AddUserComponent({id, addedUsers, setAddedUsers}) {
	return (
		<div id={id}>
			{addedUsers && addedUsers.length > 0 && (
				<>
					<h2>Tillagda användare</h2>

					<div className={styles.addedUsersContainer}>
						{addedUsers && addedUsers.map(({ userId, username }) => (
							<Tag key={userId} tagType="added" text={username} onClick={() => {
								const to_remove = addedUsers.findIndex(e => e.userId == userId)
								setAddedUsers([
									...addedUsers.slice(0, to_remove),
									...addedUsers.slice(to_remove + 1)
								])
							}}/>
						))}
					</div>
				</>
			)}
			<AddUserDropdown addedUsers={addedUsers} setAddedUsers={setAddedUsers} />
		</div>
	)
}