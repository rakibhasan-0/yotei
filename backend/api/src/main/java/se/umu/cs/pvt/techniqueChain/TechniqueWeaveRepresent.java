package se.umu.cs.pvt.techniqueChain;
import javax.persistence.*;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.io.Serializable;

/**
 * Entity class for the weave_representation table.
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
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
    private Long node_id;

    @ManyToOne
    @JoinColumn(name = "parent_weave_id", nullable = false)
    private TechniqueChainWeave techniqueWeave;
    
    //used to remove and edit a representation.
    @Transient
    private Long techniqueWeaveId;


    /**
     * Constructs a new node with all field values initialized.
     *
     * @param id The identifier for the comment.
     * @param node_x_pos The x pos of the node.
     * @param node_y_pos The y pos of the node.
     * @param techniqueWeave The wheave the representation belongs in.
     * @param node_id The id of the node the representation is for.
     * @param techniqueWeaveId The id if the weave the representation is for.
     */
    public TechniqueWeaveRepresent(Long id, int node_x_pos, int node_y_pos, TechniqueChainWeave techniqueWeave, Long node_id, Long techniqueWeaveId) {
        this.id = id;
        this.node_x_pos = node_x_pos;
        this.node_y_pos = node_y_pos;
        this.techniqueWeave = techniqueWeave;
        this.node_id = node_id;
        this.techniqueWeaveId = techniqueWeaveId;
    }
    /**
     * Protected no-args constructor for JPA use only.
     */
    protected TechniqueWeaveRepresent() {}

    public Long getTechniqueWeaveId() {
        return techniqueWeaveId;
    }

    public TechniqueChainWeave getTechniqueWeave() {
        return techniqueWeave;
    }

    public Long getNode_id() {
        return node_id;
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

    public void setNode_id(Long node_id) {
        this.node_id = node_id;
    }

    public void setTechniqueWeaveId(Long techniqueWeaveId) {
        this.techniqueWeaveId = techniqueWeaveId;
    }
}
