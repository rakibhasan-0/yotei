package se.umu.cs.pvt.search.interfaces;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

/**
 * This entity represents the object returned
 * from the query sent to the database when
 * searching for tags.
 *
 * @author Kraken (Oskar Westerlund Holmgren) 2023-05-03
 */

@Entity
public class TagDBResult implements Serializable, SearchResponseInterface {

    @Id
    @Column(nullable = false, name = "tag_id")
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;


    protected TagDBResult() {}

	public TagDBResult(Long id, String name) {
        this.id = id;
        this.name = name;
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
}