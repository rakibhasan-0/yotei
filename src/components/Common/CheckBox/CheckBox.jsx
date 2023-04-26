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
 * }
 * 
 * example:
 * const [state, setChecked] = useState(false)
 * <CheckBox checked=state onClick={()=>setChecked(!checked)}></CheckBox>
 * 
 *   
 * @author Chimera (2023-04-21) 
 * @version 1.0  
 */
export default function CheckBox({checked, onClick}) {
	return (
		<div className="checkbox-container" onClick={onClick}>
			{checked
				? <>
					<CheckSquareFill className='check'/>
				</>
				: <Square className='square' />
			}  
		</div>  
	)
}