package se.umu.cs.pvt.session;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Model for session data in database
 *
 * @author Hawaii
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
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected Session() {
        // no-args constructor required by JPA spec
        // this one is protected since it shouldn't be used directly
    }

    /**
     * Data constructor for Session. Boilerplate
     * @param id Id
     * @param text Optional text displayed in list
     * @param workout Workout ID linked to session
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

    public Session update(SessionUpdateInfo updateInfo){
        return new Session(this.id, updateInfo.getText(), updateInfo.getWorkout(), this.getPlan(), this.getDate(), updateInfo.getTime());
    }

    public boolean invalidFormat(){
        return plan == null || date == null;
    }

    /**
     * Getter for ID
     * @return ID
     */
    public Long getId() {
        return id;
    }

    /**
     * Getter for text
     * @return The text
     */
    public String getText() {
        return text;
    }

    /**
     * Getter for workout id
     * @return The workout ID
     */
    public Long getWorkout() {
        return workout;
    }

    /**
     * Getter for Plan ID
     * @return The Plan ID
     */
    public Long getPlan() {
        return plan;
    }

    /**
     * Getter for held Date
     * @return The date
     */
    public LocalDate getDate() {
        return date;
    }

    /**
     * Getter for the time
     * @return The time
     */
    public LocalTime getTime() {
        return time;
    }

    /**
     * Setter for text
     * @param text New text
     */
    public void setText(String text) {
        this.text = text;
    }

    /**
     * Setter for workout
     * @param workout New workout
     */
    public void setWorkout(Long workout) {
        this.workout = workout;
    }

    /**
     * Setter for plan
     * @param plan New plan
     */
    public void setPlan(Long plan) {
        this.plan = plan;
    }

    /**
     * Setter for date
     * @param date New date
     */
    public void setDate(LocalDate date) {
        this.date = date;
    }

    /**
     * Setter for time
     * @param time New time
     */
    public void setTime(LocalTime time) {
        this.time = time;
    }
}
