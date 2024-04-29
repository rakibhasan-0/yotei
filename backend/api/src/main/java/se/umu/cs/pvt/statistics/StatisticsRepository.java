package se.umu.cs.pvt.statistics;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import se.umu.cs.pvt.session.Session;

/**
 * JPA repository for statistics api. 
 * 
 * @author Hawaii (Doc: Griffins c20jjs)
 */
public interface StatisticsRepository extends JpaRepository<Session, Long>{
  

  @Query("""
    SELECT
      new se.umu.cs.pvt.statistics.StatisticsResponse(t.id, COUNT(t.id))
    FROM
      Session s
    JOIN
      Activity a
    ON 
      a.workoutId = s.workout
    JOIN 
      Technique t
    ON 
      t.id = a.techniqueId
    WHERE
      s.plan = :id
    AND
      t.id != NULL
    GROUP BY
      t.id
    ORDER BY COUNT(t.id)
    DESC
    """)
  List<StatisticsResponse> getTechniquesStats(Long id);

}
