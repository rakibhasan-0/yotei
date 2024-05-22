package se.umu.cs.pvt.gradingprotocol;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Model for grading_protocol_category in database.
 * Models a category contained in a grading_protocol

 * JPA (Java Persistence API)
 *
 *  GradingProtocolCategory.java - GradingProtocolCategory class. Represents the GradingProtocolCategory Entity.
 *
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-17
 */
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

    /**
     * Public getter for private property id
     * @return id of the protocol category
     */
    public Long getId() {
        return id;
    }

    /**
     * Public getter for private property protocolId
     * @return id of the protocol the the category is contained in
     */
    public Long getProtocolId() {
        return protocolId;
    }

    /**
     * Public getter for private property categoryName
     * @return name of the protocol category
     */
    public String getCategoryName() {
        return categoryName;
    }

    /**
     * Public getter for private property categoryOrder
     * @return order of the protocol category within the protocol
     */
    public int getCategoryOrder() {
        return categoryOrder;
    }

}