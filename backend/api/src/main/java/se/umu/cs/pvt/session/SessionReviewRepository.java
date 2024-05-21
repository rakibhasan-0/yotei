package se.umu.cs.pvt.session;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import se.umu.cs.pvt.workout.Activity;
import se.umu.cs.pvt.workout.detail.ActivityDetail;




/**
 * JPA repository for session api. 
 * 
 * @author Hawaii (Doc: Griffins c20jjs)
 */
public interface SessionReviewRepository extends JpaRepository<SessionReview, Long> {
    @Query("SELECT sw FROM SessionReview as sw where  sw.session_id = :session_id")
    List<SessionReview> findAllBySessionId(Long session_id);


    @Query("""
        SELECT 
            DISTINCT a 
        FROM 
            Session s
        JOIN
            SessionReview sr
        ON
            s.id = sr.session_id
        JOIN
            SessionReviewActivity sra
        ON
            sr.id = sra.session_review_id
        JOIN
            ActivityDetail a
        ON 
            sra.activity_id = a.id
        WHERE
            s.id = :session_id
        AND
            a.workoutId IS NULL
    """)
    List<ActivityDetail> findAnonymousActivitiesForSession(Long session_id);
}
