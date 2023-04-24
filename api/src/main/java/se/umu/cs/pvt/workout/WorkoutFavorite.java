package se.umu.cs.pvt.workout;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import java.io.Serializable;
import java.util.Objects;

@Entity
@IdClass(WorkoutFavorite.class)
public class WorkoutFavorite implements Serializable {
    @Id
    private int userId;
    @Id
    private int workoutId;

    public int getUserId() {
        return userId;
    }

    public int getWorkoutId() {
        return workoutId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WorkoutFavorite that = (WorkoutFavorite) o;
        return userId == that.userId && workoutId == that.workoutId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, workoutId);
    }
}
