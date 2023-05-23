package se.umu.cs.pvt.media;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.InetAddress;
import java.net.UnknownHostException;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private MediaStorageOnDiskService mediaStorageOnDiskService;

    @Autowired
    public MediaController(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
        mediaStorageOnDiskService = new MediaStorageOnDiskService("/media/");
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
            mediaRepository.saveAll(toAdd);
        } catch (Exception e) {
            return new ResponseEntity<>(toAdd, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(HttpStatus.OK);
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

    @PostMapping("/upload")
    public ResponseEntity<Object> handleFileUpload(@RequestParam("file") MultipartFile file, HttpServletRequest request) throws JsonProcessingException, UnknownHostException {
        //TODO : No tests exists on this method. -Make escape-character test.
        Map<String, Object> response = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();

        //Store file with used storage-service
        try {
            mediaStorageOnDiskService.store(file);
        } catch (IOException e) {
            return new ResponseEntity<>("Kunde inte spara önskad fil på server",HttpStatus.EXPECTATION_FAILED);
        }

        //Fill response with url where media can be reached
        final String reachedOnUrl = "/api/media/files/" + file.getOriginalFilename();
        System.out.println("Uploaded succesful. Item can be reached on: "+reachedOnUrl);
        response.put("url", reachedOnUrl);

        //Convert response to string and encode special characters
        String stringResponse = mapper.writeValueAsString(response);

        return new ResponseEntity<>(stringResponse, HttpStatus.CREATED);
    }

    @GetMapping("/files/{filename}")
    public ResponseEntity<Object> serveMediaFile(@PathVariable String filename) {

        Resource file = null;
        try {
            file = mediaStorageOnDiskService.loadAsResource(filename);
        } catch (IOException e) {
            return new ResponseEntity<>("Kunde inte hitta önskad resurs på server",HttpStatus.EXPECTATION_FAILED);
        }
        System.out.println( "The file " + filename + "have been requested. File of service: "+ file.getFilename());

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

}
