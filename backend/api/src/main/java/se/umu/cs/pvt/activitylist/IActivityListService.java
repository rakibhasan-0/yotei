package se.umu.cs.pvt.activitylist;

import java.util.List;

import com.auth0.jwt.interfaces.DecodedJWT;

import se.umu.cs.pvt.activitylist.Dtos.ActivityListDTO;
import se.umu.cs.pvt.activitylist.Dtos.ActivityListShortDTO;

/**
 * Interface for ActivityListService
 * 
 * @author Team Tomato, updated 2024-05-16
 * @since 2024-05-08
 * @version 1.0
 */
public interface IActivityListService {

    ActivityListDTO getActivityListDetails(Long id, String token);

    Long addActivityList(ActivityListRequest listToAdd, String token);

    void removeActivityList(Long id, String token);

    List<ActivityListShortDTO> getUserActivityLists(String token);

    List<ActivityListShortDTO> getAllActivityLists(Boolean hidden, Boolean isAuthor, String token);

    Long editActivityList(ActivityListRequest listToUpdate, String token);
}
