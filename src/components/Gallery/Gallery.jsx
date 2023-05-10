import React, { useCallback, useEffect, useState , useContext} from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from "react-responsive-carousel"
import VideoPlayerReactPlayer from "../VideoPlayer/VideoPlayerReactPlayer"
import Image from "../Image/Image"
import "../Gallery/Gallery.css"
import { AccountContext } from "../../context"

/**
 * A media component for displaying video or images.
 * 
 * Props:
 *     id @type {number}  - The id of a techique/exercise
 *
 * Example usage:
 *
 * @author Team Dragon (Grupp 3)
 * @version 1.0
 * @since 2023-05-04
 */
export default function Gallery({ id }) {
	// api call to get links for media is done "HERE" and save it to var dummy. 
	// We need to filter pictures and videos to two different arrays
	
	const [media, setMedia] = useState([])
	const context = useContext(AccountContext)

	const getMedia = useCallback(async () => {
		const requestOptions = {
			method: "GET",
			headers: { "Content-type": "application/json", "token": context.token },
		}
		try {
			const response = await fetch(`/api/media/${id}`, requestOptions)

			if (response.ok) {
				const data =  await response.json()
				setMedia(data) 
			} 
		} catch (error) {
			console.log(error)
		}
	}, [context.token, id])

	useEffect(() => {getMedia()}, [getMedia])

	let pictures = []
	let videos = []
	
	media.map((m) => {
		if (m.image == true) {
			pictures.push(m)
		} else {
			videos.push(m)
		}
	})

	return (
		<div className="container" id={id}>
			<div className="row mt-2 mb-2">
				<div className="col-sm-12 text-center ">
					<Carousel showThumbs={false} >                         
						{pictures.map((image, index) => (
							<Image path={image.url} key={index} />
						))}
						{videos.map((video, index) => (
							<VideoPlayerReactPlayer path={video.url} key={index}/>
						))}
					</Carousel>
				</div>
			</div>
		</div>
	)
}