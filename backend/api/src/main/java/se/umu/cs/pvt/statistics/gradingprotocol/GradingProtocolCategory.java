package se.umu.cs.pvt.statistics.gradingprotocol;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "grading_protocol_category")
public class GradingProtocolCategory implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "category_id")
    private Long id;

    @Column(nullable = false, name = "protocol_id")
    private Long protocolId;

    @Column(nullable = false, name = "category_name")
    private String categoryName;

    @Column(nullable = false, name = "category_order")
    private int categoryOrder;

    //Constructor used for Tests.
    protected GradingProtocolCategory() {}

    /**
     * Constructor for GradingProtocol
     *
     * @param id id for workout
     * @param protocolId id of protocol associated with category
     * @param categoryName name of the category
     * @param categoryOrder order of the category
     */
    public GradingProtocolCategory(Long id, Long protocolId, String categoryName, Integer categoryOrder) {
        this.id = id;
        this.protocolId = protocolId;
        this.categoryName = categoryName;
        this.categoryOrder = categoryOrder;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public Long getProtocolId() {
        return protocolId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public int getCategoryOrder() {
        return categoryOrder;
    }

}