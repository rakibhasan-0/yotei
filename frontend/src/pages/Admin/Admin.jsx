import React, { useContext } from "react"
import Export from "../../components/Admin/Export/Export"
import Import from "../../components/Admin/Import/Import"
import Divider from "../../components/Common/Divider/Divider"
import ManageUser from "../../components/Admin/ManageUser"
import { AccountContext } from "../../context"
import { isAdmin } from "../../utils"
import ErrorLogsDisplay from "../../components/ErrorLogsDisplay/ErrorLogsDisplay"


/**
 * Basic layout as page for the administrative functions. Most logic contained in ManageUser, Import and Export.
 *
 *  @author Chimera (Group 4)
 *  @since 2023-05-23
 *  @version 1.0
 *  @returns A page for the administrative functions.
 */
export default function Admin() {
	const context = useContext(AccountContext)

	if(!isAdmin(context)){
		window.location.replace("/404")
		return null
	}

	return(
		<div className="pb-4">
			<h1 className="col-12 mt-4">Admin</h1>
			<div className="center card-admin">
				<ManageUser />
			</div>
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
		</div>
	)
}