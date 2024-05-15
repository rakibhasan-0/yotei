package se.umu.cs.pvt.activitylist;

import java.util.Set;

public class AddActivityListRequest {
    private Long id;
    private String name;
    private String description;
    private Boolean hidden;
    private Set<Long> users;
    private Set<ActivityRequest> activities;

    public boolean hasNullFields() {
        return name == null || hidden == null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesc() {
        return description;
    }

    public void setUsers(Set<Long> users) {
        this.users = users;
    }

    public Set<Long> getUsers() {
        return users;
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
