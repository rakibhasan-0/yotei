package se.umu.cs.pvt.session;

import java.io.Serializable;
import java.util.List;

import se.umu.cs.pvt.workout.detail.ActivityDetail;

public class ExtraActivitiesDTO implements Serializable{
    private String categoryName;
    private Integer categoryOrder;
    private List<ActivityDetail> activities;
    
    public ExtraActivitiesDTO(String categoryName, Integer categoryOrder, List<ActivityDetail> activities) {
        this.categoryName = categoryName;
        this.categoryOrder = categoryOrder;
        this.activities = activities;
    }

    public String getCategoryName() {
        return this.categoryName;
    }

    public Integer getCategoryOrder() {
        return this.categoryOrder;
    }

    public List<ActivityDetail> getActivities() {
        return this.activities;
    }
}
