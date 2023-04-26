import { Cookies } from "react-cookie"

export function logOut() {
	new Cookies().remove("token")
	document.location.href = "/"
}