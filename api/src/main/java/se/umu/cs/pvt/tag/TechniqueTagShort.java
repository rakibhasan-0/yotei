/**
 * Projection of the TechniqueTag entity that only returns the Id from the related technique-tag pair.
 */
package se.umu.cs.pvt.tag;

public interface TechniqueTagShort {
    
    /**
     * Returns the Technique Id of a TechniqueTag pair.
     * @return The Technique Id of the TechniqueTag pair.
     */
    Long getTechId();
}
