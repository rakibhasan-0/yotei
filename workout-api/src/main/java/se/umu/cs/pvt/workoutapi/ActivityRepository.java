package se.umu.cs.pvt.workoutapi;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * JPARepository for exercises
 *
 * @author Grupp 8 Kebabpizza
 */
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findAllByWorkoutId(Long workoutId);
}
