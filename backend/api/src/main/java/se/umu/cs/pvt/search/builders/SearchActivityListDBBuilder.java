package se.umu.cs.pvt.search.builders;

import java.util.ArrayList;
import java.util.List;

import se.umu.cs.pvt.search.DatabaseQuery;
import se.umu.cs.pvt.search.params.SearchListParams;


public class SearchActivityListDBBuilder {
	    
	private final SearchListParams searchListQuery;
    private final List<DatabaseQuery> queries = new ArrayList<>();

    public SearchActivityListDBBuilder(SearchListParams searchListQuery){
        this.searchListQuery = searchListQuery;
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
