package se.umu.cs.pvt.activitylist;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;

import se.umu.cs.pvt.belt.Belt;
import se.umu.cs.pvt.exercise.Exercise;
import se.umu.cs.pvt.tag.Tag;
import se.umu.cs.pvt.technique.Technique;

/**
 * Dto for an activity, either an exercise or a technique.
 * 
 * @author Team Tomato, updated 2024-05-21
 * @since 2024-05-12
 * @version 1.1
 */
public class Activity {
    private String type;
    private Long id;
    private Long entryId;
    private String name;
    private String description;
    private Integer duration; // Only set for exercises
    private Set<Tag> tags; // Only set for techniques
    private Set<Belt> belts;

    public Activity(Exercise exercise) {
        this.type = "exercise";
        this.id = exercise.getId();
        this.name = exercise.getName();
        this.description = exercise.getDescription();
        this.duration = exercise.getDuration();
    }

    public Activity(Exercise exercise, Integer duration, Long entryId) {
        this.type = "exercise";
        this.id = exercise.getId();
        this.entryId = entryId;
        this.name = exercise.getName();
        this.description = exercise.getDescription();
        if (duration == null) {
            this.duration = exercise.getDuration();
        } else {
            this.duration = duration;
        }
    }

    public Activity(Technique technique, Integer duration, Long entryId) {
        this.type = "technique";
        this.id = technique.getId();
        this.entryId = entryId;
        this.name = technique.getName();
        this.description = technique.getDescription();
        this.tags = technique.getTags();
        this.duration = duration;
        this.belts = technique.getBelts();
    }

    // Getters
    @JsonProperty
    public Long getId() {
        return id;
    }

    @JsonProperty
    public String getName() {
        return name;
    }

    @JsonProperty
    public String getType() {
        return type;
    }

    @JsonProperty
    public String getDescription() {
        return description;
    }

    @JsonProperty
    public Integer getDuration() {
        return duration;
    }

    @JsonProperty
    public Set<Tag> getTags() {
        return tags;
    }

    @JsonProperty
    public Set<Belt> getBelts() {
        return belts;
    }

    @JsonProperty
    public Long getEntryId() {
        return entryId;
    }
}