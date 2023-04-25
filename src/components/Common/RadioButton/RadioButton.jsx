import { Record, Record2} from 'react-bootstrap-icons';
import './RadioButton.css';

/**
 * A radio button that can be toggled on or off, where the
 * toggled state has a filled circle and the untoggled state
 * is an empty outlined circle .
 * 
 * Example usage:
 * 
 * const [state, setState] = useState(false);
 * <RadioButton onClick={() => setState(!state) }toggled = {state}></RadioButton>
 * 
 * props = {
 *    toggled: boolean,
 *    onClick: function
 * }
 * 
 * @author Chimera
 * @since 2023-04-24
 * @version 1.0
 */
export default function RadioButton({onClick,toggled}){
    return(
        <div onClick={onClick} className="radio-container">
            {toggled
                ?   <>
                        <Record2 className='radio'/>
                    </>
                :   <Record className='radio'/>
            }
        </div>
    )
}