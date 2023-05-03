import "./CheckBox.css"
import {Square , CheckSquareFill} from "react-bootstrap-icons"

/** 
 * A default checkbox that should be used throughout the project.
 * 
 * 
 * 
 * Show the properties that can be set in the props object below:
 * props = {
 *     checked: boolean
 *     onClick: function,
 *     id: string
 * }
 * 
 * example:
 * const [state, setChecked] = useState(false)
 * <CheckBox checked=state onClick={()=>setChecked(!checked)}></CheckBox>
 * 
 *   
 * @author Chimera
 * @since 2023-05-02
 * @version 2.0  
 */
export default function CheckBox({checked, onClick, id}) {
	return (
		<div id={id} className="checkbox-container" onClick={onClick}>
			{checked
				? <>
					<CheckSquareFill className='check'/>
				</>
				: <Square className='square' />
			}  
		</div>  
	)
}