package se.umu.cs.pvt.exercise;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * @author Hawaii
 * JPARepository for exercises
 */

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    <T> List<T> findAllProjectedBy(Class<T> type);

    Exercise findByName(String name);
    /* The function findByNameIgnoreCase is used when adding an exercise to the database to make sure that
     * no duplicates are added. */
    List<ExerciseShort> findByNameIgnoreCase(String name);
    Optional<ExerciseDropDownProjection> getExerciseDropDownById(Long id);

    List<Exercise> findAllByOrderByNameDesc();
    List<Exercise> findAllByOrderByNameAsc();
    List<Exercise> findAllByOrderByDurationDesc();
    List<Exercise> findAllByOrderByDurationAsc();

}