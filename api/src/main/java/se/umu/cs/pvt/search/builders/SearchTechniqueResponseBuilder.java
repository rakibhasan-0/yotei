package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.interfaces.TechniqueDBResult;
import se.umu.cs.pvt.search.interfaces.TechniqueSearchResponse;
import se.umu.cs.pvt.search.interfaces.WorkoutDBResult;
import se.umu.cs.pvt.search.interfaces.WorkoutSearchResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * This class builds a list of {@link TechniqueSearchResponse TechniqueSearchResponses}
 * based on the given list of {@link TechniqueDBResult TechniqueDBResults}.
 */
public class SearchTechniqueResponseBuilder {
    private List<TechniqueDBResult> techniqueDBResultList;

    public SearchTechniqueResponseBuilder(List<TechniqueDBResult> techniqueDBResultList){
        this.techniqueDBResultList = techniqueDBResultList;
    }

    /**
     * Builds a list of {@link TechniqueSearchResponse TechniqueSearchResponses}.
     *
     * @return The created list of TechniqueSearchResponses.
     */
    public List<TechniqueSearchResponse> build(){
        HashMap<Long, TechniqueSearchResponse> map = new HashMap<>();

        techniqueDBResultList.forEach(result -> {
            Long techniqueID = result.getId();

            if(map.containsKey(techniqueID)){
                map.get(techniqueID).addBeltColor(result.getBelt_color());
            } else {
                map.put(techniqueID, new TechniqueSearchResponse(
                        result.getId(),
                        result.getName(),
                        result.getBelt_color()
                ));
            }
        });
        return new ArrayList<>(map.values());
    }
}
