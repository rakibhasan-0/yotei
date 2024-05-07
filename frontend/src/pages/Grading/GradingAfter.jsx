/* eslint-disable indent */
import React, { useState, useContext, useEffect } from "react"
import { AccountContext } from "../../context"
import GradingAfterComp from "./GradingAfterComp"
import Button from "../../components/Common/Button/Button"
import styles from "./GradingBefore.module.css"
import { Printer } from "react-bootstrap-icons"

export default function GradingAfter() {
	const context = useContext(AccountContext)
	const { token, userId } = context
    const [grading, setGrading] = useState([])
    const [beltInfo, setBeltInfo] = useState({
        belt_name: "",
        color: "" // Assuming color is directly usabl
    })
    const grading_id = 7

    useEffect(() => {
        (async () => {
            try {
                // First fetch request to get grading information
                const response = await fetch(`/api/examination/grading/${grading_id}`, {
                    method: "GET",
                    headers: { token }
                })
    
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
    
                const data = await response.json()
                setGrading(data)
                console.log(data)
                const response2 = await fetch("/api/belts/all", {
                    headers: { token },
                    method: "GET"
                })
                if (!response2.ok) {
                    throw new Error("Network response was not ok on second request")
                }
                const data2 = await response2.json()
                
                const matchingBelt = data2.find(belt => belt.id === grading.belt_id)
                if (matchingBelt) {
                    setBeltInfo({
                        belt_name: matchingBelt.name,
                        color: "#" + matchingBelt.color
                    })
                }
            } catch (error) {
                console.error("Error:", error)
            }
            console.log(grading.examinees)
        })()
    }, [])

    return (
        <div className={styles.container}>
                
            <div className={styles.topContainer}>
                <div className={styles.content}>  
                    <div style={{ backgroundColor: beltInfo.color, borderRadius: "0.3rem", padding: "0px" }}>
                        <h2>{beltInfo.belt_name} bälte                         14:00</h2>
                    </div>
                </div>
                <h1 style={{ fontFamily: "Open Sans", fontSize: "25px", paddingTop: "10px", paddingBottom: "10px" }}>Summering</h1>
            </div>
            
            <div className={styles.scrollableContainer}>
                {grading.examinees && grading.examinees.map((examinee) => (
                        <GradingAfterComp key={examinee.examinee_id} name={examinee.name} />
                    ))}
            </div>
        
        <div className={styles.bottomContainer}>
            <div style={{ display: "flex", justifyContent: "flex-end",paddingTop: "10px" }}>
            <Button 
        style = {{
                    backgroundColor: "#FFD700",
                    borderRadius: "0.1rem",
                    padding: "0px",
                    height: "50px"
        }}
        width={"60px"}
        >
            <Printer size={30} color="white" />
            </Button> 
            </div>
            
            <div className={styles.buttonContainer} style= {{paddingTop: "10px"}}>
                    <Button
                        width="100%"
                        outlined={true}
                        onClick={() => {
                            console.log("Tillbaka")
                        }}
                    >
                        <p>Tillbaka</p>
                    </Button>
                    <Button
                        width="100%"
                        onClick={() => {
                            console.log("Fortsätt")
                        }}
                    >
                        <p>Spara och avsluta</p>
                    </Button>
                        
                </div>        
            </div>
        </div>
    )
}
