import './Button.css';

/**
 * A default button that should be used throughout the project.
 * 
 * The props object accepts an onClick handler for button presses.
 * Contents should be specified as a child, which can be any type 
 * of element, such as text or an icon.
 * 
 * Show the properties that can be set in the props object below:
 * props = {
 *     onClick: function,
 *     outlined: boolean
 * }
 * 
 * The parent container using this button must constrain its width.
 * 
 * @author Chimera
 * @since 2023-04-21
 * @version 1.0
 */
export default function Button({onClick, outlined, children}) {
    return (
        <div onClick={onClick} className={ ['button', outlined ? 'button-back' : 'button-normal'].join(" ") }>
            {children}
        </div>
    )
}
