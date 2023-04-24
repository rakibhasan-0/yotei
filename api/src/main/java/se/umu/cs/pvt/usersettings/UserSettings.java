package se.umu.cs.pvt.usersettings;

import javax.persistence.*;

/**
 * This is the Usersettings class for handling users settings between units
 * that are then saved inside the database.
 *
 * @author Group 1 - Quattro Formaggio
 */
@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "user_id")
    private Long user_id;

    /**
     * Default constructor needed for Bootspring,
     * automatically uses the set and get functions after.
     */
    public UserSettings() {
    }

    /**
     * Sets the user_id.
     *
     * @param user_id The id to be set.
     */
    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

    /**
     * Gets the user's ID.
     *
     * @return The ID that is returned.
     */
    public Long getUser_id() {
        return user_id;
    }

    /**
     * Takes the user settings and prints it out as a string.
     *
     * @return The class in string format.
     */
    @Override
    public String toString() {return String.format("User_id: {%s}", this.user_id); }
}
