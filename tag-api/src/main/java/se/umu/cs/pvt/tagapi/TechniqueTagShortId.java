/**
 * Projection of the TechniqueTag entity that only returns the Id of the Tag from the techinque-tag pair.
 */
package se.umu.cs.pvt.tagapi;

public interface TechniqueTagShortId {
    /**
     * Gets the Id of the tag.
     * @return The tag Id.
     */
    Long getTagId(); 
}
