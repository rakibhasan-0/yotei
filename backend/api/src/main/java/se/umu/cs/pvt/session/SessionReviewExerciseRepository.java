package se.umu.cs.pvt.session;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * JPA repository for session review exercises api. 
 * 
 * @author Granatäppke (Doc: Griffins c20jjs)
 */
public interface SessionReviewExerciseRepository extends JpaRepository<SessionReviewExercise, Long> {
    @Query("SELECT swe FROM SessionReviewExercise as swe where  swe.session_review_id = :review_id")
    List<SessionReviewExercise> findAllByReviewId(Long review_id);
}

