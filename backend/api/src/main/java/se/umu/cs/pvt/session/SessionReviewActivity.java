package se.umu.cs.pvt.session;

import javax.persistence.*;
import java.io.Serializable;

/**
 * SessionReviewExercise - Entity class for the session_review_exercises table
 * @author Team granatäpple (c21man)
 */
@Entity
@Table(name = "session_review_activity")
public class SessionReviewActivity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "session_review_activity_id")
    private Long session_review_activity_id;

    @Column(nullable = false, name = "session_review_id")
    private Long session_review_id;

    @Column(nullable = false, name = "activity")
    private int activity_id;

    /**
     * Data constructor for SessionReviewExercise.
     * 
     * @param session_review_exercisession_review_activity_idse_id
     * @param session_review_id
     * @param activity_id
     */
    public SessionReviewActivity(Long session_review_activity_id, Long session_review_id, int activity_id) {
        this.session_review_activity_id = session_review_activity_id;
        this.session_review_id = session_review_id;
        this.activity_id = activity_id;
    }

    /**
     * No-args constructor required by JPA spec.
     * This one is protected since it shouldn't be used directly.
     */
    protected SessionReviewActivity() {}


    public Long getSession_review_activity_id() {
        return session_review_activity_id;
    }


    public Long getSession_review_id() {
        return session_review_id;
    }

    public int getActivity_id() {
        return activity_id;
    }
}
