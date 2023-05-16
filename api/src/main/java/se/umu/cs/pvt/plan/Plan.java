package se.umu.cs.pvt.plan;

import javax.persistence.*;

import se.umu.cs.pvt.belt.Belt;

import java.io.Serializable;
import java.util.Set;

 
/**
 * Model for plan data in database
 *
 * Documentation Griffin c20wnn
 * JPA (Java Persistence API)
 *
 *  Plan.java - Plan class. Represents the Plan Entity.
 *  PlanController.java - Plan API for creating, reading, updating and deleting plans.
 *  PlanRepository.java (Interface) - JPARepository file.
 *  PlanApiApplicationTests.java (Tests)
 *
 * @author Calzone (Doc:Griffin c20wnn)
 */

@Entity
@Table(name = "plan")
public class Plan implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "plan_id")
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    @Column(nullable = false, name = "user_id")
    private Long userId;

    @ManyToMany()
    @JoinTable(
            name = "plan_to_belt",
            joinColumns = @JoinColumn(name = "plan_id"),
            inverseJoinColumns = @JoinColumn(name = "belt_id")
    )
    private Set<Belt> belts;

    //Constructor used for Tests.
    protected Plan() {}

    /**
     * Constructor for plan
     *
     * @param id id for workout
     * @param name name for plan
     * @param color color-code for plan
     * @param userId id of user responsible for plan
     */
    public Plan(Long id, String name, Long userId, Set<Belt>belts) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.belts = belts;
    }

    public Long getId() {
        return id;
    }


    public String getName() {
        return name;
    }


    public Long getUserId() {
        return userId;
    }

    public Set<Belt> getBelts() {
        return belts;
    }

    /**
     * checks if any attribute is null, if any attribute is null, return true, else false
     * @return Boolean
     */
    public Boolean hasNullAttributes() {
        return name == null || belts == null || userId == null;
    }

    public Boolean nameIsEmpty() {
        return name.isEmpty();
    }
}
