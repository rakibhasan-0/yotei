package se.umu.cs.pvt.techniqueChain;

/**
 * The DTO to delete a chain from the in_chain table.
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
public class TechniqueChainDTO {

    private Long deleteChain;

    /*
     * The constructor if the ChainDTO
     * @param deleteChain The id of the node to remove from a chain.
     */
    public TechniqueChainDTO(Long deleteChain) {
        this.deleteChain = deleteChain;
    }

    /*JPA requerd constructor */
    protected TechniqueChainDTO() {}

    public void setDeleteNode(Long deleteChain) {
        this.deleteChain = deleteChain;
    }

    public Long getDeleteChain() {
        return deleteChain;
    }
    
}
