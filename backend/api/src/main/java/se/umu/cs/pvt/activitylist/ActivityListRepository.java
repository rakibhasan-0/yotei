package se.umu.cs.pvt.activitylist;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * JPA interface for ActivityLists.
 * 
 * @author Team Tomato
 * @since 2024-05-08
 * @version 1.0
 */
@Repository
public interface ActivityListRepository extends JpaRepository<ActivityList, Long> {
    ActivityList findByName(String name);

    List<ActivityList> findAllByName(String name);

    @Query("SELECT DISTINCT a FROM ActivityList a LEFT JOIN a.users u WHERE (u.user_id = :userId OR a.author = :userId OR (u IS NULL AND a.author = :userId)) AND a.hidden = :hidden")
    List<ActivityList> findAllByUserIdAndHidden(@Param("userId") Long userId, @Param("hidden") Boolean hidden);

    @Query("SELECT DISTINCT a FROM ActivityList a LEFT JOIN a.users u WHERE (u.user_id = :userId OR a.author = :userId OR (u IS NULL AND a.author = :userId))")
    List<ActivityList> findAllByUserId(@Param("userId") Long userId);

    List<ActivityList> findAllByAuthor(Long userId);

    List<ActivityList> findAllByHidden(Boolean hidden);

    @Query("SELECT DISTINCT a FROM ActivityList a WHERE a.author = :authorId AND a.hidden = :hidden")
    List<ActivityList> findAllByAuthorAndHidden(Long authorId, Boolean hidden);

    @Query("SELECT DISTINCT a FROM ActivityList a LEFT JOIN a.users u WHERE ((u.user_id = :userId OR a.author = :userId) OR (u IS NULL AND a.author = :userId)) AND a.id = :id")
    Optional<ActivityList> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

}
