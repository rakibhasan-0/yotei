import { Outlet } from "react-router"
import Navbar from "../Navbar/Navbar"
/**
 * The base layout used for all pages.
 * Adds the navbar on top, and a bootstrap m-4 margin around all contents.
 * 
 * Props:
 *     id @type {string}  - An id for its outermost div.
 *
 * Example usage:
 *    <BaseLayout id="test-id"/> 
 *
 * @author Team Medusa
 * @version 1.0
 * @since 2023-05-02
 */
function BaseLayout({ id }) {
	return (
		<div id={id} className="m-4">
			<Navbar/>
			<Outlet/>
		</div>
	)
}
export default BaseLayout
