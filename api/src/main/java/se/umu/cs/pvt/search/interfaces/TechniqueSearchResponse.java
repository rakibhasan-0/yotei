package se.umu.cs.pvt.search.interfaces;

import java.util.ArrayList;
import java.util.List;

/**
 * This class represents the Technique object returned
 * from the API.
 *
 * @author Minotaur (James Eriksson)
 */
public class TechniqueSearchResponse implements SearchResponseInterface {
    private Long id;
    private String name;
    private List<String> beltColors;

    public TechniqueSearchResponse(Long id, String name, String beltColor) {
        this.id = id;
        this.name = name;
        this.beltColors = new ArrayList<>();
        this.beltColors.add(beltColor);
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<String> getBeltColors() {
        return beltColors;
    }

    public void addBeltColor(String beltColor) {
        beltColors.add(beltColor);
    }
}
