import CheckBox from "../Common/CheckBox/CheckBox"
export const AddToListItem = (item) => {
	return (
		<div className={"d-flex flex-row align-items-center w-100 justify-content-between mt-2"}>
			<div className="text-left my-2">
				<h2 className="font-weight-bold mb-0">{item.name}</h2>
				<p className="mb-0">
					av mig <strong>·</strong> {item.numberOfActivities} aktiviter
				</p>
			</div>
			<div className="">
				<CheckBox />
			</div>
		</div>
	)
}
