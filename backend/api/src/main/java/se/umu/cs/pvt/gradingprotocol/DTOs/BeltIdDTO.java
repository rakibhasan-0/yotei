package se.umu.cs.pvt.gradingprotocol.DTOs;


public class BeltIdDTO {
    
    private Long beltId;


    public BeltIdDTO(Long beltId){
        this.beltId = beltId;
    }

    public Long getBeltId() {
        return this.beltId;
    }
}
