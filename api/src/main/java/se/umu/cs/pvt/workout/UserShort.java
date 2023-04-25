package se.umu.cs.pvt.workout;

import javax.persistence.*;

/**
 * Minimal data structure for user
 *
 * @author Grupp 2 Cappriciosa
 */
@Entity
@Table(name = "user_table")
public class UserShort {

    /**
     * The id for the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "user_id")
    private Long user_id;

    /**
     * The username for the user.
     */
    @Column(nullable = false, name = "username")
    private String username;


    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    public UserShort() {}

    public Long getUser_id() {
        return user_id;
    }

    public String getUsername() {
        return username;
    }
}
