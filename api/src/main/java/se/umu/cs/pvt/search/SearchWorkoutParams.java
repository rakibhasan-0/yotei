package se.umu.cs.pvt.search;

import java.time.LocalDate;
import java.util.Map;

/**
 * This class stores the urlQuery in attributes.
 *
 * @author Kraken (Jonas Gustavsson)
 * @author Minotaur (James Eriksson)
 * @author Kraken (Fardis Namez)
 */
public class SearchWorkoutParams {
    private String name;
    private LocalDate localDate;

    public SearchWorkoutParams(Map<String, String> urlQuery) {
        name = urlQuery.get("name");

        if(urlQuery.containsKey("date")) {
            String[] dateObjects = urlQuery.get("date").split("-");
            if(dateObjects.length == 3){
                localDate = LocalDate.of(
                        Integer.parseInt(dateObjects[0]),
                        Integer.parseInt(dateObjects[1]),
                        Integer.parseInt(dateObjects[2])
                );
            }
        }
    }


    public boolean hasName() {
        return name != null;
    }

    public String getName() {
        return name;
    }

    public boolean hasDate() {
        return localDate != null;
    }

    public LocalDate getDate() {
        return localDate;
    }
}
