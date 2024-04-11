package se.umu.cs.pvt.media;

import javax.persistence.*;
import java.io.Serializable;

/**
 * A media entity for Spring
 *
 * Media.java - Media class
 * MediaController.java - Controller for fetching media.
 * MediaRepository.java - (Interface) Repository for media.
 * @author Dragon Dynasty 
 * date: 2023-05-03
 */
@Entity()
@Table(name = "media")
public class Media implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "media_id")
    private Long id;

    @Column(nullable = false, name = "movement_id")
    private Long movementId;

    @Column(nullable = false, name ="url")
    private String url;

    @Column(nullable = false, name="local_storage")
    private Boolean localStorage;

    @Column(nullable = false, name="image")
    private Boolean image;

    @Column(nullable = true, name="description")
    private String description;

    /**
     * No-args constructor required JPA spec
     */
    protected Media() {
    }

    public Media(Long id, Long movementId, String url,
                 Boolean localStorage, Boolean image, String description ) {
        this.id = id;
        this.movementId = movementId;
        this.url = url;
        this.localStorage = localStorage;
        this.image = image; 
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMovementId() {
        return movementId;
    }

    public void setMovementId(Long technique_id) {
        this.movementId = technique_id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getLocalStorage() {
        return localStorage;
    }

    public void setLocalStorage(Boolean local_storage) {
        this.localStorage = local_storage;
    }

    public Boolean getImage() {
        return image;
    }

    public void setImage(Boolean image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
