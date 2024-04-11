package se.umu.cs.pvt.search;

/**
 * A class for storing a database query.
 *
 * @author Minotaur (James Eriksson)
 */

public class DatabaseQuery {
    private String query;

    public DatabaseQuery(String query) {
        this.query = query;
    }

    public DatabaseQuery() {
        this("");
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public DatabaseQuery append(String query) {
        this.query += " " + query;
        return this;
    }

    public String getQuery() {
        return query;
    }
}
