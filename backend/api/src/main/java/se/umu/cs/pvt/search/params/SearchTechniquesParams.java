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
public class SearchTechniquesParams {
    private String name;
    private List<String> tags;
    private List<String> beltColors;
    private boolean technique;
    private boolean kion;

    public SearchTechniquesParams(Map<String, String> urlQuery){
        try {
            if(urlQuery.get("name") != null)
            {
                name = new String(URLDecoder.decode(urlQuery.get("name"), StandardCharsets.UTF_8.toString()));
            }
        } catch (UnsupportedEncodingException e) {
            System.out.println("Failed to decode name string. " + e);
            name = urlQuery.get("name");
        }

        if (urlQuery.containsKey("tags")){
            String tagString = urlQuery.get("tags");
            if(!tagString.isEmpty()) tags = Arrays.stream(tagString.split(",")).toList();
        }

        if (urlQuery.containsKey("beltColors")){
            String beltString = urlQuery.get("beltColors");
            if(!beltString.isEmpty()) beltColors = Arrays.stream(beltString.split(",")).toList();
        }

        if (urlQuery.containsKey("technique")){
            technique = Boolean.parseBoolean(urlQuery.get("technique"));
        }

        if (urlQuery.containsKey("kion")){
            kion = Boolean.parseBoolean(urlQuery.get("kion"));
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

    public boolean hasBeltColors() {
        return beltColors != null;
    }

    public List<String> getBeltColors() {
        return beltColors;
    }

    public boolean isTechnique() {
        return technique;
    }

    public boolean isKion() {
        return kion;
    }

	public boolean nameIsEmpty() {
		if (this.hasName()) {
			return name.isEmpty();
		}
		return false;
	}
}
