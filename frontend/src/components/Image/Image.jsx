import React from "react"
/**
 * An image represented by a URL
 * 
 *   Props:
 *    path 		@type {String}   A URL to the image
 *    id 	@type {String/number}  A ID representing the image. 
 * 
 * @author Apelsin
 * @since 2023-04-16
 * @updated 2024-05-29 Kiwi, Updated Props commment
 * @version 2.0 
 */
export default function Image({ path, id}) {
	return <img id={id} src={path} alt={`Something went wrong with input: '${path}'`} className="w-25 m-2 image-player" />
}
