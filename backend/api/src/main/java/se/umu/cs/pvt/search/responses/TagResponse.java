package se.umu.cs.pvt.search.responses;

import java.util.List;

import se.umu.cs.pvt.search.interfaces.responses.SearchResponseInterface;

/**
 * This class bundles together a list of results
 *
 * @author Kraken (Jonas Gustavsson)
 * date: 2023-05-04
 *
 * @param <T> The type being stored in the results list.
 */
public class TagResponse<T extends SearchResponseInterface> {
    public List<T> results;

    public TagResponse(List<T> results) {
        this.results = results;
    }
}
