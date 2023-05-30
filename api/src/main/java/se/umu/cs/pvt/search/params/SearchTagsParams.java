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
 * @author Kraken (Jonas Gustavsson) 2023-05-04
 * @author Kraken (Oskar Westerlund Holmgren) 2023-05-30
 * 
 * @version 2.0
 */
public class SearchTagsParams {
	// Use 3 as default number if nothing is specified in query.
    private int amount = 3;
    private String name;
    private List<String> tags;

    public SearchTagsParams(Map<String, String> urlQuery){
        try {
			if(urlQuery.get("name") != null)
			{
				name = new String(URLDecoder.decode(urlQuery.get("name"), StandardCharsets.UTF_8.toString()));
			}	
		} catch (UnsupportedEncodingException e) {
			// Failed to decode string use uncoded string.
			name = urlQuery.get("name");
		}

		// If tag amount is specified in query use it, else use deafult.
        if (urlQuery.get("tagAmount") != null) {
            amount = Integer.parseInt(urlQuery.get("tagAmount"));
        }

        if (urlQuery.containsKey("tags")){
            String[] tempTags = urlQuery.get("tags").split(",");
            tags = Arrays.stream(tempTags).toList();
        }
    }

    public String getName() {
        return name;
    }
    public int getAmount() {
        return amount;
    }

    public List<String> getTags() {
        return tags;
    }
    public boolean hasTags() {
        return tags != null;
    }
}
