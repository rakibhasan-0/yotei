package se.umu.cs.pvt.workout.detail;

import se.umu.cs.pvt.exercise.Exercise;
import se.umu.cs.pvt.technique.Technique;
import se.umu.cs.pvt.workout.UserShort;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Class that transforms a WorkoutDetail into a response the user expects.
 *
 * @author Grupp 5 Cyclops
 */
public class WorkoutDetailResponse {
    private long id;
    private String name;
    private String description;
    private Long duration;
    private LocalDate created;
    private LocalDate changed;
    private Date date;
    private boolean hidden;
    private UserShort author;
    private List<ActivityResponseContainer> activityCategories;

    private List<TagDetail> tags;

    public WorkoutDetailResponse(WorkoutDetail workoutDetail) {
        id = workoutDetail.getId();
        name = workoutDetail.getName();
        description = workoutDetail.getDesc();
        duration = workoutDetail.getDuration();
        created = workoutDetail.getCreated();
        changed = workoutDetail.getChanged();
        date = workoutDetail.getDate();
        hidden = workoutDetail.getHidden();
        author = new UserShort(
                workoutDetail.getAuthor().getUsername(),
                workoutDetail.getAuthor().getUserId());
        tags = workoutDetail.getTags();

        Map<Pair, List<ActivityDetail>> categoryMapping = workoutDetail.getActivities().stream()
                .collect(Collectors.groupingBy(a -> new Pair(a.getCategoryName(), a.getCategoryOrder())));

        activityCategories = categoryMapping.entrySet().stream()
                .map(p -> {
                    return new ActivityResponseContainer(
                            p.getKey().getName(),
                            p.getKey().getOrder(),
                            p.getValue());
                })
                .toList();
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Long getDuration() {
        return duration;
    }

    public LocalDate getCreated() {
        return created;
    }

    public LocalDate getChanged() {
        return changed;
    }

    public Date getDate() {
        return date;
    }

    public boolean isHidden() {
        return hidden;
    }

    public UserShort getAuthor() {
        return author;
    }

    public List<ActivityResponseContainer> getActivityCategories() {
        return activityCategories;
    }

    public List<TagDetail> getTags() {
        return tags;
    }

    public static class ActivityResponseContainer {
        private String categoryName;
        private int categoryOrder;
        private List<ActivityResponse> activities;

        public ActivityResponseContainer(String categoryName, int categoryOrder, List<ActivityDetail> activities) {
            this.categoryName = categoryName;
            this.categoryOrder = categoryOrder;
            this.activities = activities.stream()
                    .map(a -> {
                        return new ActivityResponse(
                                a.getId(),
                                a.getExercise(),
                                a.getTechnique(),
                                a.getDesc(),
                                a.getName());
                    })
                    .toList();
        }

        public String getCategoryName() {
            return categoryName;
        }

        public int getCategoryOrder() {
            return categoryOrder;
        }

        public List<ActivityResponse> getActivities() {
            return activities;
        }
    }

    public static class ActivityResponse {
        private long id;
        private Exercise exercise;
        private Technique technique;
        private String text;

        private String name;

        public ActivityResponse(long id, Exercise exercise, Technique technique, String text, String name) {
            this.id = id;
            this.exercise = exercise;
            this.technique = technique;
            this.text = text;
            this.name = name;
        }

        public long getId() {
            return id;
        }

        public Exercise getExercise() {
            return exercise;
        }

        public Technique getTechnique() {
            return technique;
        }

        public String getText() {
            return text;
        }

        public String getName() {
            return name;
        }
    }

    private static class Pair {
        private String name;
        private int order;

        public Pair(String name, int order) {
            this.name = name;
            this.order = order;
        }

        public String getName() {
            return name;
        }

        public int getOrder() {
            return order;
        }

        @Override
        public int hashCode() {
            return Objects.hash(name, order);
        }

        @Override
        public boolean equals(Object obj) {
            if (obj == null || !this.getClass().equals(obj.getClass())) {
                return false;
            }
            Pair p = (Pair) obj;
            if(this.name != null){
                return this.name.equals(p.getName()) && this.order == p.getOrder();
            }
            return p.getName() == null && this.getOrder() == p.getOrder();
        }
    }
}
