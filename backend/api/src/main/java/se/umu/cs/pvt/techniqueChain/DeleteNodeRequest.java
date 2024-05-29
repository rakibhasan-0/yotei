package se.umu.cs.pvt.techniqueChain;

/**
 * Class for deleting nodes
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
public class DeleteNodeRequest {
    
    private Long deleteNode;


    /**
     * Constructs a new node with all field values initialized.
     *
     * @param deletenode the node id to delete.
     */
    public DeleteNodeRequest(Long deleteNode) {
        this.deleteNode = deleteNode;
    }

    /**
     * Protected no-args constructor for JPA use only.
     */
    protected DeleteNodeRequest() {
    }

    public Long getDeleteNode() {
        return deleteNode;
    }

    public void setDeleteNode(Long deleteNode) {
        this.deleteNode = deleteNode;
    }
}
