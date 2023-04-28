package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.DatabaseQuery;
import se.umu.cs.pvt.search.SearchTechniquesParams;
import se.umu.cs.pvt.search.interfaces.SearchDBBuilderInterface;

import java.util.ArrayList;
import java.util.List;

/**
 * This class builds a {@link DatabaseQuery DatabaseQuery} based on
 * the filtering methods used.
 *
 * @author Minotaur (James Eriksson)
 */
public class SearchTechniquesDBBuilder implements SearchDBBuilderInterface {
    private SearchTechniquesParams searchTechniquesParams;
    private List<DatabaseQuery> queries;

    public SearchTechniquesDBBuilder(SearchTechniquesParams searchTechniquesParams){
        this.searchTechniquesParams = searchTechniquesParams;
        queries = new ArrayList<>();
    }

    /**
     * Adds a query to the DatabaseQuery list to filter Techniques by tags.
     *
     * @return Returns itself.
     */
    public SearchTechniquesDBBuilder filterByTags() {
        if(!searchTechniquesParams.hasTags()) return this;

        List<String> tags = searchTechniquesParams.getTags();
        for (String tag: tags) {
            DatabaseQuery databaseQuery = new DatabaseQuery();
            databaseQuery.setQuery(
                    "SELECT te.technique_id, te.name " +
                            "FROM technique AS te, technique_tag AS tt, tag AS ta " +
                            "WHERE tt.tech_id = te.technique_id AND tt.tag_id = ta.tag_id AND ta.name='" + tag + "'"
            );
            queries.add(databaseQuery);
        }

        return this;
    }

    /**
     * Adds a query to the DatabaseQuery list to filter Techniques by belts.
     *
     * @return Returns itself.
     */
    public SearchTechniquesDBBuilder filterByBelts() {
        return this;
    }

    /**
     * Adds a query to the DatabaseQuery list to filter Techniques by technique.
     *
     * @return Returns itself.
     */
    public SearchTechniquesDBBuilder filterByTechnique() {
        return this;
    }

    /**
     * Adds a query to the DatabaseQuery list to filter Techniques by kion.
     *
     * @return Returns itself.
     */
    public SearchTechniquesDBBuilder filterByKion() {
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
                    "SELECT technique_id, name FROM technique"
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

        DatabaseQuery joinBeltsQuery = createJoinBeltsQuery(databaseQuery);

        return joinBeltsQuery;
    }

    /**
     * This method concatenates a given query to join
     * it with the belt table.
     *
     * @param databaseQuery The query being joined.
     * @return A new query joined with the given query.
     */
    private DatabaseQuery createJoinBeltsQuery(DatabaseQuery databaseQuery){
        String resultQuery = databaseQuery.getQuery();

        String stringQuery = "SELECT result.technique_id, result.name, b.belt_color FROM ( " +
                resultQuery + " " +
                ") AS result " +
                "JOIN technique_to_belt AS ttb ON ttb.technique_id=result.technique_id " +
                "JOIN belt AS b ON ttb.belt_id=b.belt_id";

        DatabaseQuery createdDatabaseQuery = new DatabaseQuery();
        createdDatabaseQuery.setQuery(stringQuery);

        return createdDatabaseQuery;
    }
}
