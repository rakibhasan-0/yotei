package se.umu.cs.pvt.techniqueChain;

public class TechniqueChainDTO {

    private Long deleteChain;

    public TechniqueChainDTO(Long deleteChain) {
        this.deleteChain = deleteChain;
    }

    public TechniqueChainDTO() {}

    public void setDeleteNode(Long deleteChain) {
        this.deleteChain = deleteChain;
    }

    public Long getDeleteChain() {
        return deleteChain;
    }
    
}
