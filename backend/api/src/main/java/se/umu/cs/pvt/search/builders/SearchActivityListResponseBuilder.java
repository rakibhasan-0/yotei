package se.umu.cs.pvt.search.builders;

import java.util.ArrayList;
import java.util.List;

import se.umu.cs.pvt.search.interfaces.ActivityListDBResult;
import se.umu.cs.pvt.search.interfaces.responses.ActivityListSearchResponse;

/**
 * This class builds a list of {@link ActivityListSearchResponse ActivityListSearchResponses}
 * based on the given list of {@link ActivityListDBResult ActivityListDBResults}.
 * 
 * @author Team Tomato
 * @since 2024-05-20
 */
public class SearchActivityListResponseBuilder {
    private List<ActivityListDBResult> activityListDBResultList;

    public SearchActivityListResponseBuilder(List<ActivityListDBResult> activityListDBResultList){
        this.activityListDBResultList = activityListDBResultList;
    } 

    public List<ActivityListSearchResponse> build(){
        List<ActivityListSearchResponse> response = new ArrayList<>();
        activityListDBResultList.forEach(result -> response.add(
            new ActivityListSearchResponse(
                result.getId(),result.getAuthor(), result.getName(), result.getHidden(), result.getDate())
        ));
        return response;
    }
    
}
