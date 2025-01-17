package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.interfaces.TechniqueDBResult;
import se.umu.cs.pvt.search.interfaces.responses.TechniqueSearchResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * This class builds a list of {@link TechniqueSearchResponse TechniqueSearchResponses}
 * based on the given list of {@link TechniqueDBResult TechniqueDBResults}.
 * 
 * @author Minotaur (James Eriksson)
 * @updated 2024-05-20 Team Kiwi (Teodor Bäckström)
 * Added inverted belt category
 *  
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
        HashMap<Long, Integer> map = new HashMap<>();
		ArrayList<TechniqueSearchResponse> resultList = new ArrayList<>();

        techniqueDBResultList.forEach(result -> {
            Long techniqueID = result.getId();

            if(map.containsKey(techniqueID)){
                resultList.get(map.get(techniqueID)).addBeltColor(
                        result.getBelt_color(), result.getBelt_name(), result.getIs_child(), result.getIs_inverted()
                );
            } else {
				int index = resultList.size();
				map.put(techniqueID, index);
                resultList.add(index, new TechniqueSearchResponse(
                        result.getId(),
                        result.getName(),
                        result.getBelt_color(),
                        result.getBelt_name(),
                        result.getIs_child(),
                        result.getIs_inverted()
                ));
            }
        });

        return resultList;
    }
}