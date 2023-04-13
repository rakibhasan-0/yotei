package se.umu.se.pvt.sessionapi;

import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Data class for structuring input to the "/addlist" request in the session api.
 * @author c19rll (Hawaii)
 * @implNote @Data is a lombok feature (https://projectlombok.org/features/Data) which creates getters
 * and a constructor automatically.
 */
@Data
@Deprecated
public class AddListInput {
    //The plan which the sessions will belong to
    private final Long plan_id;
    //A list of dates and times which to repeat
    private final List<DateAndTime> date_info;
    //The amount of weeks to repeat
    private final Integer weeks;

    /**
     * Check if the format of the input is invalid.
     * @return Boolean True if the format is invalid, else false.
     */
    public Boolean invalidFormat(){
        List<DateAndTime> dateAndTimeList = this.getDate_info();
        return dateAndTimeList == null || this.getWeeks() == null || this.getPlan_id() == null
                || dateAndTimeList.stream().anyMatch(info -> info.getDate() == null) || hasDuplicateDate(dateAndTimeList)
                || dateAndTimeList.size() > 7 || dateAndTimeList.size() == 0;
    }

    /**
     * Checks the given list for duplicate dates
     * @param list A list of DateAndTime object
     * @return True if list has duplicate
     */
    private boolean hasDuplicateDate(List<DateAndTime> list) {
        List<LocalDate> visitedDates = new ArrayList<>(list.size());

        for(DateAndTime d : list) {
            if(visitedDates.contains(d.getDate()))
                return true;
            visitedDates.add(d.getDate());
        }
        return false;
    }
}
