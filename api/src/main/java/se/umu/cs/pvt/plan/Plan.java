package se.umu.cs.pvt.plan;

import javax.persistence.*;
import java.io.Serializable;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

 
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

    private static final String hexColorValidator = "^#([a-fA-F0-9]{6})$";
    private static final Pattern pattern = Pattern.compile(hexColorValidator);


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "plan_id")
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    @Column(nullable = false, name = "color")
    private String color;

    @Column(nullable = false, name = "user_id")
    private Long userId;

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
    public Plan(Long id, String name, String color, Long userId) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.userId = userId;
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


    public Long getUserId() {
        return userId;
    }

    /**
     * checks if any attribute is null, if any attribute is null, return true, else false
     * @return Boolean
     */
    public Boolean hasNullAttributes() {
        return name == null || color == null || userId == null;
    }

    public Boolean nameIsEmpty() {
        return name.isEmpty();
    }

    public Boolean colorIsValid() {

        Matcher matcher = pattern.matcher(color);
        return matcher.matches();
    }
}
