/**
 * The TechniqueTag entity.
 * @Author Team 5 Verona
 */
package se.umu.cs.pvt.tag;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Model for technique_tag data in database
 */
@Entity
@Table(name = "technique_tag")
public class TechniqueTag implements Serializable { 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "techtag_id")
    private Long techTagId;

    @Column(nullable = false, name = "tech_id")
    private Long techId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tag_id")
    private Tag tag;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected TechniqueTag() {}

    /**
     * Creates a TechniqueTag.
     * 
     * @param techId Id of the technique
     */
    public TechniqueTag(Long techId) {
        this.techId = techId;
    }
    
    /**
     * Get the technique Id.
     * 
     * @return The technique Id.
     */
    
    public Long getTechId() {
        return techId;
    }

    /**
     * Gets the tag Id.
     * @return Id.
     */
    public Long getTag() {
        return tag.getId();
    }

    /**
     * Sets the tag.
     * @param tag
     */
    public void setTag(Tag tag) {
        this.tag = tag;
    }

    /**
     * @return tag object
     */
    public Tag getTagObject() {
        return tag;
    }

    /**
     * @param techId new techId
     */
    public void setTechId(Long techId) {
        this.techId = techId;
    }
}
