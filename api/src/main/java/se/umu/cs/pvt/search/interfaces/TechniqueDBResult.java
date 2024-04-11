package se.umu.cs.pvt.search.interfaces;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

/**
 * This entity represents the object returned
 * from the query sent to the database when
 * searching for techniques.
 *
 * @author Minotaur (James Eriksson)
 */

@Entity
public class TechniqueDBResult implements Serializable {

    @Id
    @Column(nullable = false, name = "technique_id")
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    @Id
    @Column(name = "belt_color")
    private String belt_color;

    @Id
    @Column(columnDefinition = "BOOLEAN DEFAULT false",name = "is_child")
    private Boolean is_child;

    @Column(name = "belt_name")
    private String belt_name;

    protected TechniqueDBResult() {}

    public TechniqueDBResult(Long id, String name, String belt_color, boolean is_child, String belt_name) {
        this.id = id;
        this.name = name;
        this.belt_color = belt_color;
        this.is_child = is_child;
        this.belt_name = belt_name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
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
}
