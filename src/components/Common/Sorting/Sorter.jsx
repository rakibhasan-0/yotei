import React from "react"
import Component from "../List/Dropdown"
import style from "./Sorter.module.css"
import "../BeltPicker/BeltPicker.module.css"
/**
 * A dropdown containing sorting options. The options are required to be 
 * objects that have a "label" attribute but can otherwise contain any type 
 * of data. The "onSortChange" function will be called whenever the currently 
 * selected option is changed.
 * 
 * @usage Example:
 * const sortOptions = [
 *    {label: "option1", ...},
 *    {label: "option2", ...}
 * ]
 * const [sort, setSort] = useState()
 * <Sorter id="foo" onSortChange={setSort} selected={sort} options={sortOptions} />
 * @author Phoenix, edited by Cyclops (Group 5)
 * @version 2.0
 * 
 * @param {*} param0 
 * @returns 
 */
export default function Sorter ({ id, selected, onSortChange, options }) {    
	return (
		<Component
			text={
				<p className={style.sortText} style={{ display: "flex", flexDirection: "row", margin:"0"}}>
                Sortera efter:
					<p style={{ margin:"0", marginLeft:"4px", alignSelf:"center"}}>
						{selected && selected.label}
					</p>
				</p>}
			id={id}
		>
			<div role="list" className={style.sort}>
				{ options && options.map((option, index) => {
					return (
						<div role="listitem" key={index}
							className={`
								${style.sortItem} 
								${selected.label === option.label ? style.sortText : ""}
							`}
							onClick={() => onSortChange(option)}>
							<p style={{margin:"0", alignSelf:"center"}}>{option.label}</p>
						</div>
					)
				})}
			</div>
		</Component>
	)
}