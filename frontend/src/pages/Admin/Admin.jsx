import { useContext, useState, useEffect } from "react"
import Export from "../../components/Admin/Export/Export"
import Import from "../../components/Admin/Import/Import"
import Divider from "../../components/Common/Divider/Divider"
import ManageUser from "../../components/Admin/ManageUser"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import InfiniteScrollComponent from "../../components/Common/List/InfiniteScrollComponent"
import Spinner from "../../components/Common/Spinner/Spinner"
import RoleCard from "../../components/Common/RoleCard/RoleListItem"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import style from "./Admin.module.css"
import { AccountContext } from "../../context"
import { isAdmin } from "../../utils"
import { Tab, Tabs } from "react-bootstrap"
import { Plus } from "react-bootstrap-icons"
import { setError as setErrorToast } from "../../utils"
import ErrorLogsDisplay from "../../components/ErrorLogsDisplay/ErrorLogsDisplay"


/**
 * Basic layout as page for the administrative functions. Most logic contained in ManageUser, Import and Export.
 *
 *  @author Chimera (Group 4), Team Durian (Group 3) (2024-04-23), Team Mango (Group 4) (2024-05-07)
 *  @since 2023-05-23
 *  @version 2.0
 *  @returns A page for the administrative functions.
 */
export default function Admin() {
	const context = useContext(AccountContext)
	const { token, /*userId*/ } = context
	const detailURL = "/admin/role_page/"

	const [searchText, setSearchText] = useState("")
	const [roles, setRoles] = useState([])
	const [loading, setIsLoading] = useState(true)
	const [key, setKey] = useState(window.localStorage.getItem("active-tab") || "HandleUsers")
	const [isRoleTabEnabled] = useState(true) //FEATURE TOGGLE

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/roles", { headers: { token } })
				if (!response.ok) {
					setIsLoading(false)
					throw new Error("Kunde inte hämta roller")
				}
				const json = await response.json()
				console.log(json)
				setRoles(json)
				setIsLoading(false)
			} catch (ex) {
				setErrorToast("Kunde inte hämta roller")
				setIsLoading(false)
				console.error(ex)
			}
		})()
	}, [token, searchText])

	useEffect(()=>{
		window.localStorage.setItem("active-tab", key)
	}, [key]) 

	if(!isAdmin(context)){
		window.location.replace("/404")
		return null
	}	


	return(
		<Tabs activeKey={key} onSelect={(tab) => setKey(tab)} className={style.tabs}>
			<title>Admin</title>
			<h1 className="col-12 mt-4">Admin</h1>
			<Tab eventKey={"HandleUsers"} title={"Hantera Användare"}> 
				<div className="center card-admin">
					<ManageUser />
				</div>
			</Tab>
			{isRoleTabEnabled && ( //FEATURE TOGGLE
				<Tab eventKey={"Roles"} title={"Roller"}>
					<SearchBar 
						id="searchbar-roles" 
						placeholder="Sök efter en roll" 
						text={searchText} 
						onChange={setSearchText}
					/>
					{loading ? <Spinner/> : (
						<div>
							{roles?.filter(role => {
								if (searchText?.length > 0) {
									return role.roleName.toLowerCase().includes(searchText.toLowerCase())
								}
								return true
							}).map((role, index) => (
								<RoleCard
									item={role.roleName}
									key={role.roleId}
									id={role.roleId}
									detailURL={detailURL}
									index={index}>
								</RoleCard>
						
		
							))}
						
						</div>
					
					)}

					<InfiniteScrollComponent

						id={"admin-view-roles"}>
						<RoleCard
							item={"exercise.name"}
							key={"exercise.id"}
							id={"exercise.id"}
							detailURL={detailURL}>
						</RoleCard>
						<RoleCard
							item={"exercise.n1ame"}
							key={"exercise1.id"}
							id={"exercise.1id"}>
						</RoleCard>
					</InfiniteScrollComponent>

					<RoundButton linkTo={"role/create"} id={"role-round-button"}  style={{maxWidth: "5px"}}>
						<Plus/>
					</RoundButton>

				</Tab>
			)}
			
			<Tab eventKey={"ImportExport"} title={"Importera/Exportera"}>
				<div className="center card-admin">
					<br/>
					<Divider id={"import_export_activities_divider"} option={"h2_left"} title={"Importera/Exportera aktiviteter"} /> 
					<div style={{padding: "1rem"}}>
						<Import />
						<Export />
					</div>
				</div>
				<Divider id={"errorlogdisplay_divider"} option={"h2_left"} title={"Övrigt"} />
				<ErrorLogsDisplay id="errorlogdisplay-test" />
			</Tab>
		</Tabs>
		
	)
}