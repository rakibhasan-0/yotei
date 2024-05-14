package se.umu.cs.pvt.activitylist;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import se.umu.cs.pvt.exercise.Exercise;
import se.umu.cs.pvt.technique.Technique;

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

}
