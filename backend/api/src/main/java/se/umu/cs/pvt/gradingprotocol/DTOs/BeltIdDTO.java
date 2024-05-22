package se.umu.cs.pvt.gradingprotocol.DTOs;

/**
 * Data Transfer Object for formatting the belt field in JSON response for grading protocol.
 *
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-20
 */
public class BeltIdDTO {
    
    private Long beltId;


    public BeltIdDTO(Long beltId){
        this.beltId = beltId;
    }

    public Long getBeltId() {
        return this.beltId;
    }
}
