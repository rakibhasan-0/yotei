import React, { useCallback, useEffect, useState , useContext} from "react"
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import { Carousel } from "react-responsive-carousel"
import VideoPlayerReactPlayer from "../VideoPlayer/VideoPlayerReactPlayer"
import Image from "../Image/Image"
import Popup from "../Common/Popup/Popup"
import ConfirmPopup from "../Common/ConfirmPopup/ConfirmPopup"
import "../Gallery/EditGallery.css"
import "../Gallery/Gallery.css"
import { AccountContext } from "../../context"
import {Plus as PlusIcon} from "react-bootstrap-icons"
import {Trash as TrashIcon } from "react-bootstrap-icons"
import {CameraVideoOff as NoMediaIcon } from "react-bootstrap-icons"
import UploadMedia from "../Common/Upload/UploadMedia"
import ReactPlayer from "react-player"
/**
 * A media component for displaying video or images.
 * 
 * Props:
 *     id @type {number}  - The id of the component (for testing)
 *	   exerciseId @type {number}  - The id of a techique/exercise
 *
 * Example usage:
 *
 * @author Team Dragon (Grupp 3)
 * @version 1.0
 * @since 2023-05-04
 */
export default function EditGallery({ id, exerciseId, sendData }) {
	const [media, setMedia] = useState([])
	const context = useContext(AccountContext)
	const [showAddPopup, setShowAddPopup] = useState(false)
	const [showRemovePopup, setShowRemovePopup] = useState(false)
	const [selectedMedia, setSelectedMedia] = useState()

	const [mediaToRemove, setMediaToRemove] = useState([])
	const [mediaList, setMediaList] = useState([])

	// We need to filter pictures and videos to two different arrays
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
			const response = await fetch(`/api/media/${exerciseId}`, requestOptions)

			if (response.ok) {
				const data =  await response.json()
				setMedia(data) 
			} else {
				setMedia([])
			}
		} catch (error) {
			console.log(error)
		}
	}, [context.token, exerciseId])

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
	 * Sends a remove request for the currently selected MediaObject to server
	 * 
	 */
	async function removeMedia(){
		setMediaToRemove(mediaToRemove => [...mediaToRemove, selectedMedia])
		let temp = [... media]
		var index = temp.indexOf(selectedMedia)
		temp.splice(index, 1)

		setMedia(temp)
	}

	/**
	 * Is displayed if no media is avaliable
	 */
	const NoMedia = <div id={"no-media-box"}
		className = "d-flex flex-column justify-content-center align-items-center no-media-container border">
		<NoMediaIcon size={"20%"} ></NoMediaIcon>
		<span>Ingen media just nu, ladda upp genom att klicka på plus</span>
	</div>

	/**
	 * Popup for uploading new media
	 */
	const UploadPopup = <div>
		<Popup id={`${exerciseId}-upload-popup`} title={"Lägg Till Media"} isOpen={showAddPopup} setIsOpen={setShowAddPopup} >
			<UploadMedia id={`${exerciseId}-upload-page`} exerciseId={exerciseId} fetchUrl={fetchUrl}/>	
		</Popup>
	</div>

	/**
	 * Popup for confirming the removal of current media
	 */
	const ConfirmRemovePopup =
		<ConfirmPopup id={"confirm-remove-popup"}
			showPopup={showRemovePopup} 
			setShowPopup={setShowRemovePopup} 
			onClick={removeMedia}
			popupText="Är du säker?"/>

	/**
	 * Button for requesting removal of a media-object
	 * 
	 * @param {Media} mediaObject the object that should be removed
	 * @returns 
	 */
	function RemoveButton(mediaObject){
		return(
			<div id={`${mediaObject.id}-removal-button`}  
				className="btn remove-media-button" 
				onClick={() => {setupRemovePopup(mediaObject)}} 
			>
				<TrashIcon color="var(--red-primary)" size={40}></TrashIcon>
			</div>
		)
	}
	
	/**
	 * The add-media-button
	 */
	const AddButton = 
	<div id="add-media-button" 
		onClick={() => setShowAddPopup(true)} 
		className="btn btn-color btn-add-media d-flex justify-content-center">
		<PlusIcon size={100} ></PlusIcon>			
	</div>	

	/**
	 * Sets the currently requested media and shows a confirm-removal-popup
	 * @param {Media} mediaObject the object that should be removed
	 */
	const setupRemovePopup = (mediaObject) => {
		setSelectedMedia(mediaObject)
		setShowRemovePopup(true)
	}

	

	/**
     * fetches an url as a string and appends it to an array of JSON objects for API call
     * 
     * @param {String} media 
     */
	function fetchUrl(m) {
        
		if (m !== "") {
			let image = true
            
			if (ReactPlayer.canPlay(m)) {
				image = false
			} 

			let body = {
				movementId: id,
				url: m,
				localStorage: false,
				image: image,
				description: "This is a youtube"
			}

			setMediaList(mediaList => [...mediaList, body])
			
			// experimental for showing in the gallery that something has been added. Only visual feedback for the user
			setMedia(media => [...media, body])
			setShowAddPopup(false)
		}
	}

	/**
     * calls the API for storing newly added links
     */
	async function postMedia(list) {

		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", "token": context.token },
			body: JSON.stringify(list)
		}
		try {
            
			const response = await fetch("/api/media/add", requestOptions)

			if (response.ok) {
				console.log("Post request sent")
			} 
		} catch (error) {
			console.log(error)
		}
        
	}

	async function deleteMedia(list) {
		const requestOptions = {
			method: "DELETE",
			headers: { "Content-type": "application/json", "token": context.token },
			body: JSON.stringify(list)
		}
		try {
			const response = await fetch("/api/media/remove", requestOptions)
            
			if (response.ok) {
				console.log("remove request sent")
			}
		} catch (error) {
			console.log(error)
		}
	}


	const makeAPICalls = async () => {
		await postMedia(mediaList)
		deleteMedia(mediaToRemove)
	}
	
	useEffect(() => {
		
		if (sendData) {
			makeAPICalls()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sendData])

	return (
		
		<div className="container" id={id}>
			{ConfirmRemovePopup}
			{UploadPopup}
			<div className="row mt-2 mb-2">
				<div className="col-sm-12 text-center ">
					<Carousel showThumbs={false} showStatus={false}>                         
						{pictures.map((image, index) => (
							<div key={index} style={{backgroundColor : "var(--black-primary)"}}  className="d-flex flex-column justify-content-center">
								<Image id={`${image.id}-image`} path={image.url} />
								{RemoveButton(image)}
							</div>
						))}
						{videos.map((video, index) => (
							<div key={index} style={{backgroundColor : "var(--black-primary)"}}>
								<VideoPlayerReactPlayer id={`${video.id}-video-player`} path={video.url} editMode={true} />
								{RemoveButton(video)}
							</div>
						))}
					</Carousel>
				</div>
			</div>
			{pictures.length < 1 && videos.length < 1 && NoMedia}
			{AddButton}
		</div>
	)
}