package se.umu.cs.pvt.media;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for fetching media.
 *
 * @author Dragon Dynasty 
 * date: 2023-05-03
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/media")
public class MediaController {

    private MediaRepository mediaRepository;

    @Autowired
    public MediaController(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

     /**
     * Adds media url to the database
     *
     * @param toAdd the media to add
     * @return a http response
     */
     @PostMapping("/add")
     public ResponseEntity<Object> addMedia(@RequestBody List<Media> toAdd) {

        try {
            System.out.println(toAdd);
           //mediaRepository.save(toAdd);
            mediaRepository.saveAll(toAdd);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(toAdd, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(toAdd, HttpStatus.OK);
     }


     /**
     * Removes all existing media belonging to a technique/exercise in the database.
     *
     * @return a http response, ok if successful and bad request otherwise
     */
     @DeleteMapping("/removeAll/{id}")
     public ResponseEntity<Void> removeAllMedia(@PathVariable("id") Long id){
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        try {
            List<Media> itemsToRemove = mediaRepository.findAllMediaById(id);
            mediaRepository.deleteAll(itemsToRemove);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(HttpStatus.OK);
     }

    /**
     * Removes a particular media belonging to a technique or exercise
     * @param media the media object to remove
     * @param id the id of the technique or exercise
     * @return void
     */
     @DeleteMapping("/remove/{id}")
     public ResponseEntity<Void> removeSpecificMedia(@RequestBody Media media, @PathVariable("id") Long id) {

         try {
             mediaRepository.delete(media);
         } catch (Exception e) {
             return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
         }

         return new ResponseEntity<>(HttpStatus.OK);
     }

    @DeleteMapping("/remove")
    @Transactional
    public ResponseEntity<Object> removeMedia(@RequestBody List<Media> toRemove) {

        try {
//            mediaRepository.deleteAll(toRemove);
            for (Media m: toRemove) {
                mediaRepository.deleteListOfMedia(m.getMovementId(), m.getUrl());
            }
        } catch (Exception e) {
            return new ResponseEntity<>(toRemove, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(toRemove, HttpStatus.OK);
    }

    @GetMapping("/all")
    public Object getMediaAll() {
        List<Media> mediaList = mediaRepository.findAll();

        if (mediaList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return mediaList;
    }

    @GetMapping("/{id}")
    public Object getTechniqueURLs(@PathVariable("id") Long id) {
         if (id == null) {
             return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
         }

        List<Media> mediaList = mediaRepository.findAllMediaById(id);

        if (mediaList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return mediaList;

    }

}
