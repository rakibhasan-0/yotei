import { render, configure, cleanup, screen  } from "@testing-library/react"
import "@testing-library/jest-dom"
import PlanIndex from "../../../pages/Plan/PlanIndex"
import { rest } from "msw"
import { setupServer } from "msw/node"
configure({testIdAttribute: "id"})

jest.mock("react-router", () => ({
	useNavigate: () => jest.fn()
}))


// -----------------------   mocking plan, sessions and workout data, should be in __mocks__/handlers
const mockData = [
	rest.get("api/plan/all", (req, res, ctx) => {
		const fakeData = [{"id":1,"name":"Grönt bälte träning","userId":1,"belts":[{"id":7,"name":"Grönt","color":"00BE08","child":false}]},
			{"id":2,"name":"Orange och Gult bälte träning","userId":1,"belts":[{"id":5,"name":"Orange","color":"ED930D","child":false},
				{"id":9,"name":"Blått","color":"0DB7ED","child":false}]}]
		return res(ctx.json(fakeData))
	}),
	rest.get("api/sessions/all", (req, res, ctx) => {
		const fakeData = [{"id":7,"text":"Junior Judo träning","workout":39,"plan":1,"date":"2023-04-07","time":"20:00:00"},
			{"id":3,"text":"Beginner Judo träning","workout":39,
				"plan":1,"date":"2023-04-03","time":"10:00:00"},
			{"id":9,"text":"Judo Techniques Practice","workout":40,"plan":1,"date":"2023-04-09","time":"16:00:00"},
			{"id":20,"text":41,"workout":42,"plan":1,"date":"2023-05-26","time":"11:45:00"},
			{"id":1,"text":"","workout":42,"plan":1,"date":"2023-04-01","time":"12:00:00"},
			{"id":10,"text":"Judo Kata Practice","workout":42,"plan":2,"date":"2023-04-10","time":"08:00:00"},
			{"id":8,"text":"Judo Fitness träning","workout":42,"plan":2,"date":"2023-04-08","time":"06:00:00"},
			{"id":2,"text":"","workout":40,"plan":2,"date":"2023-04-02","time":"14:00:00"}]
		return res(ctx.json(fakeData))
	}),
	rest.get("api/workouts/all", (req, res, ctx) => {
		const fakeData = [{"name":"test","id":39,"created":"2023-05-22","author":1},
			{"name":"jhjygjgy","id":40,"created":"2023-05-22","author":1},
			{"name":"jhjygjgy","id":41,"created":"2023-05-22","author":1},
			{"name":"jhjygjgy","id":42,"created":"2023-05-23","author":1}]
		return res(ctx.json(fakeData))
	}),
]

const server = setupServer(...mockData)
beforeEach(() => server.listen())
afterEach(() => {
	jest.restoreAllMocks()
	server.resetHandlers()
	cleanup()
})

test("Should render title on init", async () => {
	render(<PlanIndex/>)
	expect(screen.getByText("Grupplanering")).toBeInTheDocument()
})

test("should render data from the plan api", async () => {
	// ARRANGE
	/* render(<PlanIndex />);

    const sessionHeaderElement = document.getElementById("session-container-header-session-header-title")
    // ASSERT
    expect(sessionHeaderElement.textContent).toContain("Grönt bälte träning")*/
    
    
})

test("should render data from the sessions api", async () => {

})

test("should render data from the workout api", async () => {

})

