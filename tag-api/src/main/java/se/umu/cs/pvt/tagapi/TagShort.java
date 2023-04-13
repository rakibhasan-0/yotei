/**
 * Projection of the Tag entity that only returns the Id of the tag.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tagapi;

/**
 * Model for TagShort data in database
 */
public interface TagShort {

    /**
     * Get the tag Id.
     * 
     * @return The tag Id.
     */
    Long getId();
}