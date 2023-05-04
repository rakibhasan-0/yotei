package se.umu.cs.pvt.search;

import se.umu.cs.pvt.search.interfaces.SearchResponseInterface;

import java.util.List;
import java.util.Optional;

/**
 * This class bundles together a list of results and a list of tags.
 *
 * @author Minotaur (Olle Lögdahl) 
 * @author Kraken (Oskar Westerlund Holmgren) 2023-05-02
 * 
 * @version 2.0
 *
 * @param <T> The type being stored in the results list.
 */
public class SearchResponse<T> {
    public List<T> results;
    public List<String> tagCompletion;

    public SearchResponse(List<T> results, List<String> tagCompletion) {
        this.results = results;
        this.tagCompletion = tagCompletion;
    }
}
