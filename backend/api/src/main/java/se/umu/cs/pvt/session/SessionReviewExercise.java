package se.umu.cs.pvt.session;

import javax.persistence.*;
import java.io.Serializable;

/**
 * SessionReviewExercise - Entity class for the session_review_exercises table
 * @author Team granatäpple (c21man)
 */
@Entity
@Table(name = "session_review_exercises")
public class SessionReviewExercise implements Serializable {
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
