package se.umu.cs.pvt.gradingprotocol;

import javax.persistence.*;
import java.io.Serializable;
/**
 * Model for grading_protocol_technique in database.
 * Models a technique contained in a grading_protocol_category

 * JPA (Java Persistence API)
 *
 *  GradingProtocolTechnique.java - GradingProtocolTechnique class. Represents the GradingProtocolTechnique Entity.
 *
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-17
 */
@Entity
@Table(name = "grading_protocol_technique")
public class GradingProtocolTechnique implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "id")
    private Long id;

    @Column(nullable = false, name = "technique_id")
    private Long techniqueId;

    @Column(nullable = false, name = "protocol_category_id")
    private Long categoryId;

    @Column(nullable = false, name = "technique_order")
    private int order;

    //Constructor used for Tests.
    protected GradingProtocolTechnique() {}

    /**
     * Constructor for GradingProtocolTechnique
     *
     * @param id id of the grading protocol technique entity
     * @param techniqueId id of protocol associated with category
     * @param categoryId name of the technique
     * @param order order of the technique
     */
    public GradingProtocolTechnique(Long id, Long techniqueId, Long categoryId, Integer order) {
        this.id = id;
        this.techniqueId = techniqueId;
        this.categoryId = categoryId;
        this.order = order;
    }

    
    /**
     * Public getter for private property id
     * @return id of the grading protocol technique entity
     */
    public Long getId() {
        return id;
    }

    /**
     * Public getter for private property techniqueId
     * @return id of the technique
     */
    public Long getTechniqueId() {
        return techniqueId;
    }

    /**
     * Public getter for private property categoryId
     * @return id of the category the the technique is contained in
     */
    public Long getCategoryId() {
        return categoryId;
    }

    /**
     * Public getter for private property order
     * @return order of the technique within the category
     */
    public int getOrder() {
        return order;
    }

}