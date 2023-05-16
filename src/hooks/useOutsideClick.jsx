import { useEffect } from "react"

/**
 * Hook that runs a given function when a click
 * happens outside a given element.
 * 
 * @param ref - A ref to the element to check.
 * @param {function} onOutsideClick - The action to perform when a click happens
 * 									  outside the element which a ref is placed on.
 * @author Medusa
 * @since 2023-05-10
 */
export default function useOutsideClick(ref, onOutsideClick) {
	useEffect(() => {
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				onOutsideClick()
			}
		}
		// Bind event listener
		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			// Unbind event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [ref, onOutsideClick])
}