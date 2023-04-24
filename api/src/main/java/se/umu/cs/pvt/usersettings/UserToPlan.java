package se.umu.cs.pvt.usersettings;

import javax.persistence.*;

/**
 * Class to hold relation between User and Plan.
 *
 * @author Group 1 - Quattro Formaggio
 */

@Entity
@Table(name = "user_to_plan")
public class UserToPlan {

    @Id
    @Column(nullable = false, name = "user_id")
    private Long user_id;

    @Column(nullable = false, name = "plan_id")
    private Long plan_id;

    /**
     * Default constructor class for Bootspring.
     */
    public UserToPlan() {
    }

    /**
     * Amazing constructor that implements the integer Longs.
     * @param user_id The long to be set.
     * @param plan_id The long to be set.
     */
    public UserToPlan(Long user_id, Long plan_id) {
        this.user_id = user_id;
        this.plan_id = plan_id;
    }

    /**
     * Sets the user ID from table.
     * @param user_id the id of the user.
     */
    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    /**
     * Gets the user ID from table.
     */
    public Long getUser_id() {
        return user_id;
    }

    /**
     * Gets the plan ID from table.
     * @param plan_id the id of the plan.
     */
    public void setPlan_id(Long plan_id) {
        this.plan_id = plan_id;
    }

    /**
     * Gets the plan ID from table.
     */
    public Long getPlan_id() {
        return plan_id;
    }

    /**
     * Gets the userplan combined ID.
     *
     * @return The id of userplan.
     */

}
