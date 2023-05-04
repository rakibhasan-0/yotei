package se.umu.cs.pvt.search;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * This class stores the urlQuery in attributes.
 *
 * @author Kraken (Jonas Gustavsson)
 * @author Minotaur (James Eriksson)
 * @author Kraken (Fardis Namez)
 */
public class SearchExerciseParams {
    private String name;
    private List<String> tags;

    public SearchExerciseParams(Map<String, String> urlQuery){
        name = urlQuery.get("name");

        if (urlQuery.containsKey("tags")){
            String tagsString = urlQuery.get("tags");
            if(!tagsString.isEmpty()) tags = Arrays.stream(tagsString.split(",")).toList();
        }
    }

    public boolean hasName() {
        return name != null;
    }

    public String getName() {
        return name;
    }

    public boolean hasTags() {
        return tags != null;
    }

    public List<String> getTags() {
        return tags;
    }
}
