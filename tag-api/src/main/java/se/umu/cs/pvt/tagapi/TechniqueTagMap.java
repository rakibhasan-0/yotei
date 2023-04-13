package se.umu.cs.pvt.tagapi;

import java.util.List;

public class TechniqueTagMap {

    private Long techId;

    private List<Tag> tags;

    /**
     * Getter for the technique id.
     * @return the technique id.
     */
    public Long getTechId() {
        return techId;
    }

    /**
     * Setter for the technique id.
     * @param techId the value to give the technique id.
     */
    public void setTechId(Long techId) {
        this.techId = techId;
    }

    /**
     * Getter for the tags.
     * @return the list of tags.
     */
    public List<Tag> getTags() {
        return tags;
    }

    /**
     * Setter for the tags
     * @param tags the list object that will become the tags.
     */
    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
