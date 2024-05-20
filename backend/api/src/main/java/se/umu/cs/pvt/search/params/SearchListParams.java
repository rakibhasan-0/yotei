package se.umu.cs.pvt.search.params;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class SearchListParams {
	    
	private String name;

    public SearchListParams(Map<String, String> urlQuery){

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
