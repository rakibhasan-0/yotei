import { useState, useEffect, useContext, useCallback } from "react"
import { useNavigate, useParams } from "react-router"
import { AccountContext } from "../../../context"

import Tag from "../../../components/Common/Tag/Tag"
import Button from "../../../components/Common/Button/Button"
import BeltIcon from "../../../components/Common/BeltIcon/BeltIcon"

import { Pencil, Trash } from "react-bootstrap-icons"

import "./TechniqueDetail.css"
import ErrorState from "../../../components/Common/ErrorState/ErrorState"
import Spinner from "../../../components/Common/Spinner/Spinner" 

/**
 * The detail page for a technique.
 * 
 * Props:
 * 		id: The id used for testing purposes.
 * 
 * Example usage:
 * 	   <TechniqueDetail id="test-id"/>
 * 
 * @author Team Medusa (Grupp 6)
 * @version 1.0
 * @since 2023-05-03
 */
function TechniqueDetail({id}) {

	const { techniqueId } = useParams()
	const { token } = useContext(AccountContext)
	const navigate = useNavigate()

	const [technique, setTechnique] = useState()
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(true)

	const handleGet = useCallback(() => {
		setLoading(true)
		setError("")
		fetch(`/api/techniques/${techniqueId}`, {headers: {token}})
			.then(async res => {
				if(!res.ok) {
					// Quick fix with + " " because old API returns empty body on 404.
					setError(await res.text() + " ")
					setLoading(false)
					return
				}
				const technique = await res.json()
				setTechnique(technique)
				setLoading(false)
			})
			.catch(() => {
				setError("Ett nätverksfel inträffade. Kontrollera din internetuppkoppling.")
				setLoading(false)
			})
	}, [techniqueId, token])

	useEffect(() => handleGet(), [handleGet, techniqueId, token])

	async function handleDelete() {
		try {
			const res = await fetch("/api/techniques/" + techniqueId, {
				headers: {token},
				method: "DELETE"
			})
	
			if (!res.ok) {
				const msg = await res.text()
				// Quick fix with + " " because old API returns empty body on 404.
				setError(msg + " ")
				return
			}
			navigate("/technique")
		} catch (err) {
			setError("Ett nätverksfel inträffade. Kontrollera din internetuppkoppling.")
		}
	}

	if(error != "") return <ErrorState
		message={error}
		onBack={() => navigate("/technique")}
		onRecover={handleGet}
	/>

	if(loading) return <div className='technique-detail-center-spinner'><Spinner/></div>

	return(
		<div className="technique-detail-container" id={id == undefined ? "technique" : id}>
			<h1>{technique.name}</h1>
			<div className="technique-detail-actions-container">
				<Pencil
					size="24px"
					color="var(--red-primary)"
					style={{cursor: "pointer"}}
					onClick={() => navigate("/technique/edit/" + techniqueId)}
				/>
				<Trash
					size="24px"
					color="var(--red-primary)"
					style={{cursor: "pointer"}}
					onClick={handleDelete}
				/>
			</div>
			<p style={{marginBottom: 0}}>{technique.isKihon ? "Kihon" : "Ej kihon"}</p>
			<div className="technique-detail-belts-container">
				{technique.belts ? (
					technique.belts.map(belt => <BeltIcon key={belt.name} color={"#" + belt.color} child={belt.child}/>)
				) : (
					<p>Inga bälten kunde hittas för denna teknik.</p>
				)}
			</div>
			<h2>Beskrivning</h2>
			{technique.description ? (
				<p>{technique.description}</p>
			) : (
				<p>Denna teknik saknar beskrivning.</p>
			)}
			<h2>Taggar</h2>
			<div className="technique-detail-tag-container">
				{technique.tags ? (
					technique.tags.map(tag => <Tag key={tag.id} text={tag.name} tagType="default"/>)
				) : (
					<p>Denna teknik saknar taggar.</p>
				)
				}
			</div>

			<div className="technique-detail-button-container">
				<Button outlined={true} onClick={() => navigate("/technique")}>
					<p>Tillbaka</p>
				</Button>
			</div>
		</div>
	)
}

export default TechniqueDetail
