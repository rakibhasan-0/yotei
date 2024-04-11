/**
 * The Tag entity.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.export;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Represents a tag export entity.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
@Entity
@Table(name = "tag")
public class TagExport implements Serializable{
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "tag_id")
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected TagExport() {}

    /**
     * Creates a tag.
     * @param id Id of the tag.
     * @param name Name of the tag.
     */
    public TagExport(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    /**
     * Get Id of the Tag.
     * @return The TagId.
     */
    public Long getId() {
        return id;
    }

    /**
     * Get the name of the Tag.
     * @return The TagName.
     */
    public String getName() {
        return name;
    }

}
