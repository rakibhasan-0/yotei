package se.umu.cs.pvt.technique;

import org.springframework.data.jpa.repository.JpaRepository;
import se.umu.cs.pvt.exercise.Exercise;

import java.util.List;
import java.util.Optional;

/**
 * JPARepository for techniques.
 */
public interface TechniqueRepository extends JpaRepository<Technique, Long> {
    <T> List<T> findAllProjectedBy(Class<T> type);

    Technique findByName(String name);

    Optional<Technique> getByNameIgnoreCase(String name);

    /* The function findByNameIgnoreCase is used when adding a technique to the database to make sure that
    * no duplicates are added. */
    List<TechniqueShort> findByNameIgnoreCase(String name);
}
