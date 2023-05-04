package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.interfaces.SearchDBBuilderInterface;

import java.util.ArrayList;
import java.util.List;

import org.springframework.core.metrics.StartupStep.Tags;

import se.umu.cs.pvt.search.DatabaseQuery;
import se.umu.cs.pvt.search.enums.*;

/**
 * This class builds a {@link DatabaseQuery DatabaseQuery} based on
 * the filtering methods used.
 *
 * @author Kraken (Oskar Westerlund Holmgren) 2023-05-03
 */

 public class SearchTagSuggestionsDBBuilder implements SearchDBBuilderInterface {
	private TagType tagType;
	private List<String> tags;
    private List<DatabaseQuery> queries;

    public SearchTagSuggestionsDBBuilder(List<String> tags, TagType tagType) {
		this.tags = tags;
		this.tagType = tagType;
        queries = new ArrayList<>();
    }

    /**
     * Adds a query to the DatabaseQuery list to filter Tags by tag type.
     *
     * @return Returns itself.
     */
    public SearchTagSuggestionsDBBuilder filterByTagType() {
		if(this.tagType != null) {
			String tagTypeString = this.tagType.name();
			DatabaseQuery databaseQuery = new DatabaseQuery();
			databaseQuery.setQuery("SELECT tag.name, tag.tag_id FROM tag, "+ tagTypeString +" WHERE tag.tag_id = "+ tagTypeString +".tag_id");
        	queries.add(databaseQuery);
		}
        return this;
    }

	/**
     * Adds a query to the DatabaseQuery list to filter Tags by alredy choosen search tags.
     *
     * @return Returns itself.
     */
    public SearchTagSuggestionsDBBuilder filterByExistingTags() {
		if(tags != null) {

			// Make List of tags into a string, so it can be used in SQL Query.
			String tagsString = "";
			Boolean firstItteration = true;
			for (String tag : tags) {
				if (firstItteration) {
					tagsString = tagsString.concat("('" + tag + "'");
					firstItteration = false;
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
                    "SELECT name, tag_id FROM tag"
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