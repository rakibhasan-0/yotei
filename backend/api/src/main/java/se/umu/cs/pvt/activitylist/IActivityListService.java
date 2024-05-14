package se.umu.cs.pvt.activitylist;

import java.util.List;

import com.auth0.jwt.interfaces.DecodedJWT;

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

    ActivityListDTO getDetails(DecodedJWT token, Long id);
}
