package se.umu.cs.pvt.activitylist.Dtos;

import se.umu.cs.pvt.workout.UserShort;

/**
 * Dto for user. Used when returning an activity list which contains
 * a list of users that has access to the list, or details about an activity
 * that contains the author.
 * 
 * @author Team Tomato
 * @since 2024-05-12
 * @version 1.0
 */
public class UserShortDTO {
    private Long userId;
    private String username;

    public UserShortDTO(UserShort user) {
        this.userId = user.getUser_id();
        this.username = user.getUsername();
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}