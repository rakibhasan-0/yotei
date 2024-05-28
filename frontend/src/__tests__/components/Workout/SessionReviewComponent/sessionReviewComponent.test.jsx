import React from "react"
import { render, screen, configure, act } from "@testing-library/react"
import "@testing-library/jest-dom"
import ReviewComment from "../../../../components/Workout/WorkoutReview/ReviewComment.jsx"
import { AccountContext } from "../../../../context.js"
import { USER_PERMISSION_LIST_ALL } from "../../../../utils.js"
import Review from "../../../../components/Plan/SessionReview/SessionReviewComponent.jsx"
configure({testIdAttribute: "id"})

test("Add activity during session review render test", async () => {

    // Mocka? eller bara rendera review komponenten
        render(
            <Review 
            id={"sessionReview"} 
            isOpen={true} 
            setIsOpen={true} 
            session_id={"1"} 
            workout_id={"1"}
            />
        )

    // Hitta igen knappen
    let addActivityButton = screen.getByTestId('AddActivityButton')
    expect(addActivityButton).toBeInTheDocument()

    // Klicka på knappen
    act( addActivityButton.click() )

    // Expecta att en sida öppnas
    expect(screen.getByText("Lägg till aktivitet")).toBeInTheDocument()
})