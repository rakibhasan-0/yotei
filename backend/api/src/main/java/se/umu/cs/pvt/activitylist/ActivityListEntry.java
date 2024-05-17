package se.umu.cs.pvt.activitylist;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import se.umu.cs.pvt.exercise.Exercise;
import se.umu.cs.pvt.technique.Technique;

/**
 * Model for ActivityListEntry
 * 
 * ActivityListEntry - Activity list entry model 
 * ActivityListEntryController - Controller for activity list entry
 * ActivityListEntryRepository - JPARepository interface
 * 
 * @author Team Tomato
 * @since 2024-05-16
 * @version 1.0
 */
@Entity
@Table(name = "activity_list_entry")
public class ActivityListEntry implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "list_entry_id")
    private Long id;

    @Column(nullable = false, name = "list_id")
    private Long activityListId;

    @Column(nullable = true, name = "exercise_id")
    private Long exerciseId;

    @Column(nullable = true, name = "technique_id")
    private Long techniqueId;

    @Column(nullable = true, name = "duration")
    private Integer duration;

    @ManyToOne
    @JoinColumn(name = "list_id", referencedColumnName = "id", insertable = false, updatable = false)
    private ActivityList activityList;

    @ManyToOne
    @JoinColumn(name = "exercise_id", insertable = false, updatable = false)
    private Exercise exercise;

    @ManyToOne
    @JoinColumn(name = "technique_id", insertable = false, updatable = false)
    private Technique technique;

    protected ActivityListEntry() {
    }

    public ActivityListEntry(Long id, Long activityListId, Long exerciseId, Long techniqueId) {
        this.id = id;
        this.activityListId = activityListId;
        this.exerciseId = exerciseId;
        this.techniqueId = techniqueId;
    }

    public ActivityListEntry(Integer duration, Long activityListId, Long exerciseId, Long techniqueId) {
        this.activityListId = activityListId;
        this.exerciseId = exerciseId;
        this.techniqueId = techniqueId;
        this.duration = duration;
    }

    public ActivityListEntry(Long activityListId, Long exerciseId, Long techniqueId) {
        this.activityListId = activityListId;
        this.exerciseId = exerciseId;
        this.techniqueId = techniqueId;
    }

    public Long getId() {
        return id;
    }

    public Long getListId() {
        return activityListId;
    }

    public Long getExerciseId() {
        return exerciseId;
    }

    public Long getTechniqueId() {
        return techniqueId;
    }

    public Technique getTechnique() {
        return technique;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public int getDuration() {
        return duration;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public void setListId(Long listId) {
        this.activityListId = listId;
    }

    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    public void setTechniqueId(Long techniqueId) {
        this.techniqueId = techniqueId;
    }

    public void setTechnique(Technique technique) {
        this.technique = technique;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

}
