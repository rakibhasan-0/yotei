package se.umu.cs.pvt.search.params;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;


/**
 * This class stores the urlQuery in attributes.
 *
 * @author Minotaur (James Eriksson)
 *
 **/ 
public class SearchPlanParams {
    private LocalDate from;
    private LocalDate to;
    private Boolean previousSessions;
    private List<String> plans;
    private String id;

    public SearchPlanParams(Map<String, String> urlQuery){
        id = urlQuery.get("id");

        if(urlQuery.containsKey("from")){
            from = parseDateString(urlQuery.get("from"));
        }

        if(urlQuery.containsKey("to")){
            to = parseDateString(urlQuery.get("to"));
        }

        if(urlQuery.containsKey("previousSessions")) {
            previousSessions = Boolean.parseBoolean(urlQuery.get("previousSessions"));
        }

        if(urlQuery.containsKey("plans")){
            String groupString = urlQuery.get("plans");
            if(!groupString.isEmpty()) plans = Arrays.stream(groupString.split(",")).toList();
        }
    }

    public boolean hasTo(){
        return to != null;
    }

    public LocalDate getTo() {
        return to;
    }

    public boolean hasFrom(){
        return from != null;
    }

    public LocalDate getFrom() {
        return from;
    }

    public boolean hasPreviousSessions(){
        return previousSessions != null && previousSessions == true;
    }

    public Boolean getPreviousSessions() {
        return previousSessions;
    }

    public boolean hasPlans(){
        return plans != null;
    }

    public List<String> getPlans() {
        return plans;
    }

    public boolean hasId() {
        return id != null;
    }

    public String getId() {
        return id;
    }

	/**
	 * Parses a date as a string into a LocalDate java object
	 * @param date Date to parse
	 * @return Date represented as a LocalDate object
	 */
    private LocalDate parseDateString(String date){
        if(date.isEmpty()) return null;

        String[] dateObjects = date.split("-");
        if(dateObjects.length != 3) return null;

        LocalDate localDate;
        try {
            localDate = LocalDate.of(
                    Integer.parseInt(dateObjects[0]),
                    Integer.parseInt(dateObjects[1]),
                    Integer.parseInt(dateObjects[2])
            );
        } catch (Exception e){
            return null;
        }

        return localDate;
    }
}
