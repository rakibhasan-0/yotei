package se.umu.cs.pvt.media;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repository for media.
 *
 * @author Dragon Dynasty 
 * date: 2024-05-03
 */
public interface MediaRepository extends JpaRepository<Media, Long> {

    @Query("select m from Media as m where m.movementId = :id")
    List<Media> findAllMediaById(Long id);

    @Query("select m from Media as m where m.movementId = :id and m.url = :url")
    Media findSingleMediaByIdAndUrl(Long id, String url);

    @Modifying
    @Query("delete from Media as m where m.movementId = :id and m.url = :url")
    void deleteListOfMedia(Long id, String url);

}