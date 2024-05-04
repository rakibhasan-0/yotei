import React, { useContext } from "react"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import CheckBox from "../../components/Common/CheckBox/CheckBox"
import DatePicker from "../../components/Common/DatePicker/DatePicker"
import BeltPicker from "../../components/Common/BeltPicker/BeltPicker"
import style from "./FilterStatistics.module.css"


/**
 * 
 * The work is on progress for the statistics page.
 */

export default function FilterStatistics({ onToggleExercise, onToggleKihon, onDateChanges, onToggleBelts, onClearBelts, belts}) {
  return (
    <div>
      <FilterContainer id="filter-container" title="Filtering" numFilters={0}>
        <div className={style.dateContainer}>
          <h2>Från</h2>
          <div></div>
          <DatePicker
            id="start-date-picker"
            //selectedDate={date.startDate}
			//minDate={}
            onChange={(e) => {
              onDateChanges("from", e.target.value);
            }}
          />
        </div>

        <div className={style.dateContainer}>
          <h2>Till</h2>
          <div></div>
          <DatePicker
            id="end-date-picker"
            //selectedDate={getFormattedDateString(new Date())}
            onChange={(e) => {
              onDateChanges("to", e.target.value);
            }}
          />
        </div>

        <BeltPicker
          id={"techniqueFilter-BeltPicker"}
          onToggle={onToggleBelts}
          states={belts}
          onClearBelts={onClearBelts}
          filterWhiteBelt={false}
        />

        <div className={style.checkboxContainer}>
          <h2>Visa Övningar</h2>
          <div></div>
          <CheckBox
            id={"techniqueFilter-VisaÖvningar"}
            checked={false}
            onClick={(isChecked) => {
              console.log("Checkbox exercise clicked", isChecked);
              onToggleExercise(isChecked);
            }}
          />
        </div>

        <div className={style.checkboxContainer}>
          <h2>Kihon</h2>
          <div></div>
          <CheckBox
            id={"techniqueFilter-KihonCheck"}
            checked={false}
            onClick={(isChecked) => {
              console.log("Checkbox kihon clicked", isChecked);
              onToggleKihon(isChecked);
            }}
          />
        </div>
      </FilterContainer>
    </div>
  );
}
