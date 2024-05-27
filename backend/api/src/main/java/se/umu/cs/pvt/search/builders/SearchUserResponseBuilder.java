package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.interfaces.UserDBResult;
import se.umu.cs.pvt.search.interfaces.responses.UserSearchResponse;

import java.util.ArrayList;
import java.util.List;

/**
 * This class builds a list of {@link UserSearchResponse UserSearchResponses}
 * based on the given list of {@link UserDBResult UserDBResults}.
 * 
 * @author Chimera (Ludvig Larsson)
 * 
 */
public class SearchUserResponseBuilder {
    private List<UserDBResult> userDBResultList;

    public SearchUserResponseBuilder(List<UserDBResult> userDBResultList){
        this.userDBResultList = userDBResultList;
    }

    /**
     * Builds a list of {@link UserSearchResponse UserSearchReponses}.
     * 
     * @return The created list of UserSearchResponses.
     */
    public List<UserSearchResponse> build(){
        List<UserSearchResponse> array = new ArrayList<>();
        userDBResultList.forEach(result -> array.add(
                new UserSearchResponse(
                        result.getId(),
                        result.getName(),
                        result.getRoleId()
                )
        ));
        return array;
    }
}
