import Button from "../Common/Button/Button"
import {Link45deg as LinkIcon} from "react-bootstrap-icons"
import InputTextField from "../Common/InputTextField/InputTextField"
import {Upload as UploadIcon}  from "react-bootstrap-icons"
import { useState } from "react"
import "./UploadMedia.css"
import { AccountContext } from "../../context"
import React, { useContext } from "react"
import ReactPlayer from "react-player"
import Spinner from "../Common/Spinner/Spinner"
import {toast} from "react-toastify"

/**
 * Handles uploading media to the server, both URLs only aswell as complete media files.
 * 
 * Props:
 *     id @type {number}  - Id of component
 *     exerciseId  @type {number} - Id of an exercise or technique that the uploaded media belongs to 
 *
 * Example usage:
 *     <UploadMedia id={11} exerciseId={current_technique}/>
 *
 * @author Team Dragon (Group 3)
 * @version 1.0
 * @since 20XX-XX-XX
 */

function UploadMedia({id, exerciseId, fetchMediaMetaToBeUploaded, fetchMediaFilesThatWasUploaded}) {
	const [link, setLink] = useState("")
	const context = useContext(AccountContext)
	const [selectedFile, setSelectedFile] = useState()
	const [hasFile, setHasFile] = useState(false)
	const [showSpinner, setShowSpinner] = useState(false)

	/**
	 * Selects file from file-event. Activates button to upload media.
	 * @param {*} event 
	 */
	function onFileChange(event) {
		// Update the state
		setSelectedFile(event.target.files[0])
		setHasFile(true)
	}

	/**
     * Is called when the upload-media button is clicked
     */
	function uploadMediaClicked() {
		uploadMediaFile(selectedFile)
	}

	/**
	 * Send POST request to server and upload the currently selected file.
	 */
	async function uploadMediaFile(file){
		setShowSpinner(true)

		var data = new FormData()
		var responseData
		data.append("file", file)
		
		
		// Request made to the backend api
		// Send formData object
		const requestOptions = {
			headers: { "token": context.token },
			method: "POST",
			body: data
		}
       
		try {

			const response = await fetch("/api/media/upload", requestOptions)

			if (response.ok) {
				responseData =  await response.json()

				//upload meta-data of media. The response should contain the url where the media can be reached.
				//Metadata of media
				let media = {
					movementId : exerciseId, 
					localStorage :true, 
					description: "todo", 
					url: "/api/media/files/"+responseData.filename, 
					image: !isPlayableVideoMedia(responseData.filename)
				}
				
				fetchMediaFilesThatWasUploaded(media)
				fetchMediaMetaToBeUploaded(media)
			}else{
				setErrorToast(await errorMessageForResponse(response))
			}
		} catch (error) {
			setErrorToast(error.message)
		}
		setShowSpinner(false)
	}

	/**
	 * checks if media can be played on the React Player
	 * @param {String} url 
	 * @returns true if is a playable video for the ReactPlayer, false else
	 */
	function isPlayableVideoMedia(url){
		let isPlayable = false
		if (ReactPlayer.canPlay(url)) {
			isPlayable = true
		} 

		return isPlayable
	}



	/**
     * Is called when the link-to-media button is clicked. Uploads information of the media to server.
     */
	function linkMediaClicked() {	
		if (link !== "") {
			let media = {
				movementId : exerciseId, 
				localStorage :false, 
				description: "todo", 
				url: link, 
				image: !isPlayableVideoMedia(link)
			}
			fetchMediaMetaToBeUploaded(media)
		} 
	}
	
	
	/**
	 * Display an error message
	 * @param {String} text 
	 */
	const setErrorToast = (text) => {
		if(!toast.isActive("error-toast")){
			toast.error(text, {toastId: "error-toast"})
		}
	}

	/**
	 * Show data of a file
	 * @returns html element
	 */
	function showFileData(){
     
		if (selectedFile) {
			return (
				<div style={{marginTop: 20}}>
					{showSpinner && <div><p>Laddar upp...</p>  <Spinner id="test-id"/></div>}
					<h2 style={{marginTop : 10}}>Fil-Detaljer:</h2>
					<p className="file-detail">Namn: {selectedFile.name}</p>
					<p className="file-detail">Typ: {selectedFile.type}</p>
					<p className="file-detail">
                    Storlek:{" "}
						{selectedFile.size > 1048576 ? Math.ceil(selectedFile.size/1048576).toString() +"mB" : Math.ceil(selectedFile.size/1924).toString() +"kB" }
					</p>
	
				</div>
			)
		}
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


	return (
		<div id={id}>
			<div className="upload-media-container">
				<div className="uppload-file-btn-wrapper">
					<Button width={"100%"}>
						Välj Fil
					</Button>
					<input className="media-file-input" type="file" onChange={onFileChange} />
				</div>
				<Button onClick={uploadMediaClicked}
					width={"100%"}
					disabled={!hasFile}>
					<div className="upload-media-btn">
						<UploadIcon size="15%"/> 
						Ladda Upp Media
					</div>
				</Button>
				{showFileData()}
			</div>
			<hr className="line"/>
			<div className="d-flex justify-content-center link-media-container">
				<div>
					<InputTextField
						id="link-input"
						placeholder={"Klistra in länk"} 
						onChange={e => {setLink(e.target.value)}}>
					</InputTextField>
				</div>
				<div>
					<Button onClick={linkMediaClicked}
						width={"100%"}
						disabled={link.length == 0}
					>
						<div className="upload-link-btn"><LinkIcon  size="15%" /> Länka Till Media</div>
					</Button>
				</div>
				
			</div>
		</div>
	)
}

export default UploadMedia