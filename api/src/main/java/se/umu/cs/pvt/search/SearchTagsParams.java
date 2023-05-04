package se.umu.cs.pvt.search;

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
        name = urlQuery.get("name");

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
