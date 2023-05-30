package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.interfaces.PlanDBResult;
import se.umu.cs.pvt.search.interfaces.responses.PlanSearchResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * This class builds a list of {@link PlanSearchResponse PlanSearchResponses}
 * based on the given list of {@link PlanDBResult PlanDBResults}.
 *
 * @author Minotaur (James Eriksson)
 */
public class SearchPlanResponseBuilder {
    private List<PlanDBResult> planDBResults;

    public SearchPlanResponseBuilder(List<PlanDBResult> planDBResults){
        this.planDBResults = planDBResults;
    }

    /**
     * Builds a list of {@link PlanSearchResponse PlanSearchResponses}.
     *
     * @return The created list of PlanSearchResponses.
     */
    public List<PlanSearchResponse> build(){
        HashMap<Long, PlanSearchResponse> map = new HashMap<>();

        planDBResults.forEach(result -> {
            Long planID = result.getPlan_id();

            if(map.containsKey(planID)){
                PlanSearchResponse response =  map.get(planID);
                response.addPlanColor(result.getBelt_color(), result.getBelt_name(), result.getIs_child());
                response.addSession(result.getSession_id(), result.getSession_date(), result.getSession_time(), result.getSession_text());
            } else {
                map.put(planID, new PlanSearchResponse(
                        result.getPlan_id(),
                        result.getBelt_color(),
                        result.getBelt_name(),
                        result.getIs_child(),
                        result.getSession_id(),
                        result.getSession_date(),
                        result.getSession_time(),
                        result.getSession_text()
                ));
            }
        });

        return new ArrayList<>(map.values());
    }
}
