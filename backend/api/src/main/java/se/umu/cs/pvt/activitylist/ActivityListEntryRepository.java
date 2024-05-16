package se.umu.cs.pvt.activitylist;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * JPARepository interface for ActivityListEntry
 * 
 * @author Team Tomato
 * @since 2024-05-16
 * @version 1.0
 */
@Repository
public interface ActivityListEntryRepository extends JpaRepository<ActivityListEntry, Long> {

    List<ActivityListEntry> findAllByListId(Long listId);

}
