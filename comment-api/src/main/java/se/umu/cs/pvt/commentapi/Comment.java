package se.umu.cs.pvt.commentapi;

import javax.persistence.*;
import java.io.Serializable;

/**
 * A comment entity for Spring JPA. 
 * @author Henrik Aili (c20hai) - Grupp 3 (Hawaii) 
 */
@Entity(name = "comments")
public class Comment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    @Column(name = "workout_id")
    private Long workoutId;

    @Column(name = "exercise_id")
    private Long exerciseId;

    @Column(nullable = false, name = "comment_text")
    private String commentText;


    /**
     * Default constructor for JPA
     */
    public Comment() {
    }

    /**
     * Constructor for creating a link between a comment and a exercise
     * @param comment The id of the comment to link to
     */
    public Comment(String comment) {
        this.commentText = comment;
    }

    /**
     * Getter for the exercisecomment id
     * @return The id of the exercisecomment
     */
    public Long getCommentId() {
        return commentId;
    }

    /**
     * Get the exercise id
     * @return The exercise id
     */
    public Long getExerciseId() {
        return exerciseId;
    }

    /**
     * Get the workout id
     * @return The workout id
     */
    public Long getWorkoutId() {
        return workoutId;
    }

    /**
     * Get the comment text
     * @return The comment text
     */
    public String getCommentText() {
        return commentText;
    }

    /**
     * Set the exercise id
     * @param exerciseId The exercise id
     */
    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    /**
     * Set the workout id
     */
    public void setWorkoutId(Long workoutId) {
        this.workoutId = workoutId;
    }
    /**
     * Set the comment text
     * @param commentText The comment text
     */
    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }
}
