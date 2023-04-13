package se.cs.umu.pvt.exerciseapi;

/**
 * ExerciseIdAndName is a projection that makes JPA
 * only return the id and name and duration of the exercise.
 *
 * @author Henrik Aili (c20hai) - Grupp 3 Hawaii
 */
public interface ExerciseShort {

    /**
     * Returns the id of the exercise.
     * @return the id of the exercise.
     */
    Long getId();

    /**
     * Returns the name of the exercise.
     * @return the name of the exercise.
     */
    String getName();


    /**
     * Returns the duration of the exercise.
     * @return the duration of the exercise.
     */
    Integer getDuration();
}
