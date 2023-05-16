package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.DatabaseQuery;
import se.umu.cs.pvt.search.SearchUserParams;
import se.umu.cs.pvt.search.interfaces.SearchDBBuilderInterface;

import java.util.ArrayList;
import java.util.List;

/**
 * This class builds a {@link DatabaseQuery DatabaseQuery} based on
 * the filtering methods used.
 * 
 * @author Chimera (Ludvig Larsson)
 */
public class SearchUserDBBuilder implements SearchDBBuilderInterface {
    private SearchUserParams searchUserParams;
    private List<DatabaseQuery> queries;

    public SearchUserDBBuilder(SearchUserParams searchUserParams) {
        this.searchUserParams = searchUserParams;
        queries = new ArrayList<>();
    }

    public SearchUserDBBuilder filterById() {
        if(searchUserParams.hasId()){
            String id = searchUserParams.getId();

            DatabaseQuery createdQuery = new DatabaseQuery();
            createdQuery.setQuery(
                    "SELECT u.user_id, u.username, u.user_role " +
                    "FROM user_table AS u WHERE u.user_id='" + id + "'"
            );
            queries.add(createdQuery);
        }

        return this;
    }

    public SearchUserDBBuilder filterByRole() {
        if(searchUserParams.hasRole()){
            String role = searchUserParams.getRole();

            DatabaseQuery createdQuery = new DatabaseQuery();
            createdQuery.setQuery(
                    "SELECT u.user_id, u.username, u.user_role " +
                    "FROM user_table AS u WHERE u.user_role='" + role + "'"
            );
            queries.add(createdQuery);
        }

        return this;
    }

    public DatabaseQuery build() {
        DatabaseQuery databaseQuery = new DatabaseQuery();
        if (queries.isEmpty()) {
            databaseQuery.setQuery(
                    "SELECT u.user_id, u.username, u.user_role " +
                    "FROM user_table AS u"
            );
        } else {
            List<String> queryList = new ArrayList<>();

            for (DatabaseQuery query: queries) {
                queryList.add(query.getQuery());
            }

            databaseQuery.setQuery(String.join(" INTERSECT ", queryList));
        }

        return databaseQuery;
    }
}
