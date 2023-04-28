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
public class TechniqueDBResult implements Serializable, SearchResponseInterface {

    @Id
    @Column(nullable = false, name = "technique_id")
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    @Id
    @Column(nullable = false, name = "belt_color")
    private String belt_color;

    protected TechniqueDBResult() {}

    public TechniqueDBResult(Long id, String name, String belt_color) {
        this.id = id;
        this.name = name;
        this.belt_color = belt_color;
    }

    /**
     * @return the id
     */
    public Long getId() {
        return id;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @return the belt color
     */
    public String getBelt_color() {
        return belt_color;
    }
}
