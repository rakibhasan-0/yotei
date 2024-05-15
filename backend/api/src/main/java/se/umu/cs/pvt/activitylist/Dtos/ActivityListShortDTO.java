package se.umu.cs.pvt.activitylist;

/**
 * DTO model used when returning a list of ActivityList
 * 
 * @author Team Tomato
 * @since 2024-05-08
 * @version 1.0
 */
public class ActivityListShortDTO {
    private Long id;
    private String name;
    private int size;
    private UserShortDTO author;
    private Boolean hidden;

    public ActivityListShortDTO(Long id, String name, int size, UserShortDTO author, Boolean hidden) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.author = author;
        this.hidden = hidden;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getSize() {
        return size;
    }

    public UserShortDTO getAuthor() {
        return author;
    }

    public Boolean getHidden() {
        return hidden;
    }
}
