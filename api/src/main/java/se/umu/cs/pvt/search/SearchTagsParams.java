package se.umu.cs.pvt.search;

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
 * date: 2023-05-04
 */
public class SearchTagsParams {
    private int amount;
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

        if (urlQuery.get("tagAmount") != null) {
            amount = Integer.parseInt(urlQuery.get("tagAmount"));
        }
        else {
            // Use 3 as default number if not specified
            amount = 3;
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
