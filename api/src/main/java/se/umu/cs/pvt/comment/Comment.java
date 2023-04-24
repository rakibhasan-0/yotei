package se.umu.cs.pvt.comment;

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

    public Long getCommentId() {
        return commentId;
    }

    public Long getExerciseId() {
        return exerciseId;
    }

    public Long getWorkoutId() {
        return workoutId;
    }

    public String getCommentText() {
        return commentText;
    }

    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    public void setWorkoutId(Long workoutId) {
        this.workoutId = workoutId;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }
}
