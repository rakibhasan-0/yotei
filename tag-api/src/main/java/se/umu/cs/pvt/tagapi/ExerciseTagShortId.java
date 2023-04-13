/**
 * Projection of the ExerciseTag entity that only returns the Id of the tag from the exercise-tag pair.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tagapi;

public interface ExerciseTagShortId {
    Long getTagId();
}
