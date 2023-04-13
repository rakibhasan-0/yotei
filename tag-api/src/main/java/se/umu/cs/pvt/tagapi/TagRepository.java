/**
 * The Tag API repository. Based on Spring JPA Repository.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tagapi;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


/**
 * JPARepository for tags.
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    /**
     * Gets the tag entity.
     * @param name The name of the tag.
     * @return The tag entity.
     */
    Tag getTagByName(String name);

}
