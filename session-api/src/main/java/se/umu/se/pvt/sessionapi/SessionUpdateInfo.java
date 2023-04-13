package se.umu.se.pvt.sessionapi;

import java.time.LocalTime;

/**
 * Projection interface for information used when updating a session
 */
public interface SessionUpdateInfo {
    String getText();
    Long getWorkout();
    LocalTime getTime();
}
