package se.umu.cs.pvt.usersettings;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * The test-class for UserSettings class.
 *
 * @author Group 1 - Quattro Formaggio
 */

class UserSettingsTest {

    private UserSettings us;

    /**
     * Set's up the class before each test.
     */
    @BeforeEach
    void setUp() {
        us = new UserSettings();
    }

    /**
     * Checks if setting the id works.
     */
    @Test
    void setUser_id() {
        us.setUser_id(2L);
        assertThat(us.toString().equals("User_id: 2"));
    }

    /**
     * Checks that getting the id works.
     */
    @Test
    void getUser_id() {
        us.setUser_id(2L);
        assertThat(us.getUser_id().equals(2L));
    }
}