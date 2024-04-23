package se.umu.cs.pvt.session;

import javax.persistence.*;
import java.io.Serializable;

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
@Table(name = "session_review_exercises")
public class SessionReviewExercise implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "session_review_exercise_id")
    private Long session_review_exercise_id;

    @Column(nullable = false, name = "session_review_id")
    private Long session_review_id;

    @Column(nullable = false, name = "exercise_id")
    private int exercise_id;


    /**
     * Data constructor for SessionReviewExercise.
     * 
     * @param session_review_exercise_id
     * @param session_review_id
     * @param exercise_id
     */
    public SessionReviewExercise(Long session_review_exercise_id, Long session_review_id, int exercise_id) {
        this.session_review_exercise_id = session_review_exercise_id;
        this.session_review_id = session_review_id;
        this.exercise_id = exercise_id;
    }

    /**
     * No-args constructor required by JPA spec.
     * This one is protected since it shouldn't be used directly.
     */
    protected SessionReviewExercise() {}


    public Long getSession_review_exercise_id() {
        return session_review_exercise_id;
    }

    public void setSession_review_exercise_id(Long session_review_exercise_id) {
        this.session_review_exercise_id = session_review_exercise_id;
    }

    public Long getSession_review_id() {
        return session_review_id;
    }

    public void setSession_review_id(Long session_review_id) {
        this.session_review_id = session_review_id;
    }

    public int getExercise_id() {
        return exercise_id;
    }

    public void setExercise_id(int exercise_id) {
        this.exercise_id = exercise_id;
    }


}
