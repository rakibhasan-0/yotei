package se.umu.cs.pvt.belt;

import se.umu.cs.pvt.technique.Technique;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

/**
 * A belt entity for Spring
 *
 * Belt.java - Belt class
 * BeltController.java - Controller for fetching belts.
 * BeltRepository.java - (Interface) Repository for belts.
 * @author Max Thorén
 * @author Andre Byström
 * date: 2023-04-24
 * Edited: 2024-05-15
 * @author Teodor Bäckström
 */
@Entity()
@Table(name = "belt")
public class Belt implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "belt_id")
    private long id;

    @Column(nullable = false, name = "belt_name")
    private String name;

    @Column(nullable = false, name = "belt_color")
    private String color;

    @Column(nullable = false, name = "is_child")
    private boolean isChild;

    @Column(nullable = false, name = "is_inverted")
    private boolean isInverted;

    /**
     * No-args constructor required JPA spec
     */
    protected Belt() {
    }

    public Belt(Long id, String name, String color, boolean isChild, boolean isInverted) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.isChild = isChild;
        this.isInverted = isInverted;
    }

    public Belt(Long id, String name, String color, boolean isChild) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.isChild = isChild;
        this.isInverted = false;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }

    public boolean isChild() {
        return isChild;
    }
    
    public boolean isInverted(){
        return isInverted;
    }
}
