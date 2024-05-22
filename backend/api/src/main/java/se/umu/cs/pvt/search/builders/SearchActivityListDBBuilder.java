package se.umu.cs.pvt.search.builders;

import java.util.ArrayList;
import java.util.List;

import se.umu.cs.pvt.search.DatabaseQuery;
import se.umu.cs.pvt.search.params.SearchActivityListParams;

/**
 * This class builds a {@link DatabaseQuery DatabaseQuery} based on
 * the filtering methods used.
 *
 * @author Team Tomato, updated 2024-05-22 
 * @date 2024-05-20
 */
public class SearchActivityListDBBuilder {
    private SearchActivityListParams searchActivityListParams;
    private final List<DatabaseQuery> queries = new ArrayList<>();

    private Long userId;

    public SearchActivityListDBBuilder(SearchActivityListParams searchActivityListParams, Long userId){
        this.userId = userId;
        this.searchActivityListParams = searchActivityListParams;
    }

    public SearchActivityListDBBuilder filterByHidden() {
        if(searchActivityListParams.getHidden()){
            DatabaseQuery createdQuery = new DatabaseQuery();
            createdQuery.setQuery(
                "SELECT al.name, al.id, al.author, al.private, al.created_date " +
                "FROM activity_list AS al " + 
                "WHERE al.private = false"
            );
            queries.add(createdQuery);
        }
        return this;
    }

    public SearchActivityListDBBuilder filterByIsAuthor() {
        if(searchActivityListParams.getIsAuthor()){
            DatabaseQuery createdQuery = new DatabaseQuery();
            createdQuery.setQuery(
                "SELECT al.name, al.id, al.author, al.private, al.created_date " +
                "FROM activity_list AS al " +
                "WHERE al.author = " + userId
            );
            queries.add(createdQuery);
        }
        return this;
    }

    public SearchActivityListDBBuilder filterByIsShared() {
        if(searchActivityListParams.getIsShared()){
            DatabaseQuery createdQuery = new DatabaseQuery();
            createdQuery.setQuery(
                "SELECT al.name, al.id, al.author, al.private, al.created_Date " +
                "FROM activity_list AS al, user_to_activity_list AS utal " +
                "WHERE al.id = utal.list_id AND utal.user_id = " + userId
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
                    "SELECT DISTINCT al.name, al.id, al.author, al.private, al.created_date " + 
                    "FROM activity_list AS al, user_to_activity_list AS utal " +
                    "WHERE (al.id = utal.list_id AND utal.user_id = " + userId + ")" +
                    "OR (al.author = " + userId + ")" +
                    "OR (al.private = false)"
            );
        } else {
            List<String> queryList = new ArrayList<>();

            for(DatabaseQuery dbq : queries) {
                queryList.add(dbq.getQuery());
            }

            databaseQuery.setQuery(
                    String.join(" UNION ", queryList)
            );
        }
        return databaseQuery;
    }
	
}
