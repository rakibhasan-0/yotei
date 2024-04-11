package se.umu.cs.pvt.session;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Session.java - Model for session data that is used in the database. 
 * AddListInput.java - Is depricated, only used in tests.
 * DateAndTime.java - Should be depricated, is only used in tests and other depricated methods.
 * SessionController.java - Class for handling requests to the session api.
 * SessionRepositiory.java - JpaRepository for the session api. 
 * SessionTimeConverter.java - Converts time from Time to LocalTime but is never used.
 * SessionUpdateInfo.java - Projection interface for information used when updating a session.
 * 
 * @author Hawaii (Doc: Griffins c20jjs)
 */
@Entity
@Table(name = "session")
public class Session implements Serializable, SessionUpdateInfo{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "session_id")
    private Long id;

    @Column(name = "text")
    private String text;

    @Column(name = "workout_id")
    private Long workout;

    @Column(nullable = false, name = "plan_id")
    private Long plan;

    @Column(nullable = false, name = "date")
    private LocalDate date;

    @Column(name = "time")
    private LocalTime time;

    /**
     * No-args constructor required by JPA spec.
     * This one is protected since it shouldn't be used directly.
     */
    protected Session() {}

    /**
     * Data constructor for Session.
     * 
     * @param id Id of the session.
     * @param text Optional text displayed in list.
     * @param workout Workout ID linked to session.
     * @param plan Plan ID for which the session belongs to
     * @param date The date which the session is held
     * @param time The time at which the session is held (Represented in minutes)
     */
    public Session(Long id, String text, Long workout, Long plan, LocalDate date, LocalTime time) {
        this.id = id;
        this.text = text;
        this.workout = workout;
        this.plan = plan;
        this.date = date;
        this.time = time;
    }

    /**
     * Creates and returns a session object.
     * 
     * @param updateInfo Contains the updated information on the session's Text, Workout and Time.
     */
    public Session update(SessionUpdateInfo updateInfo){
        return new Session(this.id, 
                           updateInfo.getText(),
                           updateInfo.getWorkout(), 
                           this.getPlan(), 
                           this.getDate(), 
                           updateInfo.getTime());
    }

    public boolean invalidFormat(){
        return plan == null || date == null;
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public Long getWorkout() {
        return workout;
    }

    public Long getPlan() {
        return plan;
    }

    public LocalDate getDate() {
        return date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setWorkout(Long workout) {
        this.workout = workout;
    }

    public void setPlan(Long plan) {
        this.plan = plan;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }
}
