package se.umu.cs.pvt.search;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import se.umu.cs.pvt.search.builders.SearchPlanDBBuilder;
import se.umu.cs.pvt.search.params.SearchPlanParams;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * Test class for SearchPlanDBBuilder
 *
 * @author Kraken
 * date: 2023-05-17
 */

public class PlanDBBuilderTest {

    private SearchPlanParams params;

    private SearchPlanDBBuilder builder;

    @BeforeEach
    void init() {
        Map<String, String> map = new HashMap<>();
        map.put("id","testID");
        map.put("from","2010-10-20");
        map.put("to","2011-01-14");
        map.put("previousSessions","true");
        map.put("plans","plan1,plan2,plan3");
        params = new SearchPlanParams(map);

        builder = new SearchPlanDBBuilder(params);
    }

    @Test
    void isNotNull() {
        assertThat(builder).isNotNull();
    }

    @Test
    void testAllDefaultParams() {
        params = new SearchPlanParams(new HashMap<>());
        builder = new SearchPlanDBBuilder(params);

        String expected = "SELECT plan.plan_id FROM plan";
        expected = createJoinBeltsAndSessionsQuery(expected);

        assertThat(builder
                .filterByPlans()
                .filterById()
                .build()
                .getQuery()
        ).isEqualTo(expected);
    }

    @Test
    void testFilterByThreePlans() {
        String expected = "SELECT plan_id FROM plan WHERE plan_id=plan1"
                + " INTERSECT "
                + "SELECT plan_id FROM plan WHERE plan_id=plan2"
                + " INTERSECT "
                + "SELECT plan_id FROM plan WHERE plan_id=plan3";
        expected = createJoinBeltsAndSessionsQuery(expected);

        assertThat(builder
                .filterByPlans()
                .build()
                .getQuery()
        ).isEqualTo(expected);
    }

    @Test
    void testFilterById() {
        String expected = "SELECT p.plan_id FROM plan AS p "
                + "JOIN user_to_plan AS utp ON utp.plan_id=p.plan_id "
                + "AND utp.user_id=" + params.getId();
        expected = createJoinBeltsAndSessionsQuery(expected);

        assertThat(builder
                .filterById()
                .build()
                .getQuery()
        ).isEqualTo(expected);
    }

    private String createJoinBeltsAndSessionsQuery(String query){

        String resultQuery = query;

        String stringQuery = "SELECT result.plan_id, b.belt_color, b.belt_name, b.is_child, "
                + "s.session_id, s.date, s.time, s.text FROM ( "
                + resultQuery
                + " ) AS result "
                + "LEFT JOIN plan_to_belt AS ptb ON ptb.plan_id=result.plan_id "
                + "LEFT JOIN belt AS b ON ptb.belt_id=b.belt_id "
                + "LEFT JOIN session AS s ON s.plan_id=result.plan_id ";

        if(params.hasTo()) stringQuery += "AND s.date <='" + params.getTo() + "'";

        // If the user wants to get previous sessions we skip this query.
        if(params.hasFrom()
                && (!params.hasPreviousSessions()
                || !params.getPreviousSessions())) stringQuery += "AND s.date>='" + params.getFrom() + "' ";

        return stringQuery;
    }
}
