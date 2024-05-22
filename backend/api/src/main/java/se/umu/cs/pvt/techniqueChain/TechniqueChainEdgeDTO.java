package se.umu.cs.pvt.techniqueChain;

public class TechniqueChainEdgeDTO {
    private Long fromNodeId;
    private Long toNodeId;
    private Long edgeToDelete;

    /**
     * Constructs a new node with all field values initialized.
     *
     * @param fromNodeId where the edge starts.
     * @param toNodeId where the edge ends.
     * @param edgeToDelete The id of the edge to delete.
     */
    public TechniqueChainEdgeDTO(Long fromNodeId, Long toNodeId, Long edgeToDelete) {
        this.fromNodeId = fromNodeId;
        this.toNodeId = toNodeId;
        this.edgeToDelete = edgeToDelete;
    }
    /**
     * Protected no-args constructor for JPA use only.
     */
    protected TechniqueChainEdgeDTO() {
    }

    public void setEdgeToDelete(Long edgeToDelete) {
        this.edgeToDelete = edgeToDelete;
    }

    public void setFromNode(Long fromNodeId) {
        this.fromNodeId = fromNodeId;
    }

    public void setToNodeId(Long toNodeId) {
        this.toNodeId = toNodeId;
    }

    public Long getEdgeToDelete() {
        return edgeToDelete;
    }

    public Long getFromNodeId() {
        return fromNodeId;
    }

    public Long getToNodeId() {
        return toNodeId;
    }
}
