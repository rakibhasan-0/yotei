package se.umu.cs.pvt.techniqueChain;
import javax.persistence.*;
import java.util.List;
import java.io.Serializable;

/**
 * Entity class for the chain table.
 * This class represents nodes
 * @author Team Durian
 */
@Entity
@Table(name = "technique_chain")
public class TechniqueChainChain implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "parent_weave_id")
    private TechniqueChainWeave parent_weave_id;

    @OneToMany(mappedBy = "inChain", cascade = CascadeType.ALL, fetch = FetchType.LAZY )
    private List<TechniqueChainNode> node;

    @Transient
    private Long parentId;
    
    /**
     * Constructs a new node with all field values initialized.
     *
     * @param id The identifier for the comment.
     * @param parent_weave The identifier for the parent weave.
     * @param name The name of the node.
     * @param description The description of the node.
     */
    public TechniqueChainChain(Long id, String name, String description, TechniqueChainWeave parent_weave_id, List<TechniqueChainNode> node, Long parentId) {
        this.id = id;
        this.parent_weave_id = parent_weave_id;
        this.name = name;
        this.description = description;
        this.node = node;
        this.parentId = parentId;
    }
    /**
     * Protected no-args constructor for JPA use only.
     */
    protected TechniqueChainChain() {
    }

    public Long getParentId() {
        return parentId;
    }

    public List<TechniqueChainNode> getNode() {
        return node;
    }

    public Long getId() {
        return id;
    }

    public TechniqueChainWeave getParent_weave_id() {
        return parent_weave_id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
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

    public void setParent_weave_id(TechniqueChainWeave parent_weave_id) {
        this.parent_weave_id = parent_weave_id;
    }

    public void setNode(List<TechniqueChainNode> node) {
        this.node = node;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
}
