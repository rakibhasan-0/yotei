package se.umu.cs.pvt.workout;

/**
 * Class for representing response for posting and updating a workout.
 *
 * @author Squad 8 Minotaur.
 */
public class WorkoutResponse {

    private String statusMessage;
    private int statusCode;
    private Long workoutId;

    //Constructor used when no error.
    WorkoutResponse(String statusMessage, Long workoutId, int statusCode) {
        this.statusMessage = statusMessage;
        this.statusCode = statusCode;

        // If succeed send workout id.
        if (statusCode > 199 && statusCode < 300) {
            this.workoutId = workoutId;
        }
    }

    /**
     *
     * @return Status code
     */
    public int getStatusCode() { return statusCode; }

    /**
     *
     * @return Workout id
     */
    public Long getWorkoutId() { return workoutId; }

    /**
     *
     * @return Status message
     */
    public String getStatusMessage() { return statusMessage; }
}
