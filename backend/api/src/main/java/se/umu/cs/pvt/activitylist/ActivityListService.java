package se.umu.cs.pvt.activitylist;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import se.umu.cs.pvt.activitylist.Dtos.ActivityListDTO;
import se.umu.cs.pvt.activitylist.Dtos.ActivityListShortDTO;
import se.umu.cs.pvt.activitylist.Dtos.UserShortDTO;
import se.umu.cs.pvt.user.JWTUtil;
import se.umu.cs.pvt.workout.UserShort;
import se.umu.cs.pvt.workout.UserShortRepository;

/**
 * ActivityListService used in ActivityListController
 * 
 * @author Team Tomato, updated 2024-05-21
 * @since 2024-05-12
 * @version 1.1
 */
@Component
public class ActivityListService implements IActivityListService {
    private final UserShortRepository userShortRepository;
    private final ActivityListRepository activityListRepository;
    private final JWTUtil jwtUtil;

    private static final String ROLE_ADMIN = "ADMIN";

    public ActivityListService(UserShortRepository userShortRepository, ActivityListRepository activityListRepository,
            JWTUtil jwtUtil) {
        this.userShortRepository = userShortRepository;
        this.activityListRepository = activityListRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Converts an ActivityList object to an ActivityListShortDTO
     * 
     * @param activityList the list to be converted
     * @return converted object
     */
    ActivityListShortDTO convertToActivityListShortDTO(ActivityList activityList, Long userId) {
        Optional<UserShort> authorOpt = userShortRepository.findById(activityList.getAuthor());
        if (authorOpt.isPresent()) {
            UserShort author = authorOpt.get();
            UserShortDTO authorDTO = (author != null) ? new UserShortDTO(author) : null;
            Boolean isShared = false;
            if (author.getUser_id() == userId && !activityList.getUsers().isEmpty()) {
                isShared = true;
            }
            return new ActivityListShortDTO(
                    activityList.getId(),
                    activityList.getName(),
                    activityList.getActivityEntries().size(),
                    authorDTO,
                    activityList.getHidden(), isShared);
        }
        return null;
    }

    /**
     * Gets information about the activity list with specified id
     * 
     * @param token the users jwt token
     * @param id    list id
     * @return ActivityListDTO object
     */
    @Override
    public ActivityListDTO getActivityListDetails(Long id, String token) {
        DecodedJWT jwt;
        try {
            jwt = jwtUtil.validateToken(token);
        } catch (Exception e) {
            throw new UnauthorizedAccessException("Invalid token");
        }

        Long userIdL = jwt.getClaim("userId").asLong();
        String role = jwt.getClaim("role").asString();
        Optional<ActivityList> listOpt = activityListRepository.findById(id);
        if (!role.equals(ROLE_ADMIN)) {
            listOpt = activityListRepository.findByIdAndUserId(id, userIdL);
            if (listOpt.isEmpty()) {
                throw new ForbiddenException("User does not have permissions to read list");
            }
        } else {

            if (listOpt.isEmpty()) {
                return null;
            }
        }

        ActivityList list = listOpt.get();
        return new ActivityListDTO(list, userShortRepository);
    }

    /**
     * Adds a mew ActivityList to the database
     * 
     * @param token     the users jwt token
     * @param listToAdd the list to be added
     * @return the id of the newly created ActivityList
     */
    @Override
    public Long addActivityList(ActivityListRequest listToAdd, String token) {
        DecodedJWT jwt;
        Long userIdL;

        try {
            jwt = jwtUtil.validateToken(token);
            userIdL = jwt.getClaim("userId").asLong();
        } catch (Exception e) {
            throw new UnauthorizedAccessException("Invalid token");
        }

        if (listToAdd.hasNullFields() || listToAdd.getName().isEmpty()) {
            throw new BadRequestException("List has null fields or name is empty");
        }

        List<ActivityList> results = activityListRepository.findAllByName(listToAdd.getName());
        if (results != null) {
            for (ActivityList list : results) {
                if (list.getAuthor().equals(userIdL)) {
                    throw new ConflictException("List with the same name exists for the user");
                }
            }
        }

        ActivityList newList = new ActivityList(userIdL, listToAdd.getName(), listToAdd.getDesc(),
                listToAdd.getHidden(), LocalDate.now());

        newList = activityListRepository.save(newList);

        for (ActivityListRequest.ActivityRequest activity : listToAdd.getActivities()) {
            if (activity.getType().equals("exercise")) {
                newList.addExercise(activity.getId(), activity.getDuration());
            } else {
                newList.addTechnique(activity.getId());
            }
        }

        List<UserShort> usersList = userShortRepository.findAllById(listToAdd.getUsers());
        Set<UserShort> usersToAdd = new HashSet<>(usersList);
        newList.setUsers(usersToAdd);

        newList = activityListRepository.save(newList);

        return newList.getId();
    }

    /**
     * Deletes an ActivityList
     * 
     * @param token the users jwt token
     * @param id    of the ActivityList to be deleted
     */
    @Override
    public void removeActivityList(Long id, String token) {
        DecodedJWT jwt;
        Long userIdL;
        String userRole;

        try {
            jwt = jwtUtil.validateToken(token);
            userIdL = jwt.getClaim("userId").asLong();
            userRole = jwt.getClaim("role").asString();
        } catch (JWTVerificationException e) {
            throw new UnauthorizedAccessException("Invalid token");
        }

        ActivityList activityList = activityListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ActivityList not found"));

        if (!activityList.getAuthor().equals(userIdL) && !ROLE_ADMIN.equals(userRole)) {
            throw new ForbiddenException("User does not have permission to delete this list");
        }
        activityListRepository.delete(activityList);
    }

    /**
     * Gets all the ActivityLists the user has access to.
     * 
     * @param token the users jwt token
     * @return a list of ActivityLists
     */
    @Override
    public List<ActivityListShortDTO> getUserActivityLists(String token) {
        DecodedJWT jwt;
        Long userId;
        try {
            jwt = jwtUtil.validateToken(token);
            userId = jwt.getClaim("userId").asLong();
        } catch (Exception e) {
            throw new UnauthorizedAccessException("Invalid token");
        }

        List<ActivityList> results = activityListRepository.findAllByAuthor(userId);
        if (results.isEmpty()) {
            return Collections.emptyList();
        }
        return results.stream()
                .map(activityList -> convertToActivityListShortDTO(activityList, userId))
                .collect(Collectors.toList());

    }

    /**
     * Gets all ActivityLists based on hidden, isAuthor
     * 
     * @param token    the suers jwt token
     * @param hidden   the visabilty of the list
     * @param isAuthor if the user is author or not
     * 
     * @return A list of ActivityLists in a compact format
     */
    @Override
    public List<ActivityListShortDTO> getAllActivityLists(Boolean hidden, Boolean isAuthor, String token) {
        DecodedJWT jwt;
        try {
            jwt = jwtUtil.validateToken(token);
        } catch (Exception e) {
            throw new UnauthorizedAccessException("Invalid token");
        }
        Long userId = jwt.getClaim("userId").asLong();
        String userRole = jwt.getClaim("role").asString();
        Boolean isAdmin = ROLE_ADMIN.equals(userRole);

        List<ActivityList> activityLists;

        activityLists = (Boolean.TRUE.equals(isAdmin)) ? activityListRepository.findAll()
                : activityListRepository.findAllByUserIdOrPublic(userId);

        if (hidden != null) {
            activityLists = activityLists.stream()
                    .filter(a -> hidden.equals(a.getHidden()))
                    .collect(Collectors.toList());
        }
        if (isAuthor != null) {
            if (isAuthor) {
                activityLists = activityLists.stream()
                        .filter(a -> userId.equals(a.getAuthor()))
                        .collect(Collectors.toList());
            } else {
                activityLists = activityLists.stream()
                        .filter(a -> !userId.equals(a.getAuthor()) &&
                                a.getUsers().stream().anyMatch(u -> userId.equals(u.getUser_id())))
                        .collect(Collectors.toList());
            }
        }

        if (activityLists.isEmpty()) {

            return Collections.emptyList();
        }
        return activityLists.stream().map(activityList ->

        convertToActivityListShortDTO(activityList, userId))
                .collect(Collectors.toList());

    }

    /**
     * Updated an existing ActivityList in the database
     * 
     * @param token        the users jwt token
     * @param listToUpdate data about the list to be updated
     * @return the id of the updated list
     */
    @Override
    public Long editActivityList(ActivityListRequest listToUpdate, String token) {
        DecodedJWT jwt;
        try {
            jwt = jwtUtil.validateToken(token);
        } catch (Exception e) {
            throw new UnauthorizedAccessException("Invalid token");
        }

        Long userIdL = jwt.getClaim("userId").asLong();
        String userRole = jwt.getClaim("role").asString();

        Optional<ActivityList> listOpt = activityListRepository.findById(listToUpdate.getId());
        if (listOpt.isEmpty()) {
            throw new ResourceNotFoundException("Activity list not found");
        }

        ActivityList list = listOpt.get();
        if (list.getAuthor() != userIdL && !userRole.equals(ROLE_ADMIN)) {
            throw new ForbiddenException("You do not have permissions to edit this activity list");
        }

        if (listToUpdate.getName() != null) {
            list.setName(listToUpdate.getName());
        }
        if (listToUpdate.getDesc() != null) {
            list.setDesc(listToUpdate.getDesc());
        }
        list.setHidden(listToUpdate.getHidden());

        List<UserShort> usersList = userShortRepository.findAllById(listToUpdate.getUsers());
        Set<UserShort> usersToAdd = new HashSet<>(usersList);
        list.setUsers(usersToAdd);

        for (ActivityListRequest.ActivityRequest activity : listToUpdate.getActivities()) {
            String type = activity.getType();
            if (type.equals("exercise")) {
                list.addExercise(activity.getId(), activity.getDuration());
            } else if (type.equals("technique")) {
                list.addTechnique(activity.getId());
            } else {
                throw new IllegalArgumentException("Invalid activity type");
            }
        }

        ActivityList updatedList = activityListRepository.save(list);
        return updatedList.getId();
    }

}
