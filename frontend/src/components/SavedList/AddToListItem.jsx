import { useContext } from "react"
import CheckBox from "../Common/CheckBox/CheckBox"
import { AccountContext } from "../../context"

export const AddToListItem = ({ item, onCheck }) => {
    const userContext = useContext(AccountContext)
    const authorName = item.author.id === userContext.userId ? "av mig" : item.author.username

    return (
        <div className={"d-flex flex-row align-items-center w-100 justify-content-between mt-2"}>
            <div className="text-left my-2">
                <h2 className="font-weight-bold mb-0">{item.name}</h2>
                <p className="mb-0">
                    {authorName} <strong>·</strong> {item.numberOfActivities} aktiviteter
                </p>
            </div>
            <div className="">
                <CheckBox onClick={() => onCheck(item.id)} />
            </div>
        </div>
    )
}
