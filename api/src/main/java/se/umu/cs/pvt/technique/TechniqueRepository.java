package se.umu.cs.pvt.technique;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * JPARepository for techniques.
 */
public interface TechniqueRepository extends JpaRepository<Technique, Long> {
    <T> List<T> findAllProjectedBy(Class<T> type);

    Technique findByName(String name);

    /* The function findByNameIgnoreCase is used when adding a technique to the database to make sure that
    * no duplicates are added. */
    List<TechniqueShort> findByNameIgnoreCase(String name);
}
