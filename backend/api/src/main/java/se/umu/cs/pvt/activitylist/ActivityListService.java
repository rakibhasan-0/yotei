package se.umu.cs.pvt.activitylist;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

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
 * @author Team Tomato
 * @since 2024-05-12
 * @version 1.0
 */
@Component
public class ActivityListService implements IActivityListService {
    private final UserShortRepository userShortRepository;
    private final ActivityListRepository activityListRepository;
    private final JWTUtil jwtUtil;

    public ActivityListService(UserShortRepository userShortRepository, ActivityListRepository activityListRepository,
            JWTUtil jwtUtil) {
        this.userShortRepository = userShortRepository;
        this.activityListRepository = activityListRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Fetches all activity lists that the user has access to.
     * 
     * @param token    jwt token of the user sending the request
     * @param hidden   true/false
     * @param isAuthor true/false
     * @return a list of activity lists in a shorter format
     */
    @Override
    public List<ActivityListShortDTO> getAllAccessibleActivityListsDTO(DecodedJWT token, Boolean hidden,
            Boolean isAuthor) {
        List<ActivityList> activityLists = new ArrayList<>();
        Long userId = token.getClaim("userId").asLong();
        String userRole = token.getClaim("role").asString();

        if ("ADMIN".equals(userRole)) {
            if (hidden != null) {
                activityLists = activityListRepository.findAllByHidden(hidden);
            } else {
                activityLists = activityListRepository.findAll();
            }
        } else if (Boolean.TRUE.equals(isAuthor)) {
            if (hidden != null) {
                activityLists = activityListRepository.findAllByAuthorAndHidden(userId, hidden);
            } else {
                activityLists = activityListRepository.findAllByAuthor(userId);
            }
        } else {

            // fetch lists based on visibility only
            if (hidden != null) {
                activityLists = activityListRepository.findAllByUserIdAndHidden(userId, hidden);
            } else {
                activityLists = activityListRepository.findAllByUserId(userId);
            }
        }

        return activityLists.stream().map(activityList -> convertToActivityListShortDTO(activityList))
                .collect(Collectors.toList());
    }

    /**
     * Converts an ActivityList object to an ActivityListShortDTO
     * 
     * @param activityList the list to be converted
     * @return converted object
     */
    private ActivityListShortDTO convertToActivityListShortDTO(ActivityList activityList) {
        UserShort author = userShortRepository.findById(activityList.getAuthor()).orElse(null);
        UserShortDTO authorDTO = (author != null) ? new UserShortDTO(author) : null;
        return new ActivityListShortDTO(
                activityList.getId(),
                activityList.getName(),
                activityList.getActivityEntries().size(),
                authorDTO,
                activityList.getHidden());
    }

    /**
     * Gets information about the activity list with specified id
     * 
     * @param token the users jwt token
     * @param id    list id
     * @return ActivityListDTO object
     */
    @Override
    public ActivityListDTO getDetails(DecodedJWT token, Long id) {
        ActivityList list;
        Optional<ActivityList> listOpt;
        Long userId = token.getClaim("userId").asLong();
        String role = token.getClaim("role").asString();

        if (!role.equals("ADMIN")) {
            listOpt = activityListRepository.findByIdAndUserId(id, userId);
            if (listOpt.isEmpty()) {
                throw new UnauthorizedAccessException("User does not have permissions to read list");
            }

        } else {
            listOpt = activityListRepository.findById(id);
            if (listOpt.isEmpty()) {
                return null;
            }
        }
        list = listOpt.get();

        ActivityListDTO dto = new ActivityListDTO(list);
        return dto;
    }

    @Override
    public Long addActivityList(AddActivityListRequest listToAdd, String token) {
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

        for (AddActivityListRequest.ActivityRequest activity : listToAdd.getActivities()) {
            if (activity.getType().equals("exercise")) {
                newList.addExercise(activity.getId());
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

}
