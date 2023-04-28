package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.DatabaseQuery;
import se.umu.cs.pvt.search.SearchWorkoutParams;
import se.umu.cs.pvt.search.interfaces.SearchDBBuilderInterface;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * This class builds a {@link DatabaseQuery DatabaseQuery} based on
 * the filtering methods used.
 *
 * @author Minotaur (James Eriksson)
 */
public class SearchWorkoutDBBuilder implements SearchDBBuilderInterface {
    private SearchWorkoutParams searchWorkoutParams;
    private List<DatabaseQuery> queries;

    public SearchWorkoutDBBuilder(SearchWorkoutParams searchWorkoutParams) {
        this.searchWorkoutParams = searchWorkoutParams;
        queries = new ArrayList<>();
    }

    /**
     * Adds a query to the DatabaseQuery list to filter Workouts by date.
     *
     * @return Returns itself.
     */
    public SearchWorkoutDBBuilder filterByDate() {
        if(!searchWorkoutParams.hasDate()) return this;

        LocalDate date = searchWorkoutParams.getDate();

        DatabaseQuery databaseQuery = new DatabaseQuery();
        databaseQuery.setQuery("SELECT workout_name, workout_id FROM workout WHERE workout_created='" + date + "'");
        queries.add(databaseQuery);

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
                    "SELECT workout_name, workout_id FROM workout"
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

        return databaseQuery;
    }
}
