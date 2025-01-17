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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.RequestBody;

import se.umu.cs.pvt.activitylist.Dtos.*;
import se.umu.cs.pvt.workout.UserShortRepository;

/**
 * ActivityList API for retreiving, creating, removing and editing activityList
 * objects.
 * 
 * @author Team Tomato ,updated 2024-05-16, updated 2024-05-27
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

    @Operation(summary = "Adds an activity list.", description = "Adds a new activity list. Requires a valid user token and a complete activity list request body.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created - Successfully added the activity list"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Token is invalid"),
            @ApiResponse(responseCode = "400", description = "Bad Request - List JSON is incomplete"),
            @ApiResponse(responseCode = "409", description = "Conflict - List with the same name already exists for the user"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Token does not match the author of the list")
    })
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

    @Operation(summary = "Removes an activity list.", description = "Removes an existing activity list. Requires a valid user token and the ID of the list to be removed.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK - Successfully removed the activity list"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Token is invalid"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Token does not match the author of the list"),
            @ApiResponse(responseCode = "404", description = "Not Found - Activity list not found")
    })
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
    @Operation(summary = "Edits an activity list.", description = "Edits an existing activity list. Requires a valid user token and the updated activity list request body.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK - Successfully updated the activity list"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Token is invalid"),
            @ApiResponse(responseCode = "404", description = "Not Found - Activity list not found"),
            @ApiResponse(responseCode = "400", description = "Bad Request - List data is incorrect"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Token does not match the author of the list")
    })
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
     * Returns the list if the user has access to it.
     * 
     * @param token token of the user
     * @return list of activity lists if successful
     *         Unauthorized if token is invalid
     *         No Content if there are no lists created by the user
     */
    @Operation(summary = "Returns the details of a specific activity list.", description = "Fetches the details of an activity list by its ID. Requires a valid user token and the ID of the activity list.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK - Successfully retrieved the activity list details"),
            @ApiResponse(responseCode = "204", description = "No Content - Activity list not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Token is invalid"),
            @ApiResponse(responseCode = "403", description = "Forbidden - User does not have access to the list"),
            @ApiResponse(responseCode = "400", description = "Bad Request - Invalid request parameters"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error - Unexpected error occurred")
    })
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
            return new ResponseEntity<>("Activity list not found", HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}