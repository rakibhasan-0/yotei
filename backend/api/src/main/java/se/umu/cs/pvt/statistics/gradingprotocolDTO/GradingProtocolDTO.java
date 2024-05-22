package se.umu.cs.pvt.statistics.gradingprotocolDTO;

import java.util.List;

import se.umu.cs.pvt.statistics.BeltResponse;

/**
 * Used to represent grading protocol statistics response.
 * 
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-17
 */
public class GradingProtocolDTO {
    
    private String code;
    private String name;
    private BeltResponse belt;
    private List<GradingProtocolCategoryDTO> categories;

    /**
     * Constructor for GradingProtocolDTO.
     *
     * @param code code of the protocol. (Ex. "5 KYU")
     * @param name name of the protocol. (Ex. "GULT BÄLTE")
     * @param belt propery containing the display information about the belt.
     * @param categories categories contained in the protocol.
     * @return new GradingProtocolDTO
     */
    public GradingProtocolDTO(String code, String name, BeltResponse belt, List<GradingProtocolCategoryDTO> categories){
        this.code = code;
        this.name = name;
        this.belt = belt;
        this.categories = categories;
    }

    /**
     * Public getter for private property code
     * @return code of the protocol
     */
    public String getCode() {
        return this.code;
    }

    /**
     * Public getter for private property name
     * @return name of the protocol
     */
    public String getName() {
        return this.name;
    }

    /**
     * Public getter for private property belt
     * See BeltResponse for docs.
     * @return belt associated with the protocol.
     */
    public BeltResponse getBelt() {
        return this.belt;
    }

    /**
     * Public getter for private property categories
     * See GradingProtocolCategoryDTO for docs.
     * @return a list of categories contained in the protocol.
     */
    public List<GradingProtocolCategoryDTO> getCategories() {
        return this.categories;
    }
}
