package se.umu.cs.pvt.activitylist;

import java.util.List;

import com.auth0.jwt.interfaces.DecodedJWT;

import se.umu.cs.pvt.activitylist.Dtos.ActivityListDTO;
import se.umu.cs.pvt.activitylist.Dtos.ActivityListShortDTO;

/**
 * Interface for ActivityListService
 * 
 * @author Team Tomato
 * @since 2024-05-08
 * @version 1.0
 */
public interface IActivityListService {
    List<ActivityListShortDTO> getAllAccessibleActivityListsDTO(DecodedJWT token, Boolean hidden,
            Boolean createdByUser);

    ActivityListDTO getActivityListDetails(Long id, String token);

    Long addActivityList(AddActivityListRequest lsitToAdd, String token);

    void removeActivityList(Long id, String token);

    List<ActivityListDTO> getUserActivityLists(String token);

    public List<ActivityListShortDTO> getAllActivityLists(Boolean hidden, Boolean isAuthor, String token);

}
