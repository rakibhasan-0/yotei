import { Star, StarFill } from 'react-bootstrap-icons';
import './StarButton.css';

/**
 * A star button that can be toggled on or off, where the
 * toggled state has a filled star and the untoggled state
 * is an empty outlined star.
 * 
 * Example usage:
 * 
 * const [isToggled, setToggled] = useState(false);
 * <StarButton toggled={isToggled} onClick={() => setToggled(!isToggled)} />
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
export default function StarButton({onClick, toggled}) {
    return (
        <div onClick={onClick} className='star-container'>
            {toggled 
                ?   <>
                        <StarFill className='star' color='yellow' />
                        <Star size={"100%"} className='star-overlay' />
                    </>
                :   <Star className='star' />
            }
        </div>
    )
}
