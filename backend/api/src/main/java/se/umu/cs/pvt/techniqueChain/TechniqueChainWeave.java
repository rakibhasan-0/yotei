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
@Table(name = "technique_weave")
@JsonSerialize(using = TechniqueChainWeaveSerializer.class)
public class TechniqueChainWeave implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    
    @OneToMany(mappedBy = "techniqueWeave", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TechniqueWeaveRepresent> weaveRepresentations;
    
    /**
     * Constructs a new node with all field values initialized.
     *
     * @param id The identifier for the comment.
     * @param name The name of the node.
     * @param description The description of the node.
     */
    public TechniqueChainWeave(Long id, String name, String description , List<TechniqueWeaveRepresent> weaveRepresentations) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.weaveRepresentations = weaveRepresentations;
    }
    /**
     * Protected no-args constructor for JPA use only.
     */
    protected TechniqueChainWeave() {
    }

    public List<TechniqueWeaveRepresent> getWeaveRepresentations() {
        return weaveRepresentations;
    }

    public Long getId() {
        return id;
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
  
    public void setWeaveRepresentations(List<TechniqueWeaveRepresent> weaveRepresentations) {
        this.weaveRepresentations = weaveRepresentations;
    }

}
