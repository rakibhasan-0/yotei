import React from "react"

export default function Image({ path }) {
	return <img src={path} alt={`Something went wrong with input: '${path}'`} className="w-25 m-2" />
}
