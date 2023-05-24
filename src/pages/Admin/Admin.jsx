import React from "react"
import Export from "../../components/Admin/Export/Export"
import Import from "../../components/Admin/Import/Import"
import Divider from "../../components/Common/Divider/Divider"
import ManageUser from "../../components/Admin/ManageUser"
import { AccountContext } from "../../context"
import { isAdmin } from "../../utils"

/**
 * Page for administrative functions.
 *
 *  @author Chimera (Group 4)
 *  @version 1.0
 */

class Developer extends React.Component {
	/**
   * Defines the html for the page.
   */
	render() {
		if(!isAdmin(this.context)){
			window.location.replace("/404")
			return null
		}
		return (
			<div className="container">
				<h1 className="col-12 mt-4">Admin</h1>
				<div className="center card-admin">
					<ManageUser />
				</div>
				<div className="center card-admin">
					<Divider id={"import_export_activities_divider"} option={"h2_left"} title={"Importera/Exportera aktiviteter"} /> 
					<Import />
					<Export />
				</div>
			</div>
		)
	}
}

Developer.contextType = AccountContext

export default Developer