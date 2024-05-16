package se.umu.cs.pvt.activitylist;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.auth0.jwt.interfaces.DecodedJWT;


import se.umu.cs.pvt.exercise.Exercise;
import se.umu.cs.pvt.exercise.ExerciseRepository;
import se.umu.cs.pvt.technique.Technique;
import se.umu.cs.pvt.technique.TechniqueRepository;
import se.umu.cs.pvt.user.JWTUtil;

/**
 * EntryResponse class
 * 
 * Used as response for retrieval of entries.
 */
class EntryResponse {
    private Technique technique;
    private Exercise exercise;

    public Technique getTechnique() {
        return technique;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setTechnique(Technique technique) {
        this.technique = technique;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }

}

/**
 * ActivityListEntry API for adding and removing entries to/from activity lists.
 * 
 * @author Team Tomato
 * @since 2024-05-08
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/activitylistentry")
public class ActivityListEntryController {
    private final ActivityListEntryRepository listEntryRepository;
    private final ActivityListRepository listRepository;
    private final ExerciseRepository exerciseRepository;
    private final TechniqueRepository techniqueRepository;

    private DecodedJWT jwt;
    private Long userIdL;
    private String userRole;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    public ActivityListEntryController(ActivityListEntryRepository listEntryRepository,
            ActivityListRepository listRepository, ExerciseRepository exerciseRepository,
            TechniqueRepository techniqueRepository) {
        this.listEntryRepository = listEntryRepository;
        this.listRepository = listRepository;
        this.exerciseRepository = exerciseRepository;
        this.techniqueRepository = techniqueRepository;
    }

    /**
     * Adds an entry to an activity list
     * 
     * @param entry entry object
     * @param token token of the user making the request
     * @return OK if successful
     *         Unauthorized if token is invalid
     *         Forbidden if user is not (admin or) author of the activity list its
     *         trying to add an entry to
     *         Not found if the activity list could not be found
     * 
     */
    @PostMapping("/add")
    public ResponseEntity<Void> addEntry(@RequestBody ActivityListEntry entry,
            @RequestHeader(value = "token") String token) {
        try {
            jwt = jwtUtil.validateToken(token);
            userIdL = jwt.getClaim("userId").asLong();
            userRole = jwt.getClaim("role").asString();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Optional<ActivityList> result = listRepository.findById(entry.getListId());
        if (result.isPresent()) {
            ActivityList list = result.get();
            if (list.getAuthor() == userIdL || userRole.equals("ADMIN")) {
                listEntryRepository.save(entry);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Adds an entry to multiple activity lists, 
     * the list id supplied in the entry does not need to be supplied in the id list (but can be).
     * 
     * @param entry entry object
     * @param ids list of activity list ids to which the entry will be added
     * @param token token of the user making the request
     * @return OK if successful
     *         Unauthorized if token was invalid
     *         Forbidden if the the user does not have access to all the lists supplied
     *         Requested range not satisfiable if any of the supplied lists could not be found
     */

    @PostMapping("/multiAdd")
    public ResponseEntity<Void> addEntryToMultipleLists(@RequestBody ActivityListEntry entry, 
                                                        @RequestHeader(value = "ids") ArrayList<Long> ids, 
                                                        @RequestHeader(value = "token") String token){
        try {
            jwt = jwtUtil.validateToken(token);
            userIdL = jwt.getClaim("userId").asLong();
            userRole = jwt.getClaim("role").asString();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }    
        if(!ids.contains(entry.getListId())){
            Optional<ActivityList> opt_list_result = listRepository.findById(entry.getListId());
            if(opt_list_result.isPresent()){
                ActivityList list_result = opt_list_result.get();
                if(list_result.getAuthor() == userIdL || userRole.equals("ADMIN")){
                    listEntryRepository.save(entry);
                }
                else{
                    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
                }
            }
            else{
                return new ResponseEntity<>(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE);
            }
        } 
        for(Long id : ids){
            entry.setListId(id);
            Optional<ActivityList> result = listRepository.findById(id);
            if(result.isPresent()){
                ActivityList list = result.get();
                if(list.getAuthor() == userIdL || userRole.equals("ADMIN")){
                    listEntryRepository.save(entry);
                }
                else{
                    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
                }
            }
            else{
                return new ResponseEntity<>(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE);
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }


    /**
     * @deprecated USE EDIT IN ACTIVITY LIST WHEN REMOVING ENTRIES 
     * 
     * Removes an entry from an activity list. 
     * 
     * @param id    id of the entry
     * @param token token of the user making the request
     * @return OK if successful
     *         Unauthorized if token is invalid
     *         Forbidden if the user is not (admin or) the author of the activity
     *         list the entry is being removed from
     *         Not found if the activity list OR the entry could not be found
     */
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeEntry(@RequestHeader("id") Long id, @RequestHeader(value = "token") String token) {
        try {
            jwt = jwtUtil.validateToken(token);
            userIdL = jwt.getClaim("userId").asLong();
            userRole = jwt.getClaim("role").asString();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Optional<ActivityListEntry> entryResult = listEntryRepository.findById(id);
        if (entryResult.isPresent()) {
            ActivityListEntry entry = entryResult.get();
            Optional<ActivityList> listResult = listRepository.findById(entry.getListId());
            if (listResult.isPresent()) {
                ActivityList list = listResult.get();
                if (list.getAuthor() == userIdL || userRole.equals("ADMIN")) {
                    listEntryRepository.delete(entry);
                    return new ResponseEntity<>(HttpStatus.OK);
                }
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Returns a list of all activity list entries and their corresponding
     * exercise/technique for specified activity list
     * 
     * @param activityListId activity list id
     * @param token          token of user making the request
     * @return list of entries if successful
     *         Unauthorized if token is invalid
     *         Forbidden if the user making the request is not the author of the
     *         activity list
     *         Not found if the activity list was not found
     *         No content if the list did not contain any entries
     */
    @GetMapping("/all/{list_id}")
    public ResponseEntity<List<EntryResponse>> getEntriesForList(
            @PathVariable(name = "list_id") Long listId,
            @RequestHeader(value = "token") String token) {
        try {
            jwt = jwtUtil.validateToken(token);
            userIdL = jwt.getClaim("userId").asLong();
            userRole = jwt.getClaim("role").asString();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Optional<ActivityList> result = listRepository.findById(listId);
        if (result.isPresent()) {
            ActivityList list = result.get();
            if (list.getAuthor() == userIdL || userRole.equals("ADMIN")) {
                List<ActivityListEntry> results = listEntryRepository.findAllByListId(listId);

                if (results.isEmpty()) {
                    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
                } else {
                    List<EntryResponse> response = new ArrayList<>();
                    Optional<Technique> technique;
                    Optional<Exercise> exercise;
                    for (ActivityListEntry entry : results) {
                        EntryResponse entryResponse = new EntryResponse();
                        if (entry.getTechniqueId() != null) {
                            if ((technique = techniqueRepository.findById(entry.getTechniqueId())).isPresent()) {
                                entryResponse.setTechnique(technique.get());
                            }
                        }
                        if (entry.getExerciseId() != null) {
                            if ((exercise = exerciseRepository.findById(entry.getExerciseId())).isPresent()) {
                                entryResponse.setExercise(exercise.get());
                            }
                        }

                        response.add(entryResponse);
                    }
                    return new ResponseEntity<>(response, HttpStatus.OK);
                }

            }
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

}
