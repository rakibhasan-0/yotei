import React, { useCallback, useEffect, useState , useContext} from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from "react-responsive-carousel"
import VideoPlayerReactPlayer from "../VideoPlayer/VideoPlayerReactPlayer"
import Image from "../Image/Image"
import "../Gallery/Gallery.css"
import { AccountContext } from "../../context"
import TextArea from "../Common/TextArea/TextArea"

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
			console.error(error)
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

	/**
	 * Used for adding description into gallery.
	 * @param {*} mediaObject image or video that has a description.
	 * @returns a textarea with description connected to mediaObject.
	 */
	function MediaDescription(mediaObject){
		return(	
			<TextArea id={`${mediaObject.id}-media-description`} 
				text={mediaObject.description} 
				readOnly={true}/>
		)
	
	}


	return (
		<div className="container gallery-container" id={id}>
			<div className="row mt-2 mb-2">
				<div className="col-sm-12 text-center ">
					<Carousel showThumbs={false} showStatus={false} showArrows={true}>                         
						{pictures.map((image, index) => (
							<div className="gallery-image-and-description" key={index}>
								<Image path={image.url} key={index} />
								{MediaDescription(image)}
							</div>
						))}
						{videos.map((video, index) => (
							<div className="gallery-video-and-description" key={index}>
								<VideoPlayerReactPlayer path={video.url} key={index}/>
								{MediaDescription(video)}
							</div>
						))}
					</Carousel>
				</div>
			</div>
		</div>
	)
}