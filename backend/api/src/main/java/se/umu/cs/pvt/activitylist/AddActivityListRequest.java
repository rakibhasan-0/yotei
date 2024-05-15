package se.umu.cs.pvt.activitylist;

import java.util.Set;

public class AddActivityListRequest {
    private Long author;
    private String name;
    private String description;
    private Boolean hidden;
    private Set<ActivityRequest> activities;

    public boolean hasNullFields() {
        return author == null || name == null || hidden == null;
    }

    public Long getAuthor() {
        return author;
    }

    public void setAuthor(Long author) {
        this.author = author;
    }

    public String getName() {
        return name;
    }

    public String getDesc() {
        return description;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDesc(String desc) {
        this.description = desc;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    public Set<ActivityRequest> getActivities() {
        return activities;
    }

    public void setActivities(Set<ActivityRequest> activities) {
        this.activities = activities;
    }

    public static class ActivityRequest {
        private String type; // Can be "exercise" or "technique"
        private Long id;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }
    }
}
