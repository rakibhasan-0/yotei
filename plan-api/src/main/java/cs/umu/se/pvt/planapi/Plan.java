package cs.umu.se.pvt.planapi;

import java.io.Serializable;
import javax.persistence.*;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * Model for plan data in database
 *
 * @author Calzone
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

    /**
     * @return id
     */
    public Long getId() {
        return id;
    }

    /**
     * @return name of plan
     */
    public String getName() {
        return name;
    }

    /**
     * @return color of plan
     */
    public String getColor() {
        return color;
    }

    /**
     * @return user id
     */
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
