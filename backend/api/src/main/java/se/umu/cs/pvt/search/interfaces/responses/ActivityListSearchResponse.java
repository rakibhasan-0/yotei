package se.umu.cs.pvt.search.interfaces.responses;

import java.time.LocalDate;

public class ActivityListSearchResponse implements SearchResponseInterface {
    private Long id;
    private Long author;
    private String name;
    private Boolean hidden;
    private LocalDate date;
    
    public ActivityListSearchResponse(Long id, Long author, String name, Boolean hidden, LocalDate date) {
        this.id = id;
        this.author = author;
        this.name = name;
        this.hidden = hidden;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public Long getAuthor() {
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
    

    
    
}
