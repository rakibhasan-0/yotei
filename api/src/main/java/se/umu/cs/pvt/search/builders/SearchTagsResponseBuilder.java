package se.umu.cs.pvt.search.builders;

import se.umu.cs.pvt.search.interfaces.TagDBResult;
import se.umu.cs.pvt.search.interfaces.TagSearchResponse;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Kraken (Jonas Gustavsson) 2023-05-04
 */
public class SearchTagsResponseBuilder {
    private List<TagDBResult> tagDBResultList;

    public SearchTagsResponseBuilder(List<TagDBResult> tagDBResultList){
        this.tagDBResultList = tagDBResultList;
    }

    /**
     * Builds a list of {@link TagSearchResponse WorkoutSearchReponses}.
     *
     * @return The created list of TagsSearchResponses.
     */
    public List<TagSearchResponse> build(){
        List<TagSearchResponse> array = new ArrayList<>();
        tagDBResultList.forEach(result -> array.add(
                new TagSearchResponse(
                        result.getId(),
                        result.getName()
                )
        ));
        return array;
    }
}
