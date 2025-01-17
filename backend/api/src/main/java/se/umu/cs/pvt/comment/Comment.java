package se.umu.cs.pvt.comment;

import se.umu.cs.pvt.user.User;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;


/**
 * Model for comments api.
 *
 * JPA (Java Persistence API)
 *
 * Comment.java - The comment class.
 * CommentController.java  - The controller for the ExercisComment entity.
 * CommentRepository.java (Interface) - JPARepository file.
 * CommentShort.java (Interface) - A projection for a short comment.
 * @author Henrik Aili (c20hai) - Grupp 3 (Hawaii) (Doc: Griffin ie15enm)
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

    @Column(name = "user_id")
    private Long userId;


    @Column(name = "created")
    private LocalDate created;


    @Column(nullable = false, name = "comment_text")
    private String commentText;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User author;

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

    public Long getUserId() {
        return userId;
    }

    public Long getWorkoutId() {
        return workoutId;
    }

    public String getCommentText() {
        return commentText;
    }

    public LocalDate getDate() { return created; }

    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    public void setWorkoutId(Long workoutId) {
        this.workoutId = workoutId;
    }

    public void setCommentText(String commentText) {
        this.commentText = commentText;
    }

    public void setUserId(Long id) { this.userId = id; }

    public void setDate() {
        created = LocalDate.now();
    }

    public String getUser() {return author.getUsername();}
}
