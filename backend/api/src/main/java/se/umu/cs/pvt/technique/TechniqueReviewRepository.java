package se.umu.cs.pvt.technique;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Interface for technique reviews.
 *
 * @author Team Granatäpple (Group 1) (2024-4-19)
 */
public interface TechniqueReviewRepository extends JpaRepository<TechniqueReview,Long> {
    
    @Query(value="SELECT tr.review_id, tr.user_id, tr.rating, tr.positive_comment, tr.negative_comment," +
            "tr.review_date, tr.technique_id, u.username " +
            "FROM technique_review AS tr, user_table AS u " +
            "WHERE u.user_id = tr.user_id AND tr.technique_id = :id " +
            "ORDER BY tr.review_date DESC, tr.review_id DESC", nativeQuery = true)
    List<TechniqueReviewReturnInterface> findReviewsForTechnique(Long id);
}
