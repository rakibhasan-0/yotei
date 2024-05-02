/**
 * The Tag entity.
 *
 * ExerciseTag              - The ExcerciseTag entity, model for exercise_tag data in database.
 * ExerciseTagContoller     - API controller for managing ExerciseTag API calls.
 * ExerciseTagMap           - Mapping between exercise and tags, used to import functions for exercise-tags.
 * ExerciseTagRepository    - Repository used for the ExerciseTag entities. Based on Spring JPA Repository.
 * ExerciseTagShort         - Projection of the ExerciseTag entity that only returns the ID of the Exercise from
 *                            the exercise-tag pair.
 * ExerciseTagShortId       - Projection of the ExerciseTag entity that only returns the ID of the Tag from the
 *                            exercise-tag pair.
 *
 *
 * Tag                      - The Tag entity, model for tag data in database.
 * TagController            - API controller for managing Tag API calls.
 * TagRepository            - Repository used for the Tag entities. Based on Spring JPA Repository.
 * TagShort                 - Projection of the Tag entity that only returns the ID of the tag.
 *
 *
 * TechniqueTag             - Technique tag entity - model for technique_tag data in database.
 * TechniqueTagController   - API controller for managing TechniqueTag API calls.
 * TechniqueTagMap          - Mapping between technique and tags, used to import functions for technique-tags.
 * TechniqueTagRepository   - Repository used for the TechniqueTag entities. Based on Spring JPA Repository.
 * TechniqueTagShort        - Projection of the TechniqueTag entity that only returns the ID of the Technique from
 *                            the related technique-tag pair.
 * TechniqueTagShortId      - Projection of the TechniqueTag entity that only returns the ID of the Tag from
 *                            the techinque-tag pair.
 *
 *
 * WorkoutTag               - Workout entity - model for workout_tag data in database.
 * WorkoutTagController     - API controller for managing WorkoutTag API calls.
 * WorkoutTagRepository     - Repository used for the WorkoutTag entities. Based on JPA Repository.
 * WorkoutTagShort          - Projection of the WorkoutTag entity that only returns the ID of the Workout from
 *                            the workout-tag pair.
 * WorkoutTagShortId        - Projection of the WorkoutTag entity that only returns the ID of the Tag from the
 *                            workout-tag pair.
 *
 * @Author Team 5 Verona (Doc: Griffin dv21jjn), Team 3 (Durian)
 * @since 2024-05-02
 */
package se.umu.cs.pvt.tag;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;


@Entity
@Table(name = "tag")
public class Tag implements Serializable{
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "tag_id")
    private Long id;

    @Column(nullable = false, name = "name")
    private String name;

    @OneToMany(mappedBy = "tag",
                cascade = CascadeType.ALL)
    private List<WorkoutTag> workoutTags;
    
    @OneToMany(mappedBy = "tag",
                cascade = CascadeType.ALL)
    private List<ExerciseTag> exerciseTags;

    @OneToMany(mappedBy = "tag",
                cascade = CascadeType.ALL)
    private List<TechniqueTag> techniqueTags;

    /**
     * no-args constructor required by JPA spec
     * this one is protected since it shouldn't be used directly
     */
    protected Tag() {}

    /**
     * Creates a Tag.
     *
     * @param   id      Id of the Tag.
     * @param   name    Name of the Tag.
     */
    public Tag(Long id, String name) {
        this.id = id;
        this.name = name;
    }


    public Long getId() {
        return id;
    }


    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
	/*
	 * Set Tag name to lowercase.
	 */
	public void nameToLowerCase()
	{
		name = name.toLowerCase();
	}
    @Override
    public String toString() {
        return "Tag{id=" + id + ", name='" + name + "'}";
    }
}
