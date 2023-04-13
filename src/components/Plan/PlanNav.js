import React, {useState} from 'react';
import {Outlet} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import './PlanNav.css';
import DropDownPlan from "./DropDownPlan";
import PlanCalendar from "./PlanCalendar";
/**
 * Navigation bar for plan page.
 * @author Hawaii(Grupp 3) Calzone(Grupp 4)
 */

/**
 * Creates a navigation bar with icons for the dropdown menu and the calendar as well as the components themselves. 
 * @returns The whole navigation bar.
 */
const PlanNav = (props) => {
    const [isActiveFilter, setIsActiveFilter] = useState(false);
    const [isActiveCal, setIsActiveCal] = useState(false);

    return (
    <>
        <nav>
            <Navbar id="plan-nav-bar" expand="lg">
                <div className="accordion-title" onClick={() => setIsActiveFilter(!isActiveFilter)}>
                    <div className='text-right'>{isActiveFilter ?
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white"
                                 className="bi bi-x-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path
                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                        :
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white"
                                 className="bi bi-funnel-fill" viewBox="0 0 16 16">
                                <path
                                    d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                            </svg>
                        </div>
                    }</div>
                </div>

              <h2 id="title" style={{color: "white"}}>Terminsplanering</h2>

                <div className="accordion-title" onClick={() => setIsActiveCal(!isActiveCal)}>
                    <div className='text-right'>{isActiveCal ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white"
                            className="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path
                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>

                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white"
                            className="bi bi-calendar-week-fill" viewBox="0 0 16 16">
                            <path
                                d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zM9.5 7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm3 0h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zM2 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3.5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                    }</div>
                </div>

            </Navbar>

                {isActiveFilter &&
                    <div id="dropdownfilter">
                        <DropDownPlan plans={props.plans} setPlanFunction={props.setPlanFunction} checkedChange={props.checkedChange}
                        toggleAll={props.toggleAll}/>
                    </div>
                }
                {isActiveCal &&
                  <div id="dropdownCalendar">
                      <center>
                      <PlanCalendar id="calendarDiv"/>
                      </center>
                  </div>
                }
        </nav>

        <Outlet/>
    </>
  );
}


export default PlanNav;