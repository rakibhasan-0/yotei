package se.umu.cs.pvt.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Interface for exercises
 *
 * @author Grupp 8 Kebabpizza, Hawaii (DOCS: Griffin ens19amd)
 */

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<WorkoutShort> findAllProjectedBy();
    Optional<WorkoutDropDownProjection> getWorkoutDropDownById(Long id);
    @Query("select w from Workout as w, WorkoutFavorite as f where w.id = f.workoutId and f.userId = :id")
    List<Workout> findAllFavorites(int id);

    @Query("select w from Workout as w where w.author = :user_id or w.hidden = false")
    List<WorkoutShort> findAllRelevant(Long user_id);

    List<WorkoutShort> findAllByAuthor(Long user_id);
}