import "@testing-library/jest-dom"
import { rest } from "msw"
import { server } from "../server"

const requestSpy = jest.fn()
server.events.on("request:start", requestSpy)

async function getData( ){
	const response = await fetch("http://localhost/api/exercises/all")
    
	return response.json()
}

test("mocked exercise data should match expected data", async() => {

	// ARRANGE
	var method = ""
	server.use(
		rest.all("http://localhost/api/exercises/all", async (req, res, ctx) => {
			method = req.method
        
			return res(ctx.status(200), ctx.json({
				item: "Hoppa högt",
				text: "420 min",
				children: "Fall på fötterna.",
				detailURL: "bsurl.com/fake/",
				id: 87,
				index: 420
			}))
		})
	)

	// ACT
	const data = await getData()
    
	// ASSERT
	expect(requestSpy).toHaveBeenCalled()
	expect(method).toBe("GET")
	expect(data.item).toEqual("Hoppa högt")
	expect(data.text).toEqual("420 min")
	expect(data.detailURL).toEqual("bsurl.com/fake/")
	expect(data.id).toEqual(87)
	expect(data.index).toEqual(420)
})