package se.umu.cs.pvt.search;

import java.util.ArrayList;
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
public class SearchTechniquesParams {
    private String name;
    private List<String> tags;
    private List<Integer> beltColors;
    private boolean technique;
    private boolean kion;

    public SearchTechniquesParams(Map<String, String> urlQuery){
        name = urlQuery.get("name");

        if (urlQuery.containsKey("tags")){
            String[] tempTags = urlQuery.get("tags").split(" ");
            tags = Arrays.stream(tempTags).toList();
        }

        if (urlQuery.containsKey("beltColors")){
            String[] tempBelts = urlQuery.get("beltColors").split(" ");
            beltColors = new ArrayList();

            for (String belt : tempBelts) {
                beltColors.add(Integer.parseInt(belt));
            }
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

    public void setName(String name) {
        this.name = name;
    }

    public boolean hasTags() {
        return tags != null;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public boolean hasBeltColors() {
        return beltColors != null;
    }

    public List<Integer> getBeltColors() {
        return beltColors;
    }

    public void setBeltColors(List<Integer> beltColors) {
        this.beltColors = beltColors;
    }

    public boolean isTechnique() {
        return technique;
    }

    public void setTechnique(boolean technique) {
        this.technique = technique;
    }

    public boolean isKion() {
        return kion;
    }

    public void setKion(boolean kion) {
        this.kion = kion;
    }
}
