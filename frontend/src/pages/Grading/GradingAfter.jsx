/* eslint-disable indent */
import React, { useState, useContext } from "react"
import { AccountContext } from "../../context"
import GradingAfterComp from "./GradingAfterComp"

export default function GradingAfter() {
	const context = useContext(AccountContext)
	const { token, userId } = context

	// Sample examinees
	const [examinees, setExaminees] = useState([
		{
			id: 1,
			person: {
				name: "Bob Dylan",
				url: "https://example.com/bob_dylan_profile",
				points: 12 
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
                points: 30
            }
        },
        {
            id: 5,
            person: {
                name: "Batman",
                url: "https://example.com/kalle_anka_profile",
                points: 30
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
                points: "42"
            }   
        },

    ])

    return (
        <div>
            <div> 
                <div style={{ backgroundColor: "#FFD700", borderRadius: "0.3rem", padding: "0px" }}>
                    <h2>GULT BÄLTE                         14:00</h2>
                </div>
            </div>
            <h1 style={{ fontFamily: "Open Sans", fontSize: "25px", paddingTop: "20px", paddingBottom: "20px" }}>Summering</h1>
            {examinees.map((examinee) => (
                <GradingAfterComp key={examinee.id} person={examinee.person} />
            ))}
        </div>
    )
}
