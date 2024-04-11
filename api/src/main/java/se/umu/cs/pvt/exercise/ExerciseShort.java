package se.umu.cs.pvt.exercise;

/**
 * ExerciseIdAndName is a projection that makes JPA
 * only return the id and name and duration of the exercise.
 *
 * @author Henrik Aili (c20hai) - Grupp 3 Hawaii
 */
public interface ExerciseShort {

    
    Long getId();

    String getName();
    
    Integer getDuration();
}
