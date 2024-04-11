/**
 * Projection of the TechniqueTag entity that only returns the Id from the related technique-tag pair.
 *
 * @author UNKNOWN (Doc: Griffin dv21jjn)
 */
package se.umu.cs.pvt.tag;

public interface TechniqueTagShort {
    
    /**
     * Returns the Technique ID of a TechniqueTag pair.
     *
     * @return      The Technique ID of the TechniqueTag pair.
     */
    Long getTechId();
}
