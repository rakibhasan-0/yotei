package se.umu.cs.pvt.techniqueChain;
import javax.persistence.*;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.List;
import java.io.Serializable;

/**
 * Entity class for the node table.
 * This class represents nodes
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
@Entity
@Table(name = "node")
@JsonSerialize(using = TechniqueChainNodeSerializer.class)
public class TechniqueChainNode implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "id")
    private Long id;

    @ManyToOne(optional = true)
    @JoinColumn(name = "parent_weave")
    @JsonDeserialize(using = TechniqueChainWeaveDeserializer.class)
    private TechniqueChainWeave parentWeave;

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

    //TODOO: remove this from the table, it is never used but a massive job to remove it (the ManyToOne is the problem).
    @ManyToOne
    @JoinColumn(name = "in_chain")
    @JsonDeserialize(using = TechniqueChainChainDeserializer.class)
    private TechniqueChainChain inChain;

    @OneToMany(mappedBy = "fromNode", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TechniqueChainEdges> outgoingEdges;
    
    /**
     * Constructs a new node with all field values initialized.
     *
     * @param id The identifier for the comment.
     * @param parentWeave The identifier for the parent weave.
     * @param name The name of the node.
     * @param description The description of the node.
     * @param technique The id of the technique the node uses.
     * @param attack If the node is a attack node or a defence node.
     * @param participant what partisepant it is.
     * @param outgoingEdges All the edges that starts in this node.
     * @param inChain Not used (technical debt)
     */
    public TechniqueChainNode(Long id, TechniqueChainWeave parentWeave, String name, String description, int technique, Boolean attack, int participant, List<TechniqueChainEdges> outgoingEdges, TechniqueChainChain inChain) {
        this.id = id;
        this.parentWeave = parentWeave;
        this.name = name;
        this.description = description;
        this.technique= technique;
        this.attack = attack;
        this.participant = participant;
        this.outgoingEdges = outgoingEdges;
        this.inChain = inChain;
    }
    /**
     * Protected no-args constructor for JPA use only.
     */
    protected TechniqueChainNode() {}

    public Long getId() {
        return id;
    }

    public TechniqueChainChain getInChain() {
        return inChain;
    }

    public TechniqueChainWeave getParentWeave() {
        return parentWeave;
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

    public void setInChain(TechniqueChainChain inChain) {
        this.inChain = inChain;
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

    public void setParentWeave(TechniqueChainWeave parentWeave) {
        this.parentWeave = parentWeave;
    }

    public void setTechnique(int technique) {
        this.technique = technique;
    }
}
