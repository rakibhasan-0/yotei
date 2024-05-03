import React from "react"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import CheckBox from "../../components/Common/CheckBox/CheckBox"
import DatePicker from "../../components/Common/DatePicker/DatePicker"
import BeltPicker from "../../components/Common/BeltPicker/BeltPicker"
import style from "./FilterStatistics.module.css"


export default function FilterStatistics() {
	return (
		<div>
			<FilterContainer id="filter-container" title="Filtering" numFilters={0}>
				<div className={style.dateContainer}>
					<h2>Från</h2>
					<div></div>
					<DatePicker
						id="start-date-picker"
						minDate={"2023-05-11"}
						maxDate={"2026-05-07"}
					/>
				</div>
				
				<div className={style.dateContainer}>
					<h2>Till</h2>
					<div></div>
					<DatePicker
						id="end-date-picker"
						minDate={"2023-05-11"}
						maxDate={"2026-05-07"}
					/>
				</div>

				<BeltPicker
					id={"techniqueFilter-BeltPicker"}
					onToggle={() => {}}
					states={[]}
					onClearBelts={() => {}}
					filterWhiteBelt={false}
				/>

				<div className={style.checkboxContainer}>
					<h2>Visa Övningar</h2>
					<div></div>
					<CheckBox
						id={"techniqueFilter-VisaÖvningar"}
						checked={false}
						onClick={() => {}}
					/>
				</div>

				<div className={style.checkboxContainer}>
					<h2>Kihon</h2>
					<div></div>
					<CheckBox
						id={"techniqueFilter-KihonCheck"}
						checked={false}
						onClick={() => {}}
					/>
				</div>

			</FilterContainer>

		</div>
	)
}
