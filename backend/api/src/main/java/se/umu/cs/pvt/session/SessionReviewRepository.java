package se.umu.cs.pvt.session;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;


/**
 * JPA repository for session api. 
 * 
 * @author Hawaii (Doc: Griffins c20jjs)
 */
public interface SessionReviewRepository extends JpaRepository<SessionReview, Long> {
    @Query("SELECT sw FROM SessionReview as sw where  sw.session_id = :session_id")
    List<SessionReview> findAllBySessionId(Long session_id);
}
