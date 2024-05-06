/**
 * This class is responsible to create the UI for a profile List-item in the list.
 * It's made up by one stripe row with the name and an arrow and redirects the user
 * to the appropriate list. Allows for custom logo to the rightmost of the list item
 * 
 *
 * @author Tomtato (Group 6)
 * @since 2024-05-02
 * @version 1.0
 */
 import styles from "./ProfileListItem.module.css"
 import { Link } from "react-router-dom"
 import { Dot } from 'react-bootstrap-icons';

 
 export default function ProfileListItem({item, Icon}) {
    //{console.log(list) 
    console.log("Test")

     return (

         
         <div className={`row align-items-center font-weight-bold ${styles["profile-item-row"]}`} style={{marginRight: 0, marginLeft: 0}}>
            <div className={`col-2 ${styles["workout-star"]}`}>
                {/* Handles both Icons and JSX elements */}
                {typeof Icon === 'string' ? <img src={Icon} alt="Icon" /> : Icon}
            </div>
             <Link className={`col align-items-center align-self-center ${styles["profile-text"]} fill`} to={`/profile/${item.list_id}`}>
                 <div className="listItemDiv">
                     <div className="listItemInfoDiv"></div>
                 </div>
                 <div>
                    {item.list_name} 
                    <div>
                        {item.list_id==-1?  <p>{item.amountOfWorkouts} pass</p>: <p>av {item.author} <Dot/> {item.amountOfWorkouts} aktiviterer</p> }
                      
                    </div>
                    
                 </div>
             </Link>
             <Link className={`col-2 align-items-center align-self-center ${styles["profile-text"]} fill`} to={`/profile/${item.list_id}`}>
                 <i id="profile-detail-arrow" className="bi-chevron-right h4"/>
             </Link>
         </div>
     )
 }
 