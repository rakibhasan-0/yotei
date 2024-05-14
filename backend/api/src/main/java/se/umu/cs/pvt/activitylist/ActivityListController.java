package se.umu.cs.pvt.activitylist;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.RequestBody;
import se.umu.cs.pvt.user.JWTUtil;

/**
 * ActivityList API for retreiving, creating, removing and editing activityList
 * objects.
 * 
 * @author Team Tomato
 * @since 2024-05-14
 * @version 1.0
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/activitylists")
public class ActivityListController {
    private final ActivityListRepository listRepository;
    private final ActivityListService activityListService;

    private DecodedJWT jwt;
    private Long userIdL;
    private String userRole;

    @Autowired
    private JWTUtil jwtUtil;

    public ActivityListController(ActivityListRepository listRepository, ActivityListService activityListService) {
        this.listRepository = listRepository;
        this.activityListService = activityListService;

    }

    /**
     * Adds an activity list.
     * 
     * @param listToAdd example body:
     *                  {"id":1,"author":1,"name":"xx","desc":"king","hidden":true,"date":[2024,5,3],"userId":2}
     * @param token     token of the user requesting to add a list
     * @return the added activity list if successful
     *         Unauthorized if token is invalid
     *         Bad request if list json is not complete
     *         Conflict if there exists a list with the same name for that user
     *         Forbidden if the token does not match the author of the list to add
     */
    @PostMapping("/add")
    public ResponseEntity<ActivityList> addList(@RequestBody ActivityList listToAdd,
            @RequestHeader(value = "token") String token) {
        try {
            jwt = jwtUtil.validateToken(token);
            userIdL = jwt.getClaim("userId").asLong();
            userRole = jwt.getClaim("role").asString();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        if (listToAdd.hasNullFields() || listToAdd.getName().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<ActivityList> results;
        if ((results = listRepository.findAllByName(listToAdd.getName())) != null) {
            for (ActivityList list : results) {
                if (list.getAuthor() == listToAdd.getAuthor()) {
                    return new ResponseEntity<>(HttpStatus.CONFLICT);
                }
            }
        }
        // kolla author/userid här?
        if (userIdL != listToAdd.getAuthor() && !userRole.equals("ADMIN")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        listRepository.save(listToAdd);
        return new ResponseEntity<>(listToAdd, HttpStatus.CREATED);
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
            jwt = jwtUtil.validateToken(token);
            userIdL = jwt.getClaim("userId").asLong();
            userRole = jwt.getClaim("role").asString();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Optional<ActivityList> result = listRepository.findById(id);
        if (result.isPresent()) {
            ActivityList list = result.get();
            if (list.getAuthor() == userIdL || userRole.equals("ADMIN")) {
                listRepository.delete(list);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else {
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
     */
    @PostMapping("/edit")
    public ResponseEntity<ActivityList> editList(@RequestBody ActivityList listToUpdate,
            @RequestHeader(value = "token") String token) {
        try {
            jwt = jwtUtil.validateToken(token);
            userIdL = jwt.getClaim("userId").asLong();
            userRole = jwt.getClaim("role").asString();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Optional<ActivityList> result = listRepository.findById(listToUpdate.getId());
        if (result.isPresent()) {
            ActivityList list = result.get();
            if (list.getAuthor() == userIdL || userRole.equals("ADMIN")) {
                if (listToUpdate.getName() != null) {
                    list.setName(listToUpdate.getName());
                }
                if (listToUpdate.getDesc() != null) {
                    list.setDesc(listToUpdate.getDesc());
                }

                list.setHidden(listToUpdate.getHidden());
                listRepository.save(list);
                return new ResponseEntity<>(list, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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
    public ResponseEntity<List<ActivityListDTO>> getUserLists(
            @RequestHeader(value = "token") String token) {
        try {
            jwt = jwtUtil.validateToken(token);
            userIdL = jwt.getClaim("userId").asLong();
            userRole = jwt.getClaim("role").asString();
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<ActivityList> results = listRepository.findAllByAuthor(userIdL);
        if (results.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        List<ActivityListDTO> dtos = results.stream()
                .map(ActivityListDTO::new)
                .collect(Collectors.toList());
        return new ResponseEntity<>(dtos, HttpStatus.OK);
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

        List<ActivityListShortDTO> results = new ArrayList<>();
        try {
            jwt = jwtUtil.validateToken(token);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        results = activityListService.getAllAccessibleActivityListsDTO(jwt, hidden, isAuthor);

        if (results.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(results, HttpStatus.OK);
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
            DecodedJWT jwt = jwtUtil.validateToken(token);
            ActivityListDTO dto = activityListService.getDetails(jwt, id);

            if (dto == null) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(dto, HttpStatus.OK);

        } catch (JWTVerificationException e) {
            return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
        } catch (UnauthorizedAccessException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Bad request", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.GONE);
        }
    }

}