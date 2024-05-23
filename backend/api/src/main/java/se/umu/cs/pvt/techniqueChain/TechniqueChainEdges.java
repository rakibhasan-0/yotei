package se.umu.cs.pvt.techniqueChain;
import javax.persistence.*;
import java.io.Serializable;


/**
 * Entity class for the node table.
 * This class represents nodes
 * @author Team Durian
 */
@Entity
@Table(name = "edges")
public class TechniqueChainEdges implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "id")
    private Long id;
/*
    @Column(nullable = false, name = "from_node_id")
    private int from_node_id;

    @Column(nullable = false, name = "to_node_id")
    private int to_node_id;
*/
    @ManyToOne
    @JoinColumn(name = "from_node_id", nullable = false)
    private TechniqueChainNode fromNode;

    @ManyToOne
    @JoinColumn(name = "to_node_id", nullable = false)
    private TechniqueChainNode toNode;
    

    /**
     * Constructs a new node with all field values initialized.
     *
     * @param id The identifier for the comment.
     * @param from_node_id The name of the node.
     * @param description The description of the node.
     */
    public TechniqueChainEdges(Long id, TechniqueChainNode fromNode, TechniqueChainNode toNode) {
        this.id = id;
        this.fromNode = fromNode;
        this.toNode = toNode;
    }
    /**
     * Protected no-args constructor for JPA use only.
     */
    protected TechniqueChainEdges() {
    }

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
