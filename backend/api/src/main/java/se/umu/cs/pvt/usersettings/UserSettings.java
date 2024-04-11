package se.umu.cs.pvt.usersettings;

import javax.persistence.*;

/**
 * Model for UserSettings
 *
 * JPA (Java Persistence API)
 *
 * UserSettings.java - This is the Usersettings class for handling users settings between units
 * UserSettingsController.java - Controller for handling user settings.
 * UserSettingsRepository.java (Interface) - JPARepository file.
 * UserToPlan.java - Hold relation between User and Plan.
 * UserToPlanRepository.java (Interface) - JPARepository file.
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
     * Default constructor needed for Springboot,
     * automatically uses the set and get functions after.
     */
    public UserSettings() {
    }

    public void setUser_id(Long user_id) {
        this.user_id = user_id;
    }

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
