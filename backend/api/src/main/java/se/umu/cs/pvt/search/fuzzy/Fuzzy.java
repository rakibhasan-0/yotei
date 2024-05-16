package se.umu.cs.pvt.search.fuzzy;

import me.xdrop.fuzzywuzzy.FuzzySearch;
import me.xdrop.fuzzywuzzy.model.ExtractedResult;
import se.umu.cs.pvt.search.interfaces.responses.SearchResponseInterface;

import java.util.*;

/**
 * Does a Fuzzy Wuzzy ♥(。U ω U。) search on the list of strings given a specific
 * string.
 * Returns the incoming list but sorted according to the fuzzy algorithm.
 *
 * @author Kraken (Fardis Nazem)
 */
public class Fuzzy {
    // Variable that determines how strict the search cutoff will be. 0 represents
    // no cutoff, 100 represents a perfect match
    private static int cutoff = 60;

    /**
     * @param str      the string to fuzzy search.
     * @param response List of strings to check against the string.
     *
     * @return a sorted list based on string matching.
     */
    public static <T extends SearchResponseInterface> List<T> search(String str, List<T> response) {

        if (response == null || response.isEmpty() || str == null || str.isEmpty())
            return response;

        List<String> dataBaseRes = response.stream().map(SearchResponseInterface::getName).toList();

        dataBaseRes = dataBaseRes.stream().filter(s -> !s.isEmpty()).toList();

        List<ExtractedResult> list = FuzzySearch.extractSorted(str, dataBaseRes, getCutoff());

        List<T> map = new ArrayList<>();
        for (ExtractedResult extractedResult : list) {
            map.add(response.get(extractedResult.getIndex()));
        }

        return map;

    }

    /**
     * Sets the cutoff that determines how good matches
     * the fuzzy algorithm returns.
     *
     * @param cutoff the minimum value to include results.
     *               0 is a bad match.
     *               100 is a perfect match.
     */
    public static void setCutoff(int cutoff) {
        Fuzzy.cutoff = cutoff;
    }

    public static int getCutoff() {
        return cutoff;
    }

}
