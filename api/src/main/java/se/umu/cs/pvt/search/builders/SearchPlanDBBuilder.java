package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.DatabaseQuery;
import se.umu.cs.pvt.search.SearchPlanParams;
import se.umu.cs.pvt.search.interfaces.SearchDBBuilderInterface;

import java.util.ArrayList;
import java.util.List;

/**
 * This class builds a {@link DatabaseQuery DatabaseQuery} based on
 * the filtering methods used.
 *
 * @author Minotaur (James Eriksson)
 */
public class SearchPlanDBBuilder implements SearchDBBuilderInterface {
    private SearchPlanParams searchPlanParams;
    private List<DatabaseQuery> queries = new ArrayList<>();

    public SearchPlanDBBuilder(SearchPlanParams searchPlanParams){
        this.searchPlanParams = searchPlanParams;
    }

    /**
     * Adds a query to the DatabaseQuery list to filter Plans based on ids.
     *
     * @return Returns itself.
     */
    public SearchPlanDBBuilder filterByPlans(){
        if(searchPlanParams.hasPlans()){
            for(String plan : searchPlanParams.getPlans()){
                DatabaseQuery createdQuery = new DatabaseQuery();
                createdQuery.setQuery(
                        "SELECT plan_id FROM plan WHERE plan_id=" + plan
                );
                queries.add(createdQuery);
            }
        }

        return this;
    }

    /**
     * Adds a query to the DatabaseQuery list to filter Plans from a certain user.
     *
     * @return Returns itself.
     */
    public SearchPlanDBBuilder filterById(){
        if(searchPlanParams.hasId()){
            DatabaseQuery createdQuery = new DatabaseQuery();
            createdQuery.setQuery(
                    "SELECT p.plan_id FROM plan AS p " +
                    "JOIN user_to_plan AS utp ON utp.plan_id=p.plan_id " +
                    "AND utp.user_id=" + searchPlanParams.getId()
            );
            queries.add(createdQuery);
        }

        return this;
    }

    /**
     * Bundles all the queries together and returns a {@link DatabaseQuery DatabaseQuery}.
     *
     * @return A created DatabaseQuery.
     */
    public DatabaseQuery build() {
        DatabaseQuery databaseQuery = new DatabaseQuery();

        if(queries.isEmpty()) {
            databaseQuery.setQuery(
                    "SELECT plan.plan_id FROM plan"
            );
        } else {
            List<String> queryList = new ArrayList<>();

            for(DatabaseQuery dbq : queries) {
                queryList.add(dbq.getQuery());
            }

            databaseQuery.setQuery(
                    String.join(" INTERSECT ", queryList)
            );
        }

        return createJoinBeltsAndSessionsQuery(databaseQuery);
    }

    /**
     * This method concatenates a given query to join
     * it with the belt table and also the session table.
     *
     * @param databaseQuery The query being joined.
     * @return A new query joined with the given query.
     */
    private DatabaseQuery createJoinBeltsAndSessionsQuery(DatabaseQuery databaseQuery){
        // TODO: This method is very messy, consider refactoring when possible

        String resultQuery = databaseQuery.getQuery();

        String stringQuery = "";
        stringQuery += "SELECT result.plan_id, b.belt_color, b.belt_name, b.is_child, ";
        stringQuery += "s.session_id, s.date, s.time, s.text FROM ( ";
        stringQuery += resultQuery + " ";
        stringQuery += ") AS result ";
        stringQuery += "LEFT JOIN plan_to_belt AS ptb ON ptb.plan_id=result.plan_id ";
        stringQuery += "LEFT JOIN belt AS b ON ptb.belt_id=b.belt_id ";
        stringQuery += "LEFT JOIN session AS s ON s.plan_id=result.plan_id ";

        if(searchPlanParams.hasTo()) stringQuery += "AND s.date <='" + searchPlanParams.getTo() + "'";

        // If the user wants to get previous sessions we skip this query.
        if(searchPlanParams.hasFrom()
                && (!searchPlanParams.hasPreviousSessions()
                || !searchPlanParams.getPreviousSessions())) stringQuery += "AND s.date>='" + searchPlanParams.getFrom() + "' ";

        DatabaseQuery createdDatabaseQuery = new DatabaseQuery();
        createdDatabaseQuery.setQuery(stringQuery);

        return createdDatabaseQuery;
    }
}
