package se.umu.cs.pvt.statistics.gradingprotocolDTO;


/**
 * Used to represent the techniques field in the Grading Protcol Statistics API.
 * 
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-17
 */
public class GradingProtocolTechinqueDTO {
    private String name;
    private Long id;
    private Long count;

    /**
     * Constructor for GradingProtocolTechinqueDTO.
     * NOTE: count defaults to 0 and is set via the setCount method.
     *
     * @param name name of the technique
     * @param id if of the technique
     * @return new GradingProtocolTechinqueDTO
     */
    public GradingProtocolTechinqueDTO(String name, Long id) {
        this.name = name;
        this.id = id;
        this.count = 0L;
    }
    
    /**
     * Public getter for private property name
     * @return name of the technique
     */
    public String getName() {
        return this.name;
    }

    /**
     * Public getter for private property id
     * @return id of the technique
     */
    public Long getId() {
        return this.id;
    }

    /**
     * Public getter for private property count
     * Count represents the amount of times that the technique has been practiced.
     * @return count of the technique
     */
    public Long getCount() {
        return this.count;
    }

    /**
     * Public setter for private property count
     */
    public void setCount(Long count) {
        this.count = count;
    }
}
