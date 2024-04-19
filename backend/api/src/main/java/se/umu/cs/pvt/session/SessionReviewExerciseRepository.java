package se.umu.cs.pvt.session;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * JPA repository for session review exercises api. 
 * 
 * @author Granatäppke (Doc: Griffins c20jjs)
 */
public interface SessionReviewExerciseRepository extends JpaRepository<SessionReviewExercise, Long> {
}

