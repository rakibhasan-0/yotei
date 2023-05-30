package se.umu.cs.pvt.search.params;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * This class stores the urlQuery in attributes.
 *
 * @author Kraken (Jonas Gustavsson)
 * @author Minotaur (James Eriksson)
 * @author Kraken (Fardis Namez)
 * @author Kraken (Oskar Westerlund Holmgren) 2023-05-30
 * 
 * @version 2.0
 * 
 */
public class SearchWorkoutParams {
    private String name;
    private LocalDate from;
    private LocalDate to;
    private boolean favourite;
    private List<String> tags;
    private String user_id;

    public SearchWorkoutParams(Map<String, String> urlQuery) {

        try {
			if(urlQuery.get("name") != null)
			{
				name = new String(URLDecoder.decode(urlQuery.get("name"), StandardCharsets.UTF_8.toString()));
			}	
		} catch (UnsupportedEncodingException e) {
			// Failed to decode string, instead use uncoded string.
			name = urlQuery.get("name");
		}

        user_id = urlQuery.get("id");

        if(urlQuery.containsKey("from")) from = parseDateString(urlQuery.get("from"));

        if(urlQuery.containsKey("to")) to = parseDateString(urlQuery.get("to"));

        if(urlQuery.containsKey("favourite")){
            favourite = Boolean.parseBoolean(urlQuery.get("favourite"));
        }

        if(urlQuery.containsKey("tags")) {
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

    public boolean hasFrom() {
        return from != null;
    }

    public LocalDate getFrom() {
        return from;
    }

    public boolean hasTo() {
        return to != null;
    }

    public LocalDate getTo() {
        return to;
    }

    public boolean isFavourite() {
        return favourite;
    }

    public boolean hasTags() {
        return tags != null;
    }

    public List<String> getTags() {
        return tags;
    }

    public boolean hasUser_id() {
        return user_id != null;
    }

    public String getUser_id() {
        return user_id;
    }

    private LocalDate parseDateString(String date){
        if(date.isEmpty()) return null;

        String[] dateObjects = date.split("-");
        if(dateObjects.length != 3) return null;

        LocalDate localDate = null;
        try {
            localDate = LocalDate.of(
                    Integer.parseInt(dateObjects[0]),
                    Integer.parseInt(dateObjects[1]),
                    Integer.parseInt(dateObjects[2])
            );
        } catch (Exception e){
            // Log incorrect param
        }

        return localDate;
    }
}
