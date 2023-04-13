/**
 * Projection of the WorkoutTag entity that returns the Id of the tag from the workout-tag pair.
 */
package se.umu.cs.pvt.tagapi;

public interface WorkoutTagShortId {
    /**
     * Gets the Id of the tag.
     * @return The Id.
     */
    Long getTagId();
}
