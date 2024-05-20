package se.umu.cs.pvt.search.params;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * This class stores the urlQuery in attributes.
 *
 * @author Team Tomato 2024-05-20
 * 
 */
public class SearchActivityListParams {
	    
	private String name;

    public SearchActivityListParams(Map<String, String> urlQuery){

        try {
            if(urlQuery.get("name") != null) {
                name = new String(URLDecoder.decode(urlQuery.get("name"), StandardCharsets.UTF_8.toString()));
            }
        } catch (UnsupportedEncodingException e) {
            System.out.println("Failed to decode name string. " + e);
            name = urlQuery.get("name");
        }
    }

    public boolean hasName() {
        return name != null;
    }

    public String getName() {
        return name;
    }
}
