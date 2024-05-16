package se.umu.cs.pvt.tag;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * The Tag API repository. Based on Spring JPA Repository.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
 * @Author Team 3 Durian
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    // An interface-based projection
    interface TagWithUsage {
        long getId();
        String getName();
        int getExercises();
        int getTechniques();
        int getWorkouts();
    }

    static final String SQL_SELECT_TAG_WITH_USAGE = 
    """
    SELECT * FROM (
        SELECT tag.tag_id AS id, tag.name,
            (SELECT COUNT(*) FROM exercise_tag  AS e WHERE e.tag_id = tag.tag_id) AS exercises,
            (SELECT COUNT(*) FROM technique_tag AS t WHERE t.tag_id = tag.tag_id) AS techniques,
            (SELECT COUNT(*) FROM workout_tag   AS w WHERE w.tag_id = tag.tag_id) AS workouts
        FROM tag
    ) 
    """;

    static final String SQL_ORDER_BY_USAGE = "ORDER BY exercises + techniques + workouts ";
    static final String SQL_ORDER_BY_NAME = "ORDER BY name ";
    static final String SQL_CONTAINING_NAME = "WHERE name ILIKE %:name% ";


    Tag getTagByName(String name);

    Optional<Tag> findTagByName(String name);
    
    @Query(nativeQuery = true, value = SQL_SELECT_TAG_WITH_USAGE + SQL_ORDER_BY_USAGE + "DESC")
    List<TagWithUsage> getAllByOrderByUseDesc();

    @Query(nativeQuery = true, value = SQL_SELECT_TAG_WITH_USAGE + SQL_ORDER_BY_USAGE + "ASC")
    List<TagWithUsage> getAllByOrderByUseAsc();
    /**
     * Warning: remember to escape LIKE wildcards.
     */
    @Query(nativeQuery = true, value = SQL_SELECT_TAG_WITH_USAGE + SQL_CONTAINING_NAME + SQL_ORDER_BY_USAGE + "ASC")
    List<TagWithUsage> findAllByNameContainingIgnoreCaseOrderByUseAsc(String name);

    /**
     * Warning: remember to escape LIKE wildcards.
     */
    @Query(nativeQuery = true, value = SQL_SELECT_TAG_WITH_USAGE + SQL_CONTAINING_NAME + SQL_ORDER_BY_USAGE +  "DESC")
    List<TagWithUsage> findAllByNameContainingIgnoreCaseOrderByUseDesc(String name);

    @Query(nativeQuery = true, value = SQL_SELECT_TAG_WITH_USAGE + SQL_ORDER_BY_NAME + "DESC")
    List<TagWithUsage> getAllByOrderByNameDesc();

    @Query(nativeQuery = true, value = SQL_SELECT_TAG_WITH_USAGE + SQL_ORDER_BY_NAME + "ASC")
    List<TagWithUsage> getAllByOrderByNameAsc();

    /**
     * Warning: remember to escape LIKE wildcards.
     */
    @Query(nativeQuery = true, value = SQL_SELECT_TAG_WITH_USAGE + SQL_CONTAINING_NAME + SQL_ORDER_BY_NAME + "ASC")
    List<TagWithUsage> findAllByNameContainingIgnoreCaseOrderByNameAsc(String name);
    
    /**
     * Warning: remember to escape LIKE wildcards.
     */
    @Query(nativeQuery = true, value = SQL_SELECT_TAG_WITH_USAGE + SQL_CONTAINING_NAME + SQL_ORDER_BY_NAME + "DESC")
    List<TagWithUsage> findAllByNameContainingIgnoreCaseOrderByNameDesc(String name);
}
