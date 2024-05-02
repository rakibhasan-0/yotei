package se.umu.cs.pvt.statistics;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;
import se.umu.cs.pvt.session.Session;

/**
 * JPA repository for statistics api. 
 * 
 * @author Cocount 
 * @version 1.0
 * @since 2024-04-29
 */
public interface StatisticsRepository extends JpaRepository<Session, Long>{
  
  @Query("""
    SELECT
      new se.umu.cs.pvt.statistics.StatisticsResponse(t.id, t.name, tb.beltId, COUNT(t.id))
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
    JOIN
      TechniqueBelt tb
    ON
      tb.techniqueId = t.id
    WHERE
      s.plan = :id
    AND
      t.id IS NOT NULL
    GROUP BY
      t.id,
      t.name,
      tb.beltId
      """)
  List<StatisticsResponse> getSampleTechniquesQuery(Long id);

  @Query("""
    SELECT
      new se.umu.cs.pvt.statistics.StatisticsResponse(e.id, e.name, COUNT(e.id))
    FROM
      Session s
    JOIN
      Activity a
    ON 
      a.workoutId = s.workout
    JOIN 
      Exercise e
    ON 
      e.id = a.exerciseId
    WHERE
      s.plan = :id
    AND
      e.id IS NOT NULL
    GROUP BY
      e.id,
      e.name
      """)
  List<StatisticsResponse> getSampleExercisesQuery(Long id);

}
