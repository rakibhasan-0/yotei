import Button from "../Button/Button"
import {Link45deg as LinkIcon} from "react-bootstrap-icons"
import InputTextField from "../InputTextField/InputTextField"
import {Upload as UploadIcon}  from "react-bootstrap-icons"
import { useState } from "react"
import "./UploadMedia.css"
import { AccountContext } from "../../../context"
import React, { useContext } from "react"
import ReactPlayer from "react-player"

/**
 * Handles uploading media to the server, both URLs only aswell as complete media files
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

function UploadMedia({id, exerciseId}) {
	const [link, setLink] = useState("")
	const context = useContext(AccountContext)
	//const {token, setToken} = useContext(AccountContext)

	
	/**
     * Is called when the upload-media button is clicked
     */
	async function uploadMediaClicked() {
		setLink("Upload")
	}

	/**
     * Is called when the link-to-media button is clicked
     */
	async function linkMediaClicked() {
		if (link !== "") {
			let image = true

			if (ReactPlayer.canPlay(link)) {
				image = false
			} 
			
			const requestOptions = {
				method: "POST",
				headers: { "Content-type": "application/json", "token": context.token },
				body: JSON.stringify([{
					movementId: exerciseId,
					url: link,
					localStorage: false,
					image: image,
					description: "This is a youtube"
				}])
			}
			
			try {
				
				const response = await fetch("/api/media/add", requestOptions)
	
				if (response.ok) {
					const data =  await response.json()
					window.location.reload(true) // ugly autoupdate after fetch
					console.log(data)
				} 
			} catch (error) {
				console.log(error)
			}
	
			console.log(link)
		} 

	}

	return (
		<div id={id}>
			<div className="d-flex justify-content-center upload-media-container">
				<Button onClick={uploadMediaClicked}
					outlined={false}
					width={"100%"}
				>
					<div><UploadIcon size="15%"/> Ladda Upp Media</div>
				</Button>
			</div>
			<hr className="line"/>
			<div className="d-flex justify-content-center link-media-container">
				<div>
					<InputTextField
						placeholder={"Klistra in länk"} onChange={e => {setLink(e.target.value)}}>
						
					</InputTextField>
				</div>
				<div>
					<Button onClick={linkMediaClicked}
						outlined={false}
						width={"100%"}
					>
						<div><LinkIcon  size="15%" /> Länka Till Media</div>
					</Button>
				</div>
				
			</div>
		</div>
	)
}

export default UploadMedia