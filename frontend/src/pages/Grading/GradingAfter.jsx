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

    
	
	const [examinees, setExaminees] = useState([
		{
			id: 1,
			person: {
				name: "Bob Dylan",
				url: "https://example.com/bob_dylan_profile",
				points: 52 
			}
		},
		{
			id: 2,
			person: {
				name: "Abdulla Rashim",
				url: "https://example.com/regina_spector_profile",
				points: 10
                
			}
		},
		{
			id: 3,
			person: {
				name: "Nils Karlsson",
				url: "https://example.com/nils_karlsson_profile",
				points: 50
			}
		},
        {
            id: 4,
            person: {
                name: "Kalle Anka",
                url: "https://example.com/kalle_anka_profile",
                points: 52
            }
        },
        {
            id: 5,
            person: {
                name: "Batman",
                url: "https://example.com/kalle_anka_profile",
                points: 52
            }
        },
        {
            id: 6,
            person: {
                name: "Superman",
                url: "https://example.com/kalle_anka_profile",
                points: 30
            }
        },
        {
            id: 7,
            person: {
                name : "Hulk",
                url: "https://example.com/kalle_anka_profile",
                points: "52"
            }   
        },

    ])

    return (
        <div className={styles.container}>
                
            <div className={styles.topContainer}>
                <div className={styles.content}>  
                    <div style={{ backgroundColor: "#FFD700", borderRadius: "0.3rem", padding: "0px" }}>
                        <h2>GULT BÄLTE                         14:00</h2>
                    </div>
                </div>
                <h1 style={{ fontFamily: "Open Sans", fontSize: "25px", paddingTop: "10px", paddingBottom: "10px" }}>Summering</h1>
            </div>
            
            <div className={styles.scrollableContainer}>
                {examinees.map((examinee) => (
                    <GradingAfterComp key={examinee.id} person={examinee.person} max_point={52} />
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
