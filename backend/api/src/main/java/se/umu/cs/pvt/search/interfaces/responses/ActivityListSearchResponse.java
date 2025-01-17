package se.umu.cs.pvt.search.interfaces.responses;

import java.time.LocalDate;

import se.umu.cs.pvt.activitylist.Dtos.UserShortDTO;

/**
 * Class to represent the ActivityList object returned from the API.
 * 
 * @author Team Tomato
 * @since 2024-05-20, updated 2024-05-27
 */
public class ActivityListSearchResponse implements SearchResponseInterface {
    private Long id;
    private UserShortDTO author;
    private String name;
    private Boolean hidden;
    private LocalDate date;
    private int size;
    private int numOccurences;
    
    public ActivityListSearchResponse(Long id, UserShortDTO author, String name, Boolean hidden, LocalDate date, int size, int numOccurences) {
        this.id = id;
        this.author = author;
        this.name = name;
        this.hidden = hidden;
        this.date = date;
        this.size = size;
        this.numOccurences = numOccurences;
    }

    public Long getId() {
        return id;
    }

    public UserShortDTO getAuthor() {
        return author;
    }

    public String getName() {
        return name;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public LocalDate getDate() {
        return date;
    }

    public int getSize() {
        return size;
    }

    public int getNumOccurences() {
        return numOccurences;
    }
    

    
    
}
