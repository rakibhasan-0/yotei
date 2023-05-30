package se.umu.cs.pvt.search.params;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
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
public class SearchExerciseParams {
    private String name;
    private List<String> tags;

    public SearchExerciseParams(Map<String, String> urlQuery){
        try {
			if(urlQuery.get("name") != null)
			{
				name = new String(URLDecoder.decode(urlQuery.get("name"), StandardCharsets.UTF_8.toString()));
			}	
		} catch (UnsupportedEncodingException e) {
			// Failed to decode string use uncoded string.
			name = urlQuery.get("name");
		}

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
