package se.umu.cs.pvt.exercise;

import java.util.List;

/**
 * Class made to make the response on import easier.
 * The class consist of a message and a list of ids that should be
 * returned when an import is called.
 */
public class ExerciseImportResponse {
    private String message;
    private List<Long> data;

    /**
     * Empty constructor.
     */
    public ExerciseImportResponse() {}

    /**
     * Complete constructor.
     * @param message Fills with a message for the response.
     * @param data Data to return. A list of ids of the exercises that
     *             where imported
     */
    public ExerciseImportResponse(String message, List<Long> data) {
        this.message = message;
        this.data = data;
    }

    
    public String getMessage() {
        return message;
    }

    
    public void setMessage(String message) {
        this.message = message;
    }

    
    public List<Long> getData() {
        return data;
    }

    
    public void setData(List<Long> data) {
        this.data = data;
    }
}
