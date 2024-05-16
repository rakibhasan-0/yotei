package se.umu.cs.pvt.workout;


import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * Entity for the workout_review table.
 * 
 *  Documentation Griffin ens19amd
 *  JPA (Java Persistence API)
 * 
 *  WorkoutReview.java - WorkoutReview class. Represents the Workout Entity.
 *  WorkoutReviewRepository.java (Interface) - JPARepository file.
 *  WorkoutReviewReturnInterface.java - Interface for returning information about reviews.
 *
 * @author Calskrove (Team 6)
 */
@Entity
public class WorkoutReview implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "review_id")
    private Long id;
    @Column(nullable = false, name = "rating")
    private int rating;

    @Column(nullable = false, name = "user_id")
    private int userId;

    @Column(nullable = false, name = "workout_id")
    private int workoutId;

    @Column(name = "positive_comment")
    private String positiveComment;

    @Column(name = "negative_comment")
    private String negativeComment;
    @Column(nullable = false, name = "review_date")
    private Date date;

    /**
     * Protected constructor.
     *
     * Required by JPA.
     */
    protected WorkoutReview() {

    }

    /**
     * Constructor for WorkoutReview.
     *
     * @param id Id for the review.
     * @param rating Rating for the review.
     * @param userId Id of user that created the review.
     * @param workoutId Id of the workout the review is for.
     * @param positiveComment Comment about the positives in review.
     * @param negativeComment Comment about the negatives in review.
     * @param date Date that review was created.
     */
    public WorkoutReview(Long id, int rating, int userId, int workoutId, String positiveComment, String negativeComment, Date date) {
        this.id = id;
        this.rating = rating;
        this.userId = userId;
        this.workoutId = workoutId;
        this.positiveComment = positiveComment;
        this.negativeComment = negativeComment;
        this.date = date;
    }

    /**
     * Getter for Id.
     *
     * @return id.
     */
    public Long getId() {
        return id;
    }

    /**
     * Getter for rating.
     *
     * @return rating.
     */
    public int getRating() {
        return rating;
    }

    /**
     * Getter for user id.
     *
     * @return userId.
     */
    public int getUserId() {
        return userId;
    }

    /**
     * Getter for positive comment.
     *
     * @return positiveComment.
     */
    public String getPositiveComment() {
        return positiveComment;
    }

    /**
     * Getter for negative comment.
     *
     * @return negativeComment.
     */
    public String getNegativeComment() {
        return negativeComment;
    }

    /**
     * Getter for date.
     *
     * @return date.
     */
    public Date getDate() {
        return date;
    }

    /**
     * Getter for workout id.
     *
     * @return workoutId.
     */
    public int getWorkoutId() {
        return workoutId;
    }

    /**
     * Setter for Id.
     */
    public void setId(Long id){
        this.id = id;
    }
}
