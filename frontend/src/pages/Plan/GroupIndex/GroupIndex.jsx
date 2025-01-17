import { useState, useEffect, useContext } from "react"
import { setError as setErrorToast, canCreateSessionsAndGroups, canEditSessionsAndGroups, isAdminUser, HTTP_STATUS_CODES } from "../../../utils"
import { AccountContext } from "../../../context"
import style from "./GroupIndex.module.css"
import BeltBox from "../../../components/Plan/BeltBox"
import { Pencil, Plus, GraphUp } from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import SearchBar from "../../../components/Common/SearchBar/SearchBar"
import Spinner from "../../../components/Common/Spinner/Spinner"

/**
 * Page for showing all groups.
 *
 * @author Chimera, Team Mango, Team Durian, Team Coconut
 * @version 2.1
 * @since 2024-04-29
 * @returns A group index page
 * @update Team Mango (2024-05-21) added new check for create group button to new user rights check.
 * Updated: 2024-05-06
 * 		 	2024-05-28: Updated error handling with new HTTP code.
 */
export default function GroupIndex() {
	const [groups, setGroups] = useState([])
	const [searchText, setSearchText] = useState()
	const context = useContext(AccountContext)
	const { token } = context
	const [loading, setLoading] = useState(true)
	const [groupsEmpty, setGroupsEmpty] = useState(true) //Boolean to check if there are no groups.

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/plan/all", { headers: { token } })
				if (response.status === HTTP_STATUS_CODES.NO_CONTENT) {
					//This code runs if there are no groups.
					setGroupsEmpty(true) //Set a flag for the groups being empty.
					setLoading(false) //Stop the page from loading.
					return
				}
				if (!response.ok) {
					setGroupsEmpty(true) //Set a flag for the groups being empty.
					setLoading(false)
					throw new Error("Kunde inte hämta grupper")
				}
				setGroupsEmpty(false) //There is at least one group.
				const json = await response.json()
				setLoading(false)
				setGroups(json)
			} catch (ex) {
				setGroupsEmpty(true) //There are no groups.
				setErrorToast("Kunde inte hämta grupper")
				setLoading(false)
				console.error(ex)
			}
		})()
	}, [token, searchText])


	return (	
		<div className={style.container}>	
			<title>Grupper</title>
			<h1>Grupper</h1>
			<SearchBar id="searchbar-groups" placeholder="Sök efter grupp" text={searchText} onChange={setSearchText} /> 
			{loading ? <Spinner /> : (
				<div>
					{groups?.filter(group => {
						if (searchText?.length > 0) {
							return group.name.toLowerCase().includes(searchText.toLowerCase())
						}
						return true
					}).map((group, index) => (

						
						<div className="mb-2" key={index}>
							<p className={style.label}>{group.name}</p>
							<div className="d-flex align-items-center">
								<div className={style.item}>
									<BeltBox id={index} belts={group.belts} />
								</div>
								<div style = {{marginLeft: "5px", display: "flex"}}> { (isAdminUser(context) || canEditSessionsAndGroups(context, group.userId)) && (
									<>
										<Link to={`/plan/edit/${group.id}`}>
											<Pencil id={"edit-group-button"} size={24} color="var(--red-primary)"/>
										</Link>
										<div style={{ width: "20px" }}/>
										<Link to={`./statistics/${group.id}`}>
											<GraphUp
												id={`statistics-page-button-${group.id}`}
												size="24px"
												color="var(--red-primary)"
												style={{ cursor: "pointer" }}
											/>
										</Link>
									</>
								) } </div>
							</div>
						</div>

					))}

					{groupsEmpty ? (<div id = {"No-groups-visible-text"}>
						<h1>Det finns inga grupper att visa</h1>
					</div>)
						: <div id = {"Groups-are-visible"}></div> //Default is nothing. This div is for testing!
					}
					
					{

						(isAdminUser(context) || canCreateSessionsAndGroups(context)) ?
							<RoundButton linkTo={"/plan/create"}>
								<Plus className="plus-icon" />
							</RoundButton>
							: <></>
					}

				</div>
			)}
		</div>
	)
}
