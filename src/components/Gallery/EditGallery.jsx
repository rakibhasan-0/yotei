import React, { useCallback, useEffect, useState , useContext} from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from "react-responsive-carousel"
import VideoPlayerReactPlayer from "../VideoPlayer/VideoPlayerReactPlayer"
import Image from "../Image/Image"
import Popup from "../Common/Popup/Popup"
import "../Gallery/EditGallery.css"
import { AccountContext } from "../../context"
import {Plus as PlusIcon} from "react-bootstrap-icons"
import {Trash as TrashIcon } from "react-bootstrap-icons"
import {CameraVideoOff as NoMediaIcon } from "react-bootstrap-icons"
import UploadMedia from "../Common/Upload/UploadMedia"
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
export default function EditGallery({ id }) {
	// api call to get links for media is done "HERE" and save it to var dummy. 
	// We need to filter pictures and videos to two different arrays
	
	const [media, setMedia] = useState([])
	const context = useContext(AccountContext)
	const [showPopup, setShowPopup] = useState(false)
	let pictures = []
	let videos = []
	
	/**
	 * Callback for retrieving media from server
	 */
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
			} else {
				setMedia([])
			}
		} catch (error) {
			console.log(error)
		}
	}, [context.token, id])

	/**
	 * Call rerender as soon as new media is fetched
	 */
	useEffect(() => {getMedia()}, [getMedia])

	//Divide media objects into pictures- and videos- array
	media.map((m) => {
		if (m.image == true) {
			pictures.push(m)
		} else {
			videos.push(m)
		}
	})

	/**
	 * Sends a remove request for a specific MediaObject to server
	 * 
	 * @param {Media} mediaObject 
	 */
	async function removeMedia(mediaObject){
		console.log(mediaObject)
		const requestOptions = {
			method: "DELETE",
			headers: { "Content-type": "application/json", "token": context.token },
			body: JSON.stringify({
				id: mediaObject.id,
				movementId: mediaObject.movementId,
				url: mediaObject.url,
				localStorage: mediaObject.localStorage,
				image: mediaObject.image,
				description: mediaObject.description
			})
		}
		try {
			const response = await fetch(`/api/media/remove/${mediaObject.id}`, requestOptions)

			if (response.ok) {
				//Popup eller nåt? Rerender?
				console.log("vi skickade någonting")
				getMedia()
				media.map((m) => {
					if (m.image == true) {
						pictures.push(m)
					} else {
						videos.push(m)
					}
				})
			}else{
				//Felmeddelande?
				//setMedia([])
			}
		} catch (error) {
			console.log(error)
		}
	}


	/**
	 * Is displayed if no media is avaliable
	 */
	const NoMedia = <div className = "d-flex flex-column justify-content-center align-items-center no-media-container border">
		<NoMediaIcon size={"20%"} ></NoMediaIcon>
		<span>Ingen media just nu, ladda upp genom att klicka på plus</span>
	</div>

	/**
	 * Popup for uploading new media
	 */
	const UploadPopup = <div>
		<Popup id={"test-popup"} title={"Test"} isOpen={showPopup} setIsOpen={setShowPopup} >
			<UploadMedia id={id} exercise_id={id}/>	
		</Popup>
	</div>

	return (
		
		<div className="container" id={id}>
			{UploadPopup}	
			<div className="row mt-2 mb-2">
				<div className="col-sm-12 text-center ">
					<Carousel showThumbs={false} >                         
						{pictures.map((image, index) => (
							<div key={index} style={{backgroundColor : "var(--black-primary)"}}  className="d-flex flex-column justify-content-center">
								<Image path={image.url} />
								<TrashIcon onClick={() => removeMedia(image)} className="btn trash" color="var(--red-primary)" size={100}></TrashIcon>
							</div>
						))}
						{videos.map((video, index) => (
							<div key={index} style={{backgroundColor : "var(--black-primary)"}}>
								<VideoPlayerReactPlayer path={video.url} editMode={true} />
								<TrashIcon onClick={() => removeMedia(video)} className="btn trash" color="var(--red-primary)" size={100}></TrashIcon>
							</div>
						))}
					</Carousel>
				</div>
			</div>
			{pictures.length < 1 && videos.length < 1 && NoMedia}
			<div onClick={() => setShowPopup(true)} className="btn btn-color btn-add-media d-flex justify-content-center">
				<PlusIcon size={100} ></PlusIcon>			
			</div>		
		</div>
	)
}