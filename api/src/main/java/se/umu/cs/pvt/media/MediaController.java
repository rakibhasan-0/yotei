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
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
public class MediaController implements HandlerExceptionResolver {

    private MediaRepository mediaRepository;

    /**
     * Service that handles storage of media-files. Can easily be switched to
     * other alternatives by creating a class that implements StorageService if
     * for example it is desired to store files on another place.
     */
    private StorageService mediaStorageService;

    @Autowired
    public MediaController(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
        mediaStorageService = new MediaStorageOnDiskService("/media/");
    }

    public MediaController(MediaRepository mediaRepository, StorageService storageService) {
        this.mediaRepository = mediaRepository;
        mediaStorageService = storageService;
    }

     /**
     * Adds media url to the database
     *
     * @param toAdd the media to add
     * @return a http response, ok if successful and bad request otherwise
     */
     @PostMapping("/add")
     public ResponseEntity<Object> addMedia(@RequestBody List<Media> toAdd) {

        try {
            mediaRepository.saveAll(toAdd);
        } catch (Exception e) {
            return new ResponseEntity<>(toAdd, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>("Media-uppladdning lyckades!",HttpStatus.OK);
     }


     /**
     * Removes all existing media belonging to a technique/exercise in the database.
     *
     * @return a http response, ok if successful and bad request otherwise
     */
     @DeleteMapping("/removeAll/{id}")
     public ResponseEntity<Object> removeAllMedia(@PathVariable("id") Long id){
         List<Media> itemsToRemove;
         ResponseEntity<Object> response = new ResponseEntity<>(HttpStatus.OK);

        if (id == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        try {
            itemsToRemove = mediaRepository.findAllMediaById(id);
            mediaRepository.deleteAll(itemsToRemove);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

         //If stored with StorageService, delete the file
         for (Media media : itemsToRemove) {
             if(media.getLocalStorage()){
                 try {
                     String[] splittedUrl = media.getUrl().split("\\/");
                     String filename = splittedUrl[splittedUrl.length -1];
                     mediaStorageService.delete(filename);
                 } catch (IOException e) {
                     response = new ResponseEntity<>(e.toString(),HttpStatus.BAD_REQUEST);
                 }
             }
         }

        return response;
     }

    /**
     * Removes a particular media belonging to a technique or exercise
     * @param media the media object to remove
     * @param id the id of the technique or exercise
     * @return a http response, ok if successful and bad request otherwise
     */
     @DeleteMapping("/remove/{id}")
     public ResponseEntity<Object> removeSpecificMedia(@RequestBody Media media, @PathVariable("id") Long id) {

         //Delete meta-data from DB
         try {
             mediaRepository.delete(media);
         } catch (Exception e) {
             return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
         }

         //If stored with StorageService, delete the file
         if(media.getLocalStorage()){
             try {
                 String[] splittedUrl = media.getUrl().split("\\/");
                 String filename = splittedUrl[splittedUrl.length -1];
                 mediaStorageService.delete(filename);
             } catch (IOException e) {
                 return new ResponseEntity<>(e.toString(),HttpStatus.BAD_REQUEST);
             }
         }



         return new ResponseEntity<>(HttpStatus.OK);
     }


    /**
     * Removes every media object in a given list of media objects
     * @param toRemove List of media objects to remove
     * @return a http response, ok if successful and bad request otherwise
     */
    @DeleteMapping("/remove")
    @Transactional
    public ResponseEntity<Object> removeMedia(@RequestBody List<Media> toRemove) {
        ResponseEntity<Object> response = new ResponseEntity<>(HttpStatus.OK);

        try {
            for (Media m: toRemove) {
                mediaRepository.deleteListOfMedia(m.getMovementId(), m.getUrl());
            }
        } catch (Exception e) {
            return new ResponseEntity<>(toRemove, HttpStatus.BAD_REQUEST);
        }

        //If stored with StorageService, delete the file
        for (Media media : toRemove) {
            if(media.getLocalStorage()){
                try {
                    String[] splittedUrl = media.getUrl().split("\\/");
                    String filename = splittedUrl[splittedUrl.length -1];
                    mediaStorageService.delete(filename);

                } catch (IOException e) {
                    response = new ResponseEntity<>(e.toString(),HttpStatus.BAD_REQUEST);
                }
            }
        }

        return response;
    }


    /**
     * Gets every media object in the database
     * @return A list of Media objects
     */
    @GetMapping("/all")
    public ResponseEntity<List<Media>> getMediaAll() {
        List<Media> mediaList = mediaRepository.findAll();

        if (mediaList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(mediaList, HttpStatus.OK);
    }

    /**
     * Gets the Media object for a given ID of a movement
     * @param id id of the movement
     * @return A Media object
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getTechniqueURLs(@PathVariable("id") Long id) {
         if (id == null) {
             return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
         }

        List<Media> mediaList = mediaRepository.findAllMediaById(id);

        if (mediaList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(mediaList, HttpStatus.OK);

    }

    /**
     * Handles uploading of files. Stores the uploaded file.
     * @param file File to be uploaded and stored
     * @return The URL of the uploaded file
     * @throws JsonProcessingException writeValueAsString throws this in case of faulty Json
     */
    @PostMapping("/upload")
    public ResponseEntity<Object> handleFileUpload(@RequestParam("file") MultipartFile file) throws JsonProcessingException {
        Map<String, Object> response = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();
        String storedFileName;

        //Store file with used storage-service
        try {
            storedFileName = mediaStorageService.store(file);
        } catch (IOException e) {
            return new ResponseEntity<>(e.toString(),HttpStatus.EXPECTATION_FAILED);
        } catch (IllegalArgumentException e){
            return new ResponseEntity<>(e.toString(),HttpStatus.BAD_REQUEST);
        }

        //Fill response with name where resource can be accessed on
        response.put("filename", storedFileName);

        //Convert response to string and encode special characters
        String stringResponse = mapper.writeValueAsString(response);
        return new ResponseEntity<>(stringResponse, HttpStatus.CREATED);
    }

    /**
     * Gets a requested media from the server
     * @param filename The filename of the wanted media
     * @return The media in a Http-body format
     */
    @GetMapping("/files/{filename}")
    public ResponseEntity<Object> serveMediaFile(@PathVariable String filename) {

        Resource file;
        try {
            file = mediaStorageService.loadAsResource(filename);
        } catch (IOException e) {
            return new ResponseEntity<>("Kunde inte hitta önskad resurs på server",HttpStatus.EXPECTATION_FAILED);
        }

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    /**
     * Handles MaxUploadSizeExceededExceptions
     *
     */
    @Override
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        ModelAndView modelAndView = new ModelAndView("file");
        if (ex instanceof MaxUploadSizeExceededException) {
            modelAndView.getModel().put("message", "File size exceeds limit!");
        }
        return modelAndView;
    }
}
