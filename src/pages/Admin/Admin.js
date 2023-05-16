import React from "react"
import Export from "../../components/Admin/Export"
import Import from "../../components/Admin/Import"
import ManageUser from "../../components/Admin/ManageUser"
import { AccountContext } from "../../context"
import { isAdmin } from "../../utils"
import "./Admin.css"

/**
 * Page for administrative functions.
 *
 *  @author Team Quattro Formaggi (Group 1)
 */

class Developer extends React.Component {
	/**
   * Defines the html for the page.
   */
	render() {
		if(!isAdmin(this.context)){
			window.location.replace("/home")
			return null
		}
		return (
			<div className="container">
				<h1 className="col-12 mt-4">Admin</h1>
				<div className="card bg-light center card-admin">
					<Import />
					<Export />
				</div>
				<div className="card bg-light center card-admin">
					<ManageUser />
				</div>
			</div>
		)
	}
}

Developer.contextType = AccountContext

export default Developer
