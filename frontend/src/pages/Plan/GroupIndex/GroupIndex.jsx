import { useState, useEffect, useContext } from "react"
import { isEditor } from "../../../utils"
import {setError as setErrorToast} from "../../../utils"
import { AccountContext } from "../../../context"
import style from "./GroupIndex.module.css"
import BeltBox from "../../../components/Plan/BeltBox"
import { Pencil, Plus } from "react-bootstrap-icons"
import { Link } from "react-router-dom"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import SearchBar from "../../../components/Common/SearchBar/SearchBar"

/**
 * Page for showing all groups.
 * 
 * @author Chimera 
 * @version 1.0
 * @since 2023-05-30
 * @returns A group index page
 */
export default function GroupIndex() {
	const [groups, setGroups] = useState([])
	const [searchText, setSearchText] = useState()
	const context = useContext(AccountContext)
	const { token, userId } = context

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/plan/all", { headers: { token } })
				if (response.status === 404) {
					return
				}
				if (!response.ok) {
					throw new Error("Kunde inte hämta grupper")
				}
				const json = await response.json()
				setGroups(json)
			} catch (ex) {
				setErrorToast("Kunde inte hämta grupper")
				console.error(ex)
			}
		})()
	}, [token, searchText])

	return (
		<div className={style.container}>
			<h1>Grupper</h1>
			<SearchBar id="searchbar-groups" placeholder="Sök efter grupp" text={searchText} onChange={setSearchText} /> 
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
							{ (isEditor(context) || userId == group.userId)&& <Link to={`/plan/edit/${group.id}`}>
								<Pencil size={24} color="var(--red-primary)" />
							</Link>
							}
						</div>
					</div>
				))}
				<RoundButton linkTo={"/plan/create"}>
					<Plus className="plus-icon" />
				</RoundButton>
			</div>
		</div>
	)
}
