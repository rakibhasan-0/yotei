package se.umu.cs.pvt.statistics;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import se.umu.cs.pvt.session.Session;
import se.umu.cs.pvt.belt.Belt;

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
      new se.umu.cs.pvt.statistics.StatisticsResponse(s.id,
                                                      t.id, 
                                                      t.name,
                                                      'technique', 
                                                      COUNT(t.id), 
                                                      (t.id IN (
                                                        SELECT tt.techId
                                                        FROM TechniqueTag tt
                                                        WHERE tt.tag = 1
                                                      ))
                                                      ,s.date
                                                      )
                                                                                         
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
      t.id IS NOT NULL
    GROUP BY
      s.id,
      t.id,
      t.name,
      s.date
      """)
  List<StatisticsResponse> getAllSampleTechniquesQuery(Long id);


  @Query("""
    SELECT
      new se.umu.cs.pvt.statistics.StatisticsResponse(s.id, 
                                                      e.id, 
                                                      e.name, 
                                                      'exercise', 
                                                      COUNT(e.id),
                                                      (e.id IN (
                                                        SELECT et.exerciseId
                                                        FROM ExerciseTag et
                                                        WHERE et.tag = 1
                                                      )),
                                                      s.date
                                                      ) 
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
      s.id,
      e.id,
      e.name,
      s.date
      """)
  List<StatisticsResponse> getAllSampleExercisesQuery(Long id);

  // Get a list of belts associated with a technique.
  @Query("""
    SELECT 
      new se.umu.cs.pvt.belt.Belt(b.id, b.name, b.color, b.isChild)
    FROM
      TechniqueBelt tb
    JOIN
      Belt b
    ON
      tb.beltId = b.id
    WHERE
      tb.techniqueId = :id
      """)
  List<Belt> getBeltsForTechnique(Long id);


}
