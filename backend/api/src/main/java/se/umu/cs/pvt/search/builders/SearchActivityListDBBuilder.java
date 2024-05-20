package se.umu.cs.pvt.search.builders;

import java.util.ArrayList;
import java.util.List;

import se.umu.cs.pvt.search.DatabaseQuery;

/**
 * This class builds a {@link DatabaseQuery DatabaseQuery} based on
 * the filtering methods used.
 *
 * @author Team Tomato
 * @date 2024-05-20
 */
public class SearchActivityListDBBuilder {
	    
    private final List<DatabaseQuery> queries = new ArrayList<>();

    public SearchActivityListDBBuilder(){}

    /**
     * Bundles all the queries together and returns a {@link DatabaseQuery DatabaseQuery}.
     *
     * @return A created DatabaseQuery.
     */
    public DatabaseQuery build() {
        DatabaseQuery databaseQuery = new DatabaseQuery();

        if(queries.isEmpty()) {
            databaseQuery.setQuery(
                    "SELECT name, id, author, private, created_date FROM activity_list"
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
