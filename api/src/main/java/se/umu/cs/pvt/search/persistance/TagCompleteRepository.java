package se.umu.cs.pvt.search.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import se.umu.cs.pvt.tag.Tag;

import java.util.Optional;

/**
 * Repository for Tag completion.
 *
 * @author Minotaur (Olle Lögdahl)
 * @author Kraken (Oskar Westerlund)
 */

@Repository
public interface TagCompleteRepository extends JpaRepository<Tag,Long> {

    @Query(value = "SELECT x.name FROM tag AS x WHERE x.name LIKE (:partialName || '%') LIMIT 1", nativeQuery = true)
    Optional<String> completeTag(@Param("partialName") String partialName);
}
