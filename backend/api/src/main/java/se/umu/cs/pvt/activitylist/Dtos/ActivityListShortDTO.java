package se.umu.cs.pvt.activitylist.Dtos;

/**
 * DTO model used when returning a list of ActivityList with the neccessary
 * information.
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
    private Boolean isShared;

    public ActivityListShortDTO(Long id, String name, int size, UserShortDTO author, Boolean hidden, Boolean isShared) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.author = author;
        this.hidden = hidden;
        this.isShared = isShared;
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

    public Boolean getIsShared() {
        return isShared;
    }

    public void setIsShared(Boolean isShared) {
        this.isShared = isShared;
    }
}
