import React from "react"

export default function Image({ path, id}) {
	return <img id={id} src={path} alt={`Something went wrong with input: '${path}'`} className="w-25 m-2 image-player" />
}
