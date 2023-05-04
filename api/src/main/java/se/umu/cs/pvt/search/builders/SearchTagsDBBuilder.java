package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.DatabaseQuery;
import se.umu.cs.pvt.search.SearchTagsParams;
import se.umu.cs.pvt.search.interfaces.SearchDBBuilderInterface;

import java.util.ArrayList;
import java.util.List;

/**
 * This class builds a {@link DatabaseQuery DatabaseQuery} based on
 * the filtering methods used.
 *
 * @author Kraken (Jonas Gustavsson) 2023-05-04
 */


public class SearchTagsDBBuilder implements SearchDBBuilderInterface {
    private SearchTagsParams params;
    private final List<DatabaseQuery> queries = new ArrayList<>();

    public SearchTagsDBBuilder(SearchTagsParams searchTagsParams) {
        params = searchTagsParams;
    }

    /**
     * Adds a query to the DatabaseQuery list to filter Exercises with tags.
     *
     * @return Returns itself.
     */
    public SearchTagsDBBuilder filterByTags() {
        if(params.hasTags()) {

            // Make List of tags into a string, so it can be used in SQL Query.
            String tagsString = "";
            Boolean firstIteration = true;
            for (String tag : params.getTags()) {
                if (firstIteration) {
                    tagsString = tagsString.concat("('" + tag + "'");
                    firstIteration = false;
                    continue;
                }
                tagsString = tagsString.concat("," + "'" + tag + "'");
            }
            tagsString = tagsString.concat(")");


            DatabaseQuery databaseQuery = new DatabaseQuery();
            databaseQuery.setQuery("SELECT name, tag_id FROM tag WHERE tag.name NOT IN "+ tagsString);
            queries.add(databaseQuery);
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
                    "SELECT tag_id, name FROM tag"
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
