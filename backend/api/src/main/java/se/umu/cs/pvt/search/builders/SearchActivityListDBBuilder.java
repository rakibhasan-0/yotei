package se.umu.cs.pvt.search.builders;

import static org.mockito.ArgumentMatchers.intThat;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.auth0.jwt.interfaces.DecodedJWT;

import se.umu.cs.pvt.search.DatabaseQuery;
import se.umu.cs.pvt.search.params.SearchActivityListParams;
import se.umu.cs.pvt.user.JWTUtil;

/**
 * This class builds a {@link DatabaseQuery DatabaseQuery} based on
 * the filtering methods used.
 *
 * @author Team Tomato
 * @date 2024-05-20
 */
public class SearchActivityListDBBuilder {
	private String token;
    private SearchActivityListParams searchActivityListParams;
    private final List<DatabaseQuery> queries = new ArrayList<>();

    private DecodedJWT jwt;
    private Long userIdL;

    @Autowired
    private JWTUtil jwtUtil;

    public SearchActivityListDBBuilder(SearchActivityListParams searchActivityListParams, String token){
        this.token = token;
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
            try {
                jwt = jwtUtil.validateToken(token);
                userIdL = jwt.getClaim("userId").asLong();
            } catch (Exception e) {
                System.err.println("Failed to authenticate user:" + e.getMessage());
            }
            createdQuery.setQuery(
                "SELECT al.name, al.id, al.author, al.private, al.created_date " +
                "FROM activity_list AS al " +
                "WHERE al.author = " + userIdL
            );
            queries.add(createdQuery);
        }
        return this;
    }

    public SearchActivityListDBBuilder filterByIsShared() {
        if(searchActivityListParams.getIsShared()){
            DatabaseQuery createdQuery = new DatabaseQuery();
            try {
                jwt = jwtUtil.validateToken(token);
                userIdL = jwt.getClaim("userId").asLong();
            } catch (Exception e) {
                System.err.println("Failed to authenticate user:" + e.getMessage());
            }
            createdQuery.setQuery(
                "SELECT al.name, al.id, al.author, al.private, al.created_Date " +
                "FROM activity_list AS al, user_to_activity_list AS utal " +
                "WHERE al.id = utal.list_id AND utal.user_id = " + userIdL
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
