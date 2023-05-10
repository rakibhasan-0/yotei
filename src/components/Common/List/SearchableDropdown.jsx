import { useState } from "react"
import { ChevronDown } from "react-bootstrap-icons"
import "./Component.css"

/**
 * A searchable drop-down list
 * with a customizable optional item on the left of the
 * component text. The component can be expanded, and
 * the children will be displayed.
 * 
 * The width of the component will be set by the parent.
 * 
 * props = {
 *     item: Optional JSX element which will be displayed on the left of the text,
 *     text: Text of the component,
 *     children: JSX element which will be displayed when the component is expanded
 * 	   centered: Boolean to set text as centered
 *     id: string
 * }
 * 
 * The parent container using this button must constrain its width.
 * 
 * * Can be used as following:
 * <pre><code>
 * const [query, setQuery] = useState("")
 * return (
 * 	<SearchableDropdown id="test" query={query} setQuery={setQuery} placeholder="Enter foo name" autoClose={false} >
 * 		<li>Elem 1</li>
 * 		<li>Elem 2</li>
 *  	<li>Elem 3</li>
 * 	</SearchableDropdown>
 * 	<h1>You searched for {query}!</h1>
 * )
 * </code></pre>
 * 
 * @author Minotaur
 * @since 2023-05-02
 * @version 2.0 
 */
export default function SearchableDropdown({ query, setQuery, placeholder, children, id, autoClose }) {
	const [toggled, setToggled] = useState(false)
	const onClick = () => {
		if (autoClose !== false) {
			setToggled(false)
		}
	}
	return (
		<div id={id} className="list-container">
			<div className='list-header'>
				<input className="list-text-input" placeholder={placeholder} value={query} onChange={e => setQuery(e.target.value)}/>
				<div className={["list-toggle", toggled ? "list-rotate" : ""].join(" ")}>
					<ChevronDown id={`${id}-dropdown`} size={28} onClick={() => setToggled(!toggled)} />
				</div>
			</div>
			<div className="list-item-container" >
				<div className="list-child" onClick={onClick} style={{ margin: toggled ? "0" : "-100% 0 -100% 0" }} id={`${id}-children`}>
					{children}
				</div> 
			</div>
		</div>
	)
}
