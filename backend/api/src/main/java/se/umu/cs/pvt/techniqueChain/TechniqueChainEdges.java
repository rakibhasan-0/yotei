package se.umu.cs.pvt.techniqueChain;
import javax.persistence.*;
import java.io.Serializable;


/**
 * Entity class for the node table.
 * This class represents nodes
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
@Entity
@Table(name = "edges")
public class TechniqueChainEdges implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "from_node_id", nullable = false)
    private TechniqueChainNode fromNode;

    @ManyToOne
    @JoinColumn(name = "to_node_id", nullable = false)
    private TechniqueChainNode toNode;
    

    /**
     * Constructs a new edge with all field values initialized.
     *
     * @param id The identifier for the comment.
     * @param fromNode The id of the node.
     * @param toNode The id of the toNode
     */
    public TechniqueChainEdges(Long id, TechniqueChainNode fromNode, TechniqueChainNode toNode) {
        this.id = id;
        this.fromNode = fromNode;
        this.toNode = toNode;
    }
    /**
     * Protected no-args constructor for JPA use only.
     */
    protected TechniqueChainEdges() {}

    public Long getId() {
        return id;
    }

    public TechniqueChainNode getFromNode() {
        return fromNode;
    }

    public TechniqueChainNode getToNode() {
        return toNode;
    }

    public void setFromNode(TechniqueChainNode fromNode) {
        this.fromNode = fromNode;
    }

    public void setToNode(TechniqueChainNode toNode) {
        this.toNode = toNode;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
