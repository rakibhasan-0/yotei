package se.umu.cs.pvt.techniqueChain;
import javax.persistence.*;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Entity class for the node table.
 * This class represents nodes
 * @author Team Durian
 */
@Entity
@Table(name = "weave_representation")
@JsonSerialize(using = TechniqueChainWeaveRepresentSerializer.class)
public class TechniqueWeaveRepresent implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "id")
    private Long id;

    @Column(nullable = false, name = "node_x_pos")
    private int node_x_pos;

    @Column(nullable = false, name = "node_y_pos")
    private int node_y_pos;

    @Column(nullable = false, name = "node_id")
    private Long nodeId;

    @ManyToOne
    @JoinColumn(name = "parent_weave_id", nullable = false)
    private TechniqueChainWeave techniqueWeave;
    
    @Transient
    private Long techniqueWeaveId;

/*
    @Column(nullable = false, name = "parent_weave_id")
    private Long techniqueWeave;
*/

    /**
     * Constructs a new node with all field values initialized.
     *
     * @param id The identifier for the comment.
     * @param node_x_pos The name of the node.
     * @param description The description of the node.
     */
    public TechniqueWeaveRepresent(Long id, int node_x_pos, int node_y_pos, TechniqueChainWeave techniqueWeave, Long nodeId, Long techniqueWeaveId) {
        this.id = id;
        this.node_x_pos = node_x_pos;
        this.node_y_pos = node_y_pos;
        this.techniqueWeave = techniqueWeave;
        this.nodeId = nodeId;
        this.techniqueWeaveId = techniqueWeaveId;
    }
    /**
     * Protected no-args constructor for JPA use only.
     */
    protected TechniqueWeaveRepresent() {
    }

    public Long getTechniqueWeaveId() {
        return techniqueWeaveId;
    }

    public TechniqueChainWeave getTechniqueWeave() {
        return techniqueWeave;
    }

    public Long getNodeId() {
        return nodeId;
    }

    public Long getId() {
        return id;
    }

    public int getNode_x_pos() {
        return node_x_pos;
    }

    public int getNode_y_pos() {
        return node_y_pos;
    }

    public void setNode_x_pos(int node_x_pos) {
        this.node_x_pos = node_x_pos;
    }

    public void setNode_y_pos(int node_y_pos) {
        this.node_y_pos = node_y_pos;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTechniqueWeave(TechniqueChainWeave techniqueWeave) {
        this.techniqueWeave = techniqueWeave;
    }

    public void setNodeId(Long nodeId) {
        this.nodeId = nodeId;
    }

    public void setTechniqueWeaveId(Long techniqueWeaveId) {
        this.techniqueWeaveId = techniqueWeaveId;
    }
}
