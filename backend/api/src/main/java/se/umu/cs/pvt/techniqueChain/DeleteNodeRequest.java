package se.umu.cs.pvt.techniqueChain;


public class DeleteNodeRequest {
    
    private Long deleteNode;


    /**
     * Constructs a new node with all field values initialized.
     *
     * @param id The identifier for the comment.
     * @param parent_weave The identifier for the parent weave.
     * @param name The name of the node.
     * @param description The description of the node.
     * @param technique The id of the technique the node uses.
     * @param attack If the node is a attack node or a defence node.
     * @param partisipant what partisepant it is.
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
