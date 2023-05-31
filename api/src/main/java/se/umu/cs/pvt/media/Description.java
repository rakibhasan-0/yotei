package se.umu.cs.pvt.media;

/**
 * Class created for holding a new description belonging to a certain media object.
 *
 * @author Dragon Dynasty
 * Date: 2023-05-31
 */
public class Description {

    private Long id;
    private String description;


    Description() {}

    Description(Long id, String description) {
        this.id = id;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
