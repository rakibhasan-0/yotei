package se.umu.cs.pvt.activitylist;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import se.umu.cs.pvt.workout.UserShort;

/**
 * Model for ActivityList
 * 
 * ActivityList.java - ActivityList class
 * ActivityDTO.java - DTO for Activity, can be a technique or an exercise.
 * ActivityListController.java - The controller for the ActivityList
 * ActivityListRepository.java (Interface) - JPARepository file.
 * UserShortDTO.java (Interface) - A projection for a short user.
 * ActivityListService - Service to seperate logic from controller.
 * IActivityListService (Interface) - Interface for ActivityListService
 * ActivityListDTO - DTO for ActivityList to be able to provide complete
 * information about a list in a structured way.
 * 
 * @author Team Tomato
 * @since 2024-05-12
 * @version 1.0
 */
@Entity
@Table(name = "activity_list")
public class ActivityList implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "id")
    private Long id;

    @Column(nullable = false, name = "author")
    private Long author;

    @Column(nullable = false, name = "name")
    private String name;

    @Column(nullable = true, name = "description")
    private String desc;

    @Column(nullable = false, name = "private")
    private Boolean hidden;

    @Column(nullable = false, name = "created_date")
    private LocalDate date;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_to_activity_list", joinColumns = @JoinColumn(name = "list_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<UserShort> users = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "activityList")
    private Set<ActivityListEntry> activityEntries = new HashSet<>();

    protected ActivityList() {
    }

    public ActivityList(Long id, Long author, String name, String desc, Boolean hidden, LocalDate date) {
        this.id = id;
        this.author = author;
        this.name = name;
        this.desc = desc;
        this.hidden = hidden;
        this.date = date;
    }

    public boolean hasNullFields() {
        return author == null || name == null || hidden == null || date == null;
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

    public String getDesc() {
        return desc;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public LocalDate getDate() {
        return date;
    }

    public Set<UserShort> getUsers() {
        if (users == null) {
            return Collections.emptySet();
        }
        return users;
    }

    public Set<ActivityListEntry> getActivityEntries() {
        if (activityEntries == null) {
            return Collections.emptySet();
        }
        return activityEntries;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAuthor(Long author) {
        this.author = author;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setUsers(Set<UserShort> users) {
        this.users = users;
    }

    public void setEntries(Set<ActivityListEntry> activityEntries) {
        this.activityEntries = activityEntries;
    }

}
