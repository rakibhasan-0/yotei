package se.umu.cs.pvt.techniqueChain;
import javax.persistence.*;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.List;
import java.io.Serializable;

/**
 * Entity class for the node table.
 * This class represents nodes
 * @author Team Durian
 */
@Entity
@Table(name = "node")
@JsonSerialize(using = TechniqueChainNodeSerializer.class)
public class TechniqueChainNode implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "id")
    private Long id;

   @Column(name = "parent_weave")
    private int parent_weave;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "technique")
    private int technique;

    @Column(nullable = false, name = "attack")
    private Boolean attack;

    @Column(nullable = false, name = "participant")
    private int participant;

    @OneToMany(mappedBy = "fromNode", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TechniqueChainEdges> outgoingEdges;
    
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
    public TechniqueChainNode(Long id, int parent_weave, String name, String description, int technique, Boolean attack, int participant, List<TechniqueChainEdges> outgoingEdges) {
        this.id = id;
        this.parent_weave = parent_weave;
        this.name = name;
        this.description = description;
        this.technique= technique;
        this.attack = attack;
        this.participant = participant;
        this.outgoingEdges = outgoingEdges;
    }
    /**
     * Protected no-args constructor for JPA use only.
     */
    protected TechniqueChainNode() {
    }

    public Long getId() {
        return id;
    }

    public int getParent_weave() {
        return parent_weave;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getTechnique() {
        return technique;
    }

    public Boolean getAttack() {
        return attack;
    }

    public int getParticipant() {
        return participant;
    }

    public List<TechniqueChainEdges> getOutgoingEdges() {
        return outgoingEdges;
    }

    public void setAttack(Boolean attack) {
        this.attack = attack;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setParticipant(int participant) {
        this.participant = participant;
    }

    public void setEdges(List<TechniqueChainEdges> outgoingEdges) {
        this.outgoingEdges = outgoingEdges;
    }

    public void setParent_weave(int parent_weave) {
        this.parent_weave = parent_weave;
    }

    public void setTechnique(int technique) {
        this.technique = technique;
    }
}
