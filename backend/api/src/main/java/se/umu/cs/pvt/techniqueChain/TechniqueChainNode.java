package se.umu.cs.pvt.techniqueChain;
import javax.persistence.*;
import java.util.ArrayList;

/**
 * Entity class for the node table.
 * This class represents nodes
 * @author Team Durian
 */
@Entity
@Table(name = "node")
public class TechniqueChainNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "id")
    private int nodeId;

    @Column(name = "parent_weave")
    private int parentWeaveId;

    @Column(name = "name")
    private String nodeName;

    @Column(name = "description")
    private String description;

    @Column(name = "technique")
    private int techniqueId;

    @Column(nullable = false, name = "attack")
    private Boolean attacker;

    @Column(nullable = false, name = "partisipant")
    private int partisipant;

    @Column(name = "connected_to")
    private ArrayList<Integer> connected_to;
    
    /**
     * Constructs a new node with all field values initialized.
     *
     * @param nodeId The identifier for the comment.
     * @param parentWeaveId The identifier for the parent weave.
     * @param nodeName The name of the node.
     * @param description The description of the node.
     * @param techniqueId The id of the technique the node uses.
     * @param attacker If the node is a attack node or a defence node.
     * @param partisipant what partisepant it is.
     * @param connected_to All the nodes this node is conected to.
     */
    public void ExaminationComment(int nodeId, int parentWeaveId, String nodeName, String description, int techniqueId, Boolean attacker, int partisipant, ArrayList<Integer> connected_to) {
        this.nodeId = nodeId;
        this.parentWeaveId = parentWeaveId;
        this.nodeName = nodeName;
        this.description = description;
        this.techniqueId= techniqueId;
        this.attacker = attacker;
        this.partisipant = partisipant;
        this.connected_to = connected_to;
    }
    /**
     * Protected no-args constructor for JPA use only.
     */
    protected TechniqueChainNode() {
    }

    public int getNodeId() {
        return nodeId;
    }

    public int getParentWeaveId() {
        return parentWeaveId;
    }

    public String getNodeName() {
        return nodeName;
    }

    public String getDescription() {
        return description;
    }

    public int getTechniqueId() {
        return techniqueId;
    }

    public Boolean getAttackStatus() {
        return attacker;
    }

    public int getPartisepant() {
        return partisipant;
    }

    public ArrayList<Integer> getConnected_nodes() {
        return connected_to;
    }
}
