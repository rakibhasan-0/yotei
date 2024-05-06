package se.umu.cs.pvt.tag;

import javax.persistence.*;
import java.io.Serializable;

/**
 * The TechniqueTag entity.
 * Model for technique_tag data in database.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn)
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
     * @param   techId      ID of the Technique.
     */
    public TechniqueTag(Long techId, Tag tag) {
        this.techId = techId;
        this.tag = tag;
    }
    
    public TechniqueTag(Long techId) {
        this.techId = techId;
    }


    /**
     * Get the technique ID.
     *
     * @return          The Technique ID.
     */
    public Long getTechId() {
        return techId;
    }


    /**
     * Gets the Tag ID.
     *
     * @return          The Tag ID.
     */
    public Long getTag() {
        return tag.getId();
    }


    public void setTag(Tag tag) {
        this.tag = tag;
    }


    /**
     * Gets the Tag object.
     *
     * @return          The Tag object.
     */
    public Tag getTagObject() {
        return tag;
    }


    public void setTechId(Long techId) {
        this.techId = techId;
    }
}
