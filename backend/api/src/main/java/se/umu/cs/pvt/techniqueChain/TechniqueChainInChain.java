package se.umu.cs.pvt.techniqueChain;
import java.io.Serializable;
import javax.persistence.*;

/**
 * The Entity class for the in_chain table.
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
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
     * @param nodeId The id of the node.
     * @param chainId The id of the chain the node belong in.
     * @param posInChain The position that the node have in the chain.
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
