package se.umu.cs.pvt.search.interfaces;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

/**
 * This entity represents the object returned
 * from the query sent to the database when
 * searching for plans.
 *
 * @author Minotaur (James Eriksson)
 * @updated 2024-05-21 Added inverted category Team Kiwi (Teodor Bäckström)
 */

@Entity
public class PlanDBResult implements Serializable {

    @Id
    @Column(nullable = false, name = "plan_id")
    private Long plan_id;

    @Column(nullable = false, name = "belt_color")
    private String belt_color;

    @Column(nullable = false, name = "belt_name")
    private String belt_name;

    @Column(nullable = false, name = "is_child")
    private Boolean is_child;

    @Column(nullable = false, name = "is_inverted")
    private Boolean is_inverted;

    @Id
    @Column(nullable = false, name = "session_id")
    private Long session_id;

    @Column(nullable = false, name = "date")
    private String session_date;

    @Column(nullable = false, name = "time")
    private String session_time;

    @Column(nullable = false, name = "text")
    private String session_text;

    protected PlanDBResult() {}

    public PlanDBResult(
            Long plan_id,
            String belt_color,
            String belt_name,
            Boolean is_child,
            Boolean is_inverted,
            Long session_id,
            String session_date,
            String session_time,
            String session_text) {
        this.plan_id = plan_id;
        this.belt_color = belt_color;
        this.belt_name = belt_name;
        this.is_child = is_child;
        this.is_inverted =is_child;
        this.session_id = session_id;
        this.session_date = session_date;
        this.session_time = session_time;
        this.session_text = session_text;
    }

    public Long getPlan_id() {
        return plan_id;
    }

    public String getBelt_color() {
        return belt_color;
    }

    public String getBelt_name() {
        return belt_name;
    }

    public Boolean getIs_child() {
        return is_child;
    }

    public Boolean getIs_inverted(){
        return is_inverted;
    }

    public Long getSession_id() {
        return session_id;
    }

    public String getSession_date() {
        return session_date;
    }

    public String getSession_time() {
        return session_time;
    }

    public String getSession_text() {
        return session_text;
    }
}
