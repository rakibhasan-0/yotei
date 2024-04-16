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
import {Trash as TrashIcon } from "react-bootstrap-icons"
import {CameraVideoOff as NoMediaIcon } from "react-bootstrap-icons"
import UploadMedia from "../Upload/UploadMedia"
import {toast} from "react-toastify"
import TextArea from "../Common/TextArea/TextArea"
import Button from "../Common/Button/Button"

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
export default function EditGallery({ id, exerciseId, sendData, undoChanges, done }) {
	const [media, setMedia] = useState([])
	const context = useContext(AccountContext)
	const [showAddPopup, setShowAddPopup] = useState(false)
	const [showRemovePopup, setShowRemovePopup] = useState(false)
	const [selectedMedia, setSelectedMedia] = useState()

	const [mediaToRemove, setMediaToRemove] = useState([])
	const [mediaThatWasUploaded, setMediaThatWasUploaded] = useState([])
	const [mediaToBeAdded, setMediaToBeAdded] = useState([])

	const [descMap, setDescMap] = useState(new Map())

	// We need to filter pictures and videos to two different arrays
	let pictures = []
	let videos = []

	
	/**
	 * Callback for retrieving media from server
	 */
	const getMedia = useCallback(async () => {
		
		if (exerciseId !== "") {
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
				console.error(error)
			}
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
		<span className = "no-media-span">Ingen media just nu, ladda upp genom att klicka på plus</span>
	</div>


	/**
	 * Popup for uploading new media
	 */
	const UploadPopup = <div>
		<Popup id={`${exerciseId}-upload-popup`} title={"Lägg Till Media"} isOpen={showAddPopup} setIsOpen={setShowAddPopup} >
			<UploadMedia 
				id={`${exerciseId}-upload-page`} 
				exerciseId={exerciseId} 
				fetchMediaMetaToBeUploaded = {fetchMediaMetaToBeUploaded}
				fetchMediaFilesThatWasUploaded = {fetchMediaFilesThatWasUploaded}/>	
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
				<TrashIcon color="var(--red-primary)" size={30}></TrashIcon>
			</div>
		)
	}

	
	/**
	 * Sets the currently requested media and shows a confirm-removal-popup
	 * @param {Media} mediaObject the object that should be removed
	 */
	const setupRemovePopup = (mediaObject) => {
		setSelectedMedia(mediaObject)
		setShowRemovePopup(true)
	}
	

	/**
     * fetches mediaData that should be added to server
	 * 
     * @param {Media} mediaData 
     */
	function fetchMediaMetaToBeUploaded(mediaData) { //should also have localStorage and description
		
		setMediaToBeAdded(mediaToBeAdded => [...mediaToBeAdded, mediaData])
			
		// experimental for showing in the gallery that something has been added. Only visual feedback for the user
		setMedia(media => [...media, mediaData])
		setShowAddPopup(false)
		
	}


	/**
     * fetches mediaData whose file was uploaded to server
     * 
     * @param {Media} media 
     */
	function fetchMediaFilesThatWasUploaded(mediaData) { //should also have localStorage and description
		
		setMediaThatWasUploaded(mediaThatWasUploaded => [...mediaThatWasUploaded, mediaData])
		setShowAddPopup(false)
	}


	/**
	 * Upload a media-object to server containing meta-data of a media-url
	 * @param {Media} media 
	 */
	async function postMedia(list) {

		list.map((m) => {
			m.movementId = exerciseId
		})
		
		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", "token": context.token },
			body: JSON.stringify(list)
		}
		try {
			const response = await fetch("/api/media", requestOptions)

			if (response.ok) {
				//setSuccessToast(await response.text())
			}else{
				//Something went wrong
				setErrorToast(await errorMessageForResponse(response))
			}
			
		} catch (error) {
			setErrorToast(error.message)
		}
        
	}


	/**
	 * Display an error message
	 * @param {String} text 
	 */
	const setErrorToast = (text) => {
		if(!toast.isActive("error-toast")){
			setErrorToast(text, {toastId: "error-toast"})
		}
	}
	
	
	/**
	 * API call for removing media objects.
	 * @param {*} list of media objects to remove
	 */
	async function deleteMedia(list) {

		list.map((m) => {
			m.movementId = exerciseId
		})

		const requestOptions = {
			method: "DELETE",
			headers: { "Content-type": "application/json", "token": context.token },
			body: JSON.stringify(list)
		}
		try {
			await fetch("/api/media", requestOptions)
		} catch (error) {
			console.error(error)
		}
	}


	/**
	 * Makes all the nessesary API calls: POST, PUT and DELETE
	 */
	const makeAPICalls = async () => {
		

		await postMedia(mediaToBeAdded)
		await putDescription(descMap)
		await deleteMedia(mediaToRemove)
		done()
	}


	/**
	 * Edits the description of different media objects when changed 
	 * in the edit view.
	 * @param {*} map a hashmap containing the key value pair: media_id, description
	 */
	async function putDescription(map) {
		
		let payload = []

		for (let [key, value] of map) {
			const body = {
				id: key,
				description: value
			}
			payload.push(body)
		}

		const requestOptions = {
			method: "PUT",
			headers: { "Content-type": "application/json", "token": context.token },
			body: JSON.stringify(payload)
		}
		try {
			await fetch("/api/media", requestOptions)
		} catch (error) {
			console.error(error)
		}
	}

	
	/**
	 * Triggered when the sendData boolean is changed to true in the parent 
	 * component. This change triggers the api call and resets the cache.
	 */
	useEffect(() => {
		
		if (sendData) {
			makeAPICalls()
			setMediaToBeAdded([])
			setMediaToRemove([])
			setMediaThatWasUploaded([])
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sendData])


	/**
	 * Triggered when the undoChanges boolean is changed by the parent 
	 * component, indicating that no data should be saved. Since the file upload
	 * starts immediately in the background increase performance a delete API 
	 * call is needed.
	 */
	useEffect(() => {
		if(undoChanges){
			deleteFileAPICalls()
			setMediaThatWasUploaded([])
		}
	}, [undoChanges])


	/**
	 * API call for deleting upploaded files.
	 */
	const deleteFileAPICalls = async () => {
		await deleteMedia(mediaThatWasUploaded)
		done()
	}


	/**
	 * Return a string to display to user depending on a http-response
	 * @param {*} response a http response
	 * @returns 
	 */
	async function errorMessageForResponse(response){
		let errorText = await response.text() 
		if(errorText == null || errorText == ""){
			errorText = "Något gick fel! : " + response.statusText
		}
		return errorText
	}


	/**
	 * Used for adding description into gallery.
	 * @param {*} mediaObject image or video that has a description.
	 * @returns a paragraph with description connected to mediaObject.
	 */
	function MediaDescription(mediaObject){
		
		return(	
			<TextArea defVal={mediaObject.description} onChange={e => {
				setDescMap(descMap.set(mediaObject.id, e.target.value))
			}} />
		)
	}


	return (
		
		<div className="container mb-2 d-flex flex-column" style={{alignItems : !media.length ? "center" : "normal"}} id={id}>
			{ConfirmRemovePopup}
			{UploadPopup}
			<div className="row mt-2 mb-4"  style={{backgroundColor : media.length ? "var(--black-primary)" : "var(--background)"}}>
				<div className="col-sm-12 text-center ">
					<Carousel showThumbs={false} showStatus={false}>                         
						{pictures.map((image, index) => (
							<div key={index} className="d-flex flex-column justify-content-center align-items-center">
								<Image id={`${image.id}-image`} path={image.url} />
								{MediaDescription(image)}
								{RemoveButton(image)}
							</div>
						))}
						{videos.map((video, index) => (
							<div key={index}>
								<VideoPlayerReactPlayer id={`${video.id}-video-player`} path={video.url} editMode={true} />
								{MediaDescription(video)}
								{RemoveButton(video)}
							</div>
						))}
					</Carousel>
				</div>
			</div>
			{pictures.length < 1 && videos.length < 1 && NoMedia}
			<div className="d-flex flex-column justify-content-center align-items-center" style={{width: "100%"}}>
				<Button id={"add-media-button"} onClick={() => setShowAddPopup(true)}>
					<h2>+ Media</h2>
				</Button>
			</div>
		</div>
	)
}