/**
 * The Tag API repository. Based on Spring JPA Repository.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
 */
package se.umu.cs.pvt.tag;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    Tag getTagByName(String name);

    Optional<Tag> findTagByName(String name);
}
