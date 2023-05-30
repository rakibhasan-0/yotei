package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.DatabaseQuery;
import se.umu.cs.pvt.search.interfaces.SearchDBBuilderInterface;
import se.umu.cs.pvt.search.params.SearchExerciseParams;

import java.util.ArrayList;
import java.util.List;

/**
 * This class builds a {@link DatabaseQuery DatabaseQuery} based on
 * the filtering methods used.
 *
 * @author Minotaur (James Eriksson)
 * 
 */
public class SearchExerciseDBBuilder implements SearchDBBuilderInterface {
    private final SearchExerciseParams searchExerciseQuery;
    private final List<DatabaseQuery> queries = new ArrayList<>();

    public SearchExerciseDBBuilder(SearchExerciseParams searchExerciseQuery){
        this.searchExerciseQuery = searchExerciseQuery;
    }

    /**
     * Adds a query to the DatabaseQuery list to filter Exercises with tags.
     *
     * @return Returns itself.
     */
    public SearchExerciseDBBuilder filterByTags() {
        if(searchExerciseQuery.hasTags()){
            List<String> tags = searchExerciseQuery.getTags();
            for (String tag: tags) {
                DatabaseQuery databaseQuery = new DatabaseQuery();
                databaseQuery.setQuery(
                        "SELECT e.name, e.exercise_id, e.duration " +
                        "FROM exercise AS e, exercise_tag AS et, tag AS t " +
                        "WHERE et.ex_id = e.exercise_id AND et.tag_id = t.tag_id AND LOWER(t.name)=LOWER('" + tag + "')"
                );
                queries.add(databaseQuery);
            }
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
                    "SELECT name, exercise_id, duration FROM exercise"
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
