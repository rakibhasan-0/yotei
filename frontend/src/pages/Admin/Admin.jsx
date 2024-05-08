import React, { useContext, useState } from "react"
import Export from "../../components/Admin/Export/Export"
import Import from "../../components/Admin/Import/Import"
import Divider from "../../components/Common/Divider/Divider"
import ManageUser from "../../components/Admin/ManageUser"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import InfiniteScrollComponent from "../../components/Common/List/InfiniteScrollComponent"
import ToggleButton from "../../components/Common/ToggleButton/ToggleButton"
import RoleCard from "../../components/Common/RoleCard/RoleListItem"
import Form from "react-bootstrap/Form"
import FormCheck from "react-bootstrap/FormCheck"
import style from "./Admin.module.css"
import { AccountContext, Roles } from "../../context"
import { isAdmin } from "../../utils"
import { Tab, Tabs } from "react-bootstrap"
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
	const detailURL = "/admin/role_page/"
	const [searchText, setSearchText] = useState("")

	if(!isAdmin(context)){
		window.location.replace("/404")
		return null
	}	

	return(
		<Tabs defaultActiveKey={"HandleUsers"} className={style.tabs}>
			<title>Admin</title>
			<h1 className="col-12 mt-4">Admin</h1>
			<Tab eventKey={"HandleUsers"} title={"Hantera Användare"}> 
				<div className="center card-admin">
					<ManageUser />
				</div>
			</Tab>
			<Tab eventKey={"Roles"} title={"Roller"}>
				<SearchBar 
					id="searchbar-roles" 
					placeholder="Sök efter en roll" 
					text={searchText} 
					onChange={setSearchText}
				/>
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
			</Tab>
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