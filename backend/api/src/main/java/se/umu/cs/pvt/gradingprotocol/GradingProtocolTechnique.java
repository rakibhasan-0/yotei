package se.umu.cs.pvt.gradingprotocol;

import javax.persistence.*;
import java.io.Serializable;

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
     * @param id id for workout
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

    // Getters and setters
    public Long getId() {
        return id;
    }

    public Long getTechniqueId() {
        return techniqueId;
    }

    public Long getCategoryId() {
        return categoryId;
    }


    public int getOrder() {
        return order;
    }

}