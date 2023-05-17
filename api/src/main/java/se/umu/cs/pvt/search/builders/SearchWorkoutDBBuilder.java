package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.DatabaseQuery;
import se.umu.cs.pvt.search.SearchWorkoutParams;
import se.umu.cs.pvt.search.interfaces.SearchDBBuilderInterface;

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

    public SearchWorkoutDBBuilder filterByFavourite() {
        if(searchWorkoutParams.isFavourite() && searchWorkoutParams.hasUser_id()){
            String user_id = searchWorkoutParams.getUser_id();

            DatabaseQuery createdQuery = new DatabaseQuery();
            createdQuery.setQuery(
                    "SELECT w.workout_name, w.workout_id " +
                    "FROM workout AS w, workout_favorite AS wf " +
                    "WHERE w.workout_id=wf.workout_id AND wf.user_id='" + user_id + "'"
            );
            queries.add(createdQuery);
        }

        return this;
    }

    public SearchWorkoutDBBuilder filterByUserId() {
        if(searchWorkoutParams.hasUser_id()){
            String user_id = searchWorkoutParams.getUser_id();

            DatabaseQuery createdQuery = new DatabaseQuery();
            createdQuery.setQuery(
                    "SELECT w.workout_name, w.workout_id " +
                    "FROM workout AS w WHERE w.workout_author=" + user_id
            );
            queries.add(createdQuery);
        }

        return this;
    }

    public SearchWorkoutDBBuilder filterByTags() {
        if(searchWorkoutParams.hasTags()){
            List<String> tags = searchWorkoutParams.getTags();
            for (String tag: tags) {
                DatabaseQuery databaseQuery = new DatabaseQuery();
                databaseQuery.setQuery(
                        "SELECT w.workout_name, w.workout_id " +
                        "FROM workout AS w, workout_tag AS wt, tag AS t " +
                        "WHERE wt.work_id=w.workout_id AND wt.tag_id=t.tag_id AND LOWER(t.name)=LOWER('" + tag + "')"
                );
                queries.add(databaseQuery);
            }
        }

        return this;
    }

    /**
     * Adds a query to the DatabaseQuery list to filter Workouts by date.
     *
     * @return Returns itself.
     */
    public SearchWorkoutDBBuilder filterByDate() {
        if(searchWorkoutParams.hasFrom()){
            String from = searchWorkoutParams.getFrom().toString();
            DatabaseQuery fromQuery = new DatabaseQuery();
            fromQuery.setQuery(
                    "SELECT workout_name, workout_id FROM workout WHERE workout_date>='" + from + "'"
            );
            queries.add(fromQuery);
        }

        if(searchWorkoutParams.hasTo()){
            String to = searchWorkoutParams.getTo().toString();
            DatabaseQuery toQuery = new DatabaseQuery();
            toQuery.setQuery(
                    "SELECT workout_name, workout_id FROM workout WHERE workout_date<='" + to + "'"
            );
            queries.add(toQuery);
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

        return createJoinFavoriteQuery(databaseQuery);
    }

    private DatabaseQuery createJoinFavoriteQuery(DatabaseQuery databaseQuery){
        String stringQuery;
        String resultQuery = databaseQuery.getQuery();

        if(searchWorkoutParams.hasUser_id()){
            String user_id = searchWorkoutParams.getUser_id();

            stringQuery = "SELECT result.workout_name, result.workout_id, wf.user_id IS NOT NULL AS favourite FROM ( " +
                    resultQuery + " " +
                    ") AS result " +
                    "LEFT JOIN workout_favorite AS wf " +
                    "ON wf.workout_id=result.workout_id AND " + "wf.user_id=" + user_id;
        } else {
            // If no user_id was given we can't join with the workout_favorite table
            stringQuery = "SELECT result.workout_name, result.workout_id, 1=2 AS favourite FROM ( " +
                    resultQuery + " " +
                    ") AS result";
        }

        DatabaseQuery createdDatabaseQuery = new DatabaseQuery();
        createdDatabaseQuery.setQuery(stringQuery);

        return createdDatabaseQuery;
    }
}
