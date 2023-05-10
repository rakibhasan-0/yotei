import "./ActivityItem.css"
export default function ActivityItem({categoryName, id, inputDisabled, text}) {

	function onKeyDown(e){
		e.target.style.height = "inherit"
		e.target.style.height =  `${e.target.scrollHeight}px`
	}

	return (
		<fieldset className="mt-5 mb-5 py-2 container workout-activity-item" id={id}>
			{categoryName != null && <legend className="px-2 h3 w-auto">{categoryName}</legend>}
			<textarea className={"activity-item-textArea"} onChange={(e) => e.target.value} onKeyDown={onKeyDown} placeholder={"Fri text ..."} disabled={inputDisabled} value={inputDisabled ? text : ""}/>
		</fieldset>
	)
}