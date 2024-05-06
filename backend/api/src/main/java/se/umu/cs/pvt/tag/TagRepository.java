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
 * @Author Team Durian
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    // An interface-based projection
    interface TagUsageStats {
        int getExercises();
        int getTechniques();
        int getWorkouts();
    }

    static final String SQL_USAGE_SUM =
    """
    ORDER BY
    (SELECT COUNT(*) FROM exercise_tag  AS e WHERE tag.tag_id = e.tag_id) +
    (SELECT COUNT(*) FROM technique_tag AS t WHERE tag.tag_id = t.tag_id) +
    (SELECT COUNT(*) FROM workout_tag   AS w WHERE tag.tag_id = w.tag_id) 
    """;
    static final String SQL_ALL_TAGS = "SELECT * FROM tag ";

    static final String SQL_CONTAINING = "WHERE name ILIKE %:name% ";

    static final String SQL_USAGE_STATS =
    """
    SELECT
    (SELECT COUNT(*) FROM exercise_tag  AS e WHERE e.tag_id = :tagId) AS exercises,
    (SELECT COUNT(*) FROM technique_tag AS t WHERE t.tag_id = :tagId) AS techniques,
    (SELECT COUNT(*) FROM workout_tag   AS w WHERE w.tag_id = :tagId) AS workouts;
    """;


    Tag getTagByName(String name);

    Optional<Tag> findTagByName(String name);

    /**
     * Warning: remember to escape LIKE wildcards.
     */
    @Query(nativeQuery = true, value = SQL_ALL_TAGS + SQL_USAGE_SUM + "DESC")
    List<Tag> getAllByOrderByUseDesc();

    /**
     * Warning: remember to escape LIKE wildcards.
     */
    @Query(nativeQuery = true, value = SQL_ALL_TAGS + SQL_USAGE_SUM + "ASC")
    List<Tag> getAllByOrderByUseAsc();

    @Query(nativeQuery = true, value = SQL_ALL_TAGS + SQL_CONTAINING + SQL_USAGE_SUM + "ASC")
    List<Tag> findAllByNameContainingIgnoreCaseOrderByUseAsc(@Param("name") String name);

    @Query(nativeQuery = true, value = SQL_ALL_TAGS + SQL_CONTAINING + SQL_USAGE_SUM + "DESC")
    List<Tag> findAllByNameContainingIgnoreCaseOrderByUseDesc(@Param("name") String name);

    List<Tag> getAllByOrderByNameDesc();
    List<Tag> getAllByOrderByNameAsc();

    // @Param is required due to a bug, see https://stackoverflow.com/a/71649782
    List<Tag> findAllByNameContainingIgnoreCaseOrderByNameAsc(@Param("name") String name);
    List<Tag> findAllByNameContainingIgnoreCaseOrderByNameDesc(@Param("name") String name);

    @Query(nativeQuery = true, value = SQL_USAGE_STATS)
    TagUsageStats getUsageStatsById(@Param("tagId") long tagId);
}
