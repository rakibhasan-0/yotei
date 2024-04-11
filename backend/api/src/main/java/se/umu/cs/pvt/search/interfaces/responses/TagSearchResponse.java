package se.umu.cs.pvt.search.interfaces.responses;

/**
 * This class represents the Exercise object returned
 * from the API.
 *
 * @author (Kraken) Jonas Gustavsson 2023-05-04
 * 
 */
public class TagSearchResponse implements SearchResponseInterface{
    private Long id;
    private String name;

    public TagSearchResponse(Long id, String name){
        this.id = id;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public Number getId() {
        return id;
    }
}
