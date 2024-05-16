package se.umu.cs.pvt.activitylist;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.RequestBody;

import se.umu.cs.pvt.activitylist.Dtos.*;
import se.umu.cs.pvt.workout.UserShortRepository;

/**
 * ActivityList API for retreiving, creating, removing and editing activityList
 * objects.
 * 
 * @author Team Tomato ,updated 2024-05-16
 * @since 2024-05-08
 * @version 1.0
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/activitylists")
public class ActivityListController {
    private final ActivityListService activityListService;

    public ActivityListController(ActivityListService activityListService,
            UserShortRepository userShortRepository) {
        this.activityListService = activityListService;
    }

    /**
     * Adds an activity list.
     * 
     * @param listToAdd example body:
     *                  {"id":1,"author":1,"name":"xx","desc":"king","hidden":true,"date":[2024,5,3]}
     * @param token     token of the user requesting to add a list
     * @return the created activitylists id when successfull
     *         Unauthorized if token is invalid
     *         Bad request if list json is not complete
     *         Conflict if there exists a list with the same name for that user
     *         Forbidden if the token does not match the author of the list to add
     */
    @PostMapping("/add")
    public ResponseEntity<Long> addList(@RequestBody ActivityListRequest listToAdd,
            @RequestHeader(value = "token") String token) {
        try {
            Long id = activityListService.addActivityList(listToAdd, token);
            return new ResponseEntity<>(id, HttpStatus.CREATED);
        } catch (UnauthorizedAccessException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (BadRequestException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (ConflictException e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    /**
     * Removes an activity list.
     * 
     * @param id    id of list to remove
     * @param token token of the user requesting to remove a list
     * @return OK if the the removal was successful
     *         Unauthorized if token is invalid
     *         Forbidden if the token is not the author of the list to remove
     *         Not found if the list to be removed was not found
     */
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeList(@RequestParam("id") Long id, @RequestHeader(value = "token") String token) {
        try {
            activityListService.removeActivityList(id, token);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (UnauthorizedAccessException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (ForbiddenException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Edits an activity list.
     * 
     * @param id    id of the list to remove
     * @param name  name list should get, null if name should remain the same
     * @param desc  description list should get, null if description should remain
     *              the same
     * @param token token of the user requesting the edit
     * @return updated activity list if successful
     *         Unauthorized if token is invalid
     *         Forbidden if the token is not the author of the list to be edited
     *         Not found if the list to be edited was not found
     *         Bad Request when the Activities type is incorrect
     */
    @PutMapping("/edit")
    public ResponseEntity<Long> editList(@RequestBody ActivityListRequest listToUpdate,
            @RequestHeader(value = "token") String token) {
        try {
            Long updatedId = activityListService.editActivityList(listToUpdate, token);
            return new ResponseEntity<>(updatedId, HttpStatus.OK);
        } catch (UnauthorizedAccessException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (ForbiddenException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    /**
     * Returns all activity lists created by the user. The user has permissions to
     * edit these lists
     * 
     * @param user_id id of the user
     * @param token   token of the user
     * @return list of activity lists if successful
     *         Unauthorized if token is invalid
     *         No Content if there are no lists created by the user
     */
    @GetMapping("/userlists")
    public ResponseEntity<List<ActivityListShortDTO>> getUserLists(
            @RequestHeader(value = "token") String token) {
        try {
            List<ActivityListShortDTO> dtos = activityListService.getUserActivityLists(token);
            if (dtos.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        } catch (UnauthorizedAccessException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Returns all lists that the user has access to
     * 
     * @param hidden   when true. returns private lists
     * @param isAuthor when true, returns only the lists created by the user
     * @param token    token of the user
     * @return list of activity lists if successful
     *         Unauthorized if token is invalid
     *         No Content if there are no lists created by the user
     */
    @GetMapping("/")
    public ResponseEntity<List<ActivityListShortDTO>> getAllLists(@RequestParam(required = false) Boolean hidden,
            @RequestParam(required = false) Boolean isAuthor,
            @RequestHeader(value = "token") String token) {

        try {
            List<ActivityListShortDTO> dtos = activityListService.getAllActivityLists(hidden, isAuthor, token);
            if (dtos.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        } catch (UnauthorizedAccessException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Returns the list if the user has access to it.
     * 
     * @param token token of the user
     * @return list of activity lists if successful
     *         Unauthorized if token is invalid
     *         No Content if there are no lists created by the user
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getDetails(
            @PathVariable Long id,
            @RequestHeader(value = "token") String token) {

        try {
            ActivityListDTO dto = activityListService.getActivityListDetails(id, token);
            if (dto == null) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (UnauthorizedAccessException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (ForbiddenException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Bad request", HttpStatus.BAD_REQUEST);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>("Activity list not found", HttpStatus.GONE);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}