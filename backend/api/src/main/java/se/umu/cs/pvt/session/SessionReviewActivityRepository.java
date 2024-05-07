package se.umu.cs.pvt.session;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * JPA repository for session review exercises api. 
 * 
 * @author Granatäppke (Doc: Griffins c20jjs)
 */
public interface SessionReviewActivityRepository extends JpaRepository<SessionReviewActivity, Long> {
    @Query("SELECT swe FROM SessionReviewActivity as swe where  swe.session_review_id = :review_id")
    List<SessionReviewActivity> findAllByReviewId(Long review_id);
}

