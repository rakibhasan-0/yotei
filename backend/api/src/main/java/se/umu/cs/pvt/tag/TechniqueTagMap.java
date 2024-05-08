package se.umu.cs.pvt.tag;

import java.util.List;

/**
 * Mapping between technique and tags, used to import functions for technique-tags.
 * @author UNKNOWN (Doc: Griffin dv21jjn)
 */
public class TechniqueTagMap {

    private Long techId;

    private List<Tag> tags;


    public Long getTechId() {
        return techId;
    }


    public List<Tag> getTags() {
        return tags;
    }


    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
