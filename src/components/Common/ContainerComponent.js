
/**
 * This component wraps the 'container' div's
 * in to one component. With the purpose to
 * make the code cleaner (D.R.Y) and easier
 * to read.
 * 
 * @author Team Kebabpizza (Group 8)
 * @version 1.0
 */
function ContainerComponent(props){
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default ContainerComponent;