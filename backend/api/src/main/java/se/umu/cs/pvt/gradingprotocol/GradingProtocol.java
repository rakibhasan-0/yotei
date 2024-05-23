package se.umu.cs.pvt.gradingprotocol;

import javax.persistence.*;

import se.umu.cs.pvt.belt.Belt;

import java.io.Serializable;

 
/**
 * Model for grading_protocol in database

 * JPA (Java Persistence API)
 *
 *  GradingProtocol.java - GradingProtocol class. Represents the GradingProtocol Entity.
 *
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-17
 */
@Entity
@Table(name = "grading_protocol")
public class GradingProtocol implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "protocol_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "belt_id", nullable = false)
    private Belt belt;

    @Column(nullable = false, name = "protocol_code")
    private String code;

    @Column(nullable = false, name = "protocol_name")
    private String name;


    // private List<GradingProtocolCategory> categories;

    //Constructor used for Tests.
    protected GradingProtocol() {}

    /**
     * Constructor for GradingProtocol
     *
     * @param id id for workout
     * @param belt belt associated with grading protocol
     * @param code code of grading protocol
     * @param name name of grading protocol
     */
    public GradingProtocol(Long id, Belt belt, String code, String name) {
        this.id = id;
        this.belt = belt;
        this.code = code;
        this.name = name;
    }

    /**
     * Public getter for private property id
     * @return id of the protocol
     */
    public Long getId() {
        return this.id;
    }

    /**
     * Public getter for private property belt
     * @return belt associated with of the protocol
     */
    public Belt getBelt() {
        return this.belt;
    }

    /**
     * Public getter for private property code
     * @return code of the protocol
     */
    public String getCode() {
        return this.code;
    }

    /**
     * Public getter for private property name
     * @return name of the protocol
     */
    public String getName() {
        return this.name;
    }

}
