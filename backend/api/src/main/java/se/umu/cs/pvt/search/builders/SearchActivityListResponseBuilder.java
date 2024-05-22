package se.umu.cs.pvt.search.builders;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import se.umu.cs.pvt.activitylist.Dtos.UserShortDTO;
import se.umu.cs.pvt.search.interfaces.ActivityListDBResult;
import se.umu.cs.pvt.search.interfaces.responses.ActivityListSearchResponse;
import se.umu.cs.pvt.workout.UserShort;
import se.umu.cs.pvt.workout.UserShortRepository;

/**
 * This class builds a list of {@link ActivityListSearchResponse ActivityListSearchResponses}
 * based on the given list of {@link ActivityListDBResult ActivityListDBResults}.
 * 
 * @author Team Tomato
 * @since 2024-05-20
 */
public class SearchActivityListResponseBuilder {
    private List<ActivityListDBResult> activityListDBResultList;
    private final UserShortRepository userShortRepository;

    public SearchActivityListResponseBuilder(List<ActivityListDBResult> activityListDBResultList, UserShortRepository userShortRepository){
        this.activityListDBResultList = activityListDBResultList;
        this.userShortRepository = userShortRepository;
    } 


    public List<ActivityListSearchResponse> build() {
    List<ActivityListSearchResponse> response = new ArrayList<>();
    activityListDBResultList.forEach(result -> {
        Optional<UserShort> userShort = userShortRepository.findById(result.getAuthor());
        UserShortDTO authorDTO = userShort.isPresent() ? new UserShortDTO(userShort.get()) : null;
        response.add(new ActivityListSearchResponse(
            result.getId(), authorDTO, result.getName(), result.getHidden(), result.getDate()
        ));
    });
    return response;
}

    
}
