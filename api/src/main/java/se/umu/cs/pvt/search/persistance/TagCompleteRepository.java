package se.umu.cs.pvt.search.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import se.umu.cs.pvt.tag.Tag;

import java.util.Optional;

import javax.swing.text.html.Option;

import java.util.List;

/**
 * Repository for Tag completion.
 *
 * @author Minotaur (Olle Lögdahl), Kraken (Oskar Westerlund)
 * @author Kraken (Oskar Westerlund Holmgren) 2023-05-03
 * 
 * @version 2.0
 */

@Repository
public interface TagCompleteRepository extends JpaRepository<Tag,Long> {

    @Query(value = "SELECT x.name FROM tag AS x WHERE x.name NOT IN :currentTags AND x.name LIKE (:partialName || '%') LIMIT 3", nativeQuery = true)
    List<String> completeTag(@Param("partialName") String partialName, @Param("currentTags") List<String> currentTags);
}
