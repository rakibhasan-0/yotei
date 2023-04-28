package se.umu.cs.pvt.search;

import se.umu.cs.pvt.search.interfaces.SearchResponseInterface;

import java.util.List;
import java.util.Optional;

/**
 * This class bundles together a list of results and a list of tags.
 *
 * @author Minotaur (Olle Lögdahl)
 *
 * @param <T> The type being stored in the results list.
 */
public class SearchResponse<T extends SearchResponseInterface> {
    public List<T> results;
    public Optional<String> tagCompletion;

    public SearchResponse(List<T> results, Optional<String> tagCompletion) {
        this.results = results;
        this.tagCompletion = tagCompletion;
    }
}
