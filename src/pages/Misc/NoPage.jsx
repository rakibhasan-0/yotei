import ErrorState from "../../components/Common/ErrorState/ErrorState"
import { useNavigate } from "react-router-dom"

/**
 * @returns An empty page with 404 text on it.
 * @author Chimera
 * @since 2023-05-22
 */
const NoPage = () => {
	const navigate = useNavigate()
	return   <ErrorState 
		message="404 sidan hittades inte!"
		onBack={() => {navigate("/plan")}}
		id="error-id"
	/>
}

export default NoPage