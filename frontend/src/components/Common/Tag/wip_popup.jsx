



const getPopupContents = async (tagId) => {
	const url = new URL("/api/tags/usage", window.location.origin)
	url.searchParams.append("tag-id", tagId)
	const requestOptions = {
		method: "GET",
		headers: {"Content-type": "application/json",token }
	}

	try {
		const response = await fetch(url, requestOptions)
		if (!response.ok) {
            setError("Något gick fel vid hämtning av tagganvändning")
		}
        const usage = await response.json()
        return createPopupContents(usage)

	} catch (error) {
		setError("Något gick fel vid hämtning av tagganvändning")
	}
}


const createPopupContents = (usage) => {
    // TODO: Använd inte hex kod direkt.
    return <div >
        Denna tagg används på:
        <br/>

        tag.ex > 0 ? <span style="color: #f000f0">x</span> övning{tag.ex > 1 ? "ar" : ""} 
        <br/> : null
        <span style="color: #f000f0">x</span> teknik{tag.te > 1 ? "er" : ""}
        <br/>
        <span style="color: #f000f0">x</span> pass
    </div>
}