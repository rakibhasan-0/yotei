package se.umu.cs.pvt.techniqueChain;

import java.io.Serializable;

import javax.persistence.*;

@Entity
@Table(name = "in_chain")
public class TechniqueChainInChain implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "id")
    private Long id;

    @Column(nullable = false, name = "node_id")
    private Long nodeId;

    @Column(nullable = false, name = "chain_id")
    private Long chainId;

    @Column(nullable = false, name = "pos_in_chain")
    private int posInChain;

    /**
     * Constructs a new node with all field values initialized.
     *
     * @param id The identifier for the comment.
     * @param from_node_id The name of the node.
     * @param description The description of the node.
     */
    public TechniqueChainInChain(Long id, Long nodeId, Long chainId, int posInChain) {
        this.id = id;
        this.nodeId = nodeId;
        this.chainId = chainId;
        this.posInChain = posInChain;
    }

    /**
     * Protected no-args constructor for JPA use only.
     */
    protected TechniqueChainInChain() {}

    public Long getId() {
        return id;
    }

    public Long getNodeId() {
        return nodeId;
    }

    public Long getChainId() {
        return chainId;
    }

    public int getPosInChain() {
        return posInChain;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNodeId(Long nodeId) {
        this.nodeId = nodeId;
    }

    public void setChainId(Long chainId) {
        this.chainId = chainId;
    }

    public void setPosInChain(int posInChain) {
        this.posInChain = posInChain;
    }
}
