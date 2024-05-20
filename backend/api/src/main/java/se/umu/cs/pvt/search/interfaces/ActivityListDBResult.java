package se.umu.cs.pvt.search.interfaces;

import java.io.Serializable;
import java.time.LocalDate;

import javax.persistence.*;

@Entity 
public class ActivityListDBResult implements Serializable {
    @Id
    @Column(nullable = false, name = "id")
    private Long id;

    @Column(nullable = false, name = "author")
    private Long author;

    @Column(nullable = false, name = "name")
    private String name;

    @Column(nullable = false, name = "private")
    private Boolean hidden;

    @Column(nullable = false, name = "created_date")
    private LocalDate date;

    protected ActivityListDBResult(){}

    public ActivityListDBResult(Long id, Long author, String name, Boolean hidden, LocalDate date) {
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
