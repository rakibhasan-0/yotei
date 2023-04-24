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
     * Default constructor class for Springboot.
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

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    public Long getUser_id() {
        return user_id;
    }

    public void setPlan_id(Long plan_id) {
        this.plan_id = plan_id;
    }

    public Long getPlan_id() {
        return plan_id;
    }


}
