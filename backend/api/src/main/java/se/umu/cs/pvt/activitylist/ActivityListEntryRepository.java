package se.umu.cs.pvt.activitylist;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityListEntryRepository extends JpaRepository<ActivityListEntry, Long> {

    List<ActivityListEntry> findAllByListId(Long listId);

}
