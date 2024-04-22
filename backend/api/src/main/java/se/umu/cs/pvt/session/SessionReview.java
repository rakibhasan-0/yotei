package se.umu.cs.pvt.session;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

/**
 * Session.java - Model for session data that is used in the database. 
 * AddListInput.java - Is depricated, only used in tests.
 * DateAndTime.java - Should be depricated, is only used in tests and other depricated methods.
 * SessionController.java - Class for handling requests to the session api.
 * SessionRepositiory.java - JpaRepository for the session api. 
 * SessionTimeConverter.java - Converts time from Time to LocalTime but is never used.
 * SessionUpdateInfo.java - Projection interface for information used when updating a session.
 * 
 * @author Granatäpple
 */
@Entity
@Table(name = "session_review")
public class SessionReview implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "review_id")
    private Long id;


    @Column(nullable = false, name = "session_id")
    private Long session_id;

    @Column(nullable = false, name = "user_id")
    private int userId;

    @Column(nullable = false, name = "rating")
    private int rating;

    @Column(name = "positive_comment")
    private String positiveComment;

    @Column(name = "negative_comment")
    private String negativeComment;

    @Column(nullable = false, name = "review_date")
    private Date date;


    @OneToMany()
    @JoinTable(
            name = "session_review_to_session_review_exercises",
            joinColumns = @JoinColumn(name = "id"),
            inverseJoinColumns = @JoinColumn(name = "session_review_id")
    )
    private Set<SessionReviewExercise> exercises;

    /**
     * No-args constructor required by JPA spec.
     * This one is protected since it shouldn't be used directly.
     */
    protected SessionReview() {}

    /**
     * Data constructor for SessionReview.
     * 
     * @param id Id of the session.
     * @param session_id id of session to review.
     * @param userId The user id of reviewer
     * @param rating Rating of a session. (1-5)
     * @param positiveComment Positive feedback of a session
     * @param negativeComment Negative feedback of a session
     * @param date Date of when the review was made
     */
    public SessionReview(Long id, Long session_id, int userId, int rating, String positiveComment, String negativeComment, Date date) {
        this.id = id;
        this.session_id = session_id;
        this.userId = userId;
        this.rating = rating;
        this.positiveComment = positiveComment;
        this.negativeComment = negativeComment;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSession_id() {
        return session_id;
    }

    public void setSession_id(Long session_id) {
        this.session_id = session_id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getPositiveComment() {
        return positiveComment;
    }

    public void setPositiveComment(String positiveComment) {
        this.positiveComment = positiveComment;
    }

    public String getNegativeComment() {
        return negativeComment;
    }

    public void setNegativeComment(String negativeComment) {
        this.negativeComment = negativeComment;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
