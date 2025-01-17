package se.umu.cs.pvt.activitylist.Dtos;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import se.umu.cs.pvt.activitylist.Activity;
import se.umu.cs.pvt.activitylist.ActivityList;
import se.umu.cs.pvt.activitylist.ActivityListEntry;
import se.umu.cs.pvt.workout.UserShort;
import se.umu.cs.pvt.workout.UserShortRepository;

/**
 * Dto for an activity list that holds complete information about the list.
 * 
 * @author Team Tomato, updated 2024-05-21
 * @since 2024-05-12
 * @version 1.1
 */
public class ActivityListDTO {
    private Long id;
    private UserShortDTO author;
    private String name;
    private String desc;
    private Boolean hidden;
    private LocalDate date;
    private List<UserShortDTO> users;
    private List<Activity> activities;

    public ActivityListDTO(ActivityList activityList, UserShortRepository userShortRepository) {
        Optional<UserShort> userShort = userShortRepository.findById(activityList.getAuthor());
        this.author = userShort.isPresent() ? new UserShortDTO(userShort.get()) : null;
        this.id = activityList.getId();
        this.name = activityList.getName();
        this.desc = activityList.getDesc();
        this.hidden = activityList.getHidden();
        this.date = activityList.getDate();
        this.users = new ArrayList<>();
        this.users = activityList.getUsers().stream().map(UserShortDTO::new).collect(Collectors.toList());
        this.activities = new ArrayList<>();
        for (ActivityListEntry entry : activityList.getActivityEntries()) {
            if (entry.getExercise() != null) {
                this.activities.add(new Activity(entry.getExercise(), entry.getDuration(), entry.getId()));
            }
            if (entry.getTechnique() != null) {
                this.activities.add(new Activity(entry.getTechnique(), entry.getDuration(), entry.getId()));
            }
        }



    }

    // Getters for all properties
    public Long getId() {
        return id;
    }

    public UserShortDTO getAuthor() {
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

    public List<UserShortDTO> getUsers() {
        if (users == null || users.isEmpty()) {
            return Collections.emptyList();
        }
        return users;
    }

    public List<Activity> getActivities() {
        return activities;
    }

}
