package se.umu.cs.pvt.workout;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.umu.cs.pvt.tag.TagRepository;
import se.umu.cs.pvt.tag.WorkoutTag;
import se.umu.cs.pvt.tag.WorkoutTagRepository;
import se.umu.cs.pvt.workout.detail.WorkoutDetail;
import se.umu.cs.pvt.workout.detail.WorkoutDetailRepository;
import se.umu.cs.pvt.workout.detail.WorkoutDetailResponse;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * UserWorkout API for creating, reading and deleting workouts.
 *
 * @authors Grupp 8 Kebabpizza (Doc: Griffin ens19amd)
 *         Group 8 Minotaur, new post method.
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/workouts")
public class WorkoutController {
    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private WorkoutFavoriteRepository favoriteRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private WorkoutReviewRepository reviewRepository;

    @Autowired
    private WorkoutDetailRepository workoutDetailRepository;

    @Autowired
    private UserWorkoutRepository userWorkoutRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private WorkoutTagRepository workoutTagRepository;

    @Autowired
    public WorkoutController(WorkoutRepository wc) { this.workoutRepository = wc;}

    public WorkoutController(WorkoutDetailRepository wc){
        this.workoutDetailRepository = wc;
    }
    public WorkoutController(WorkoutFavoriteRepository wc) {
        this.favoriteRepository = wc;
    }

    public WorkoutController(WorkoutReviewRepository repository) {
        this.reviewRepository = repository;
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<WorkoutDetailResponse> getWorkoutDetails(@PathVariable Long id) {
        Optional<WorkoutDetail> workoutOpt = workoutDetailRepository.findById(id);
        if (workoutOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        WorkoutDetail workout = workoutOpt.get();
        return new ResponseEntity<>(new WorkoutDetailResponse(workout), HttpStatus.OK);
    }

    /**
     * Returns the id and name of all workouts in the database.
     *
     * @return a list of all workouts
     * HttpStatus
     * NO_CONTENT if there are no workouts
     * OK if there are workouts
     */
    @GetMapping("/all")
    public ResponseEntity<List<WorkoutShort>> getWorkouts() {
        List<WorkoutShort> workouts = workoutRepository.findAllProjectedBy();
        if (workouts.isEmpty())
            return new ResponseEntity<>(workouts, HttpStatus.NO_CONTENT);
        else
            return new ResponseEntity<>(workouts, HttpStatus.OK);
    }

    /**
     * Fetches all the workouts that are allowed, basically the ones that are not
     * hidden from others (+ your own).
     *
     * @param user_id The id of the user.
     * @return a list of all filtered workouts
     * HttpStatus
     * NO_CONTENT if there are no workouts
     * OK if there are workouts
     * @author c19agi, Alban Gashi
     */
    @GetMapping("/all/{user_id}")
    public ResponseEntity<List<WorkoutShort>> getRelevantWorkouts(@PathVariable("user_id") int user_id) {
        List<WorkoutShort> workouts = workoutRepository.findAllRelevant(Long.valueOf(user_id));
        if (workouts.isEmpty())
            return new ResponseEntity<>(workouts, HttpStatus.NO_CONTENT);
        else
            return new ResponseEntity<>(workouts, HttpStatus.OK);
    }

    /**
     * Returns the description, duration and date created of a workout depending on the id.
     *
     * @param id the id
     * @return the workout's attributes if found.
     * HttpStatus
     * OK if workout with id was found
     * BAD_REQUEST if invalid id
     * NOT_FOUND if id is valid but no workout with id exists
     */
    @GetMapping("/getdesc/{id}")
    public ResponseEntity<WorkoutDropDownProjection> getDescription(@PathVariable("id") Long id) {
        if (id == null)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        else if (workoutRepository.findById(id).isPresent())
            return new ResponseEntity<>(workoutRepository.getWorkoutDropDownById(id).get(), HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Returns a workout depending on the id.
     *
     * @param id the id
     * @return the workout if found.
     * HttpStatus
     * OK if workout with id was found
     * BAD_REQUEST if invalid id
     * NOT_FOUND if id is valid but no workout with id exists
     */
    @GetMapping("/workout/{id}")
    public ResponseEntity<Workout> getWorkout(@PathVariable("id") Long id) {
        if (id == null)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        else if (workoutRepository.findById(id).isPresent())
            return new ResponseEntity<>(workoutRepository.findById(id).get(), HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * This method returns the created workouts of a specific user given a user id.
     *
     * @param userId the user id
     * @return the workout if found.
     * HttpStatus
     * OK if workout with id was found
     * BAD_REQUEST if invalid id
     * NOT_FOUND if id is valid but no workout with id exists
     */
    @GetMapping("/created/{userId}")
    public ResponseEntity<List<WorkoutShort>> getCreatedWorkouts(@PathVariable Long userId) {
        if (Objects.isNull(userId))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        else if (!workoutRepository.findAllByAuthor(userId).isEmpty())
            return new ResponseEntity<>(workoutRepository.findAllByAuthor(userId), HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    /**
     * Adds a workout and related activities to the database.
     *
     * TODO: This method is outdated. And should be removed after integrating
     * the new method.
     *
     * @param data WorkoutDataPackage containing the relevant data.
     *             {
     *             "workout":{"name": "cool_name", "desc": "cool_desc", duration: 2},
     *             <p>
     *             "activeties":[{"exerciseId": 2, "techniqueId": null, "name": "name",
     *             "desc": "desc", "duration": 1, "order": 0}]
     *             }
     * @return the added workout
     * HttpStatus
     * BAD_REQUEST if invalid workout
     * CREATED if the workout was added
     */
    @PostMapping("/add_full_workout")
    public ResponseEntity<Workout> postFullWorkout(@RequestBody WorkoutDataPackage data) {
        Workout workout = data.getWorkout();
        Activity[] activities = data.getActivities();

        if (workout == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        workout = workoutRepository.save(workout);

        //Links the activities to the workout id and saves them.
        for (Activity activity : activities) {
            activity.setWorkoutId(workout.getId());
            activityRepository.save(activity);
        }

        return new ResponseEntity<>(workout, HttpStatus.CREATED);
    }

    /**
     * Method for creating a workout. Will handle
     *  Adding the workout
     *  Adding the Activities
     *  Adding the users related to the workout.
     *  Adding tags related to the workout
     *
     * @param data
     * @return String with status on operations and https response.
     */
    @Transactional
    @PostMapping("/")
    public ResponseEntity<String> postWorkout(@RequestBody WorkoutDataPackage data) {
        //Extract data from object.
        Workout workout = data.getWorkout();
        workout.setCreated(LocalDate.now());
        workout.setChanged(LocalDate.now());

        Activity[] activities = data.getActivities();

        try {
            workout = workoutRepository.save(workout);
        }catch (Exception e) {
            return new ResponseEntity<>("Failed to create workout" , HttpStatus.BAD_REQUEST);
        }

        //Links the activities to the workout id and saves them.
        for (Activity activity : activities) {
            activity.setWorkoutId(workout.getId());
            try {
                activityRepository.save(activity);
            }catch (Exception e) {
                System.out.println("Failed to add activity");
                return new ResponseEntity<>("Failed to add activity" , HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        //Add users to workout
        for (Long user : data.getUsers()) {
            try {
                userWorkoutRepository.save(new UserWorkout(user, workout.getId()));
            }catch (Exception e) {
                System.out.println("Failed to add user");
                return new ResponseEntity<>("Failed to add user" , HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        //Add tags related to workout
        for (Long tagId : data.getTagIds()) {
            try {
                WorkoutTag toAddWorkoutTag = new WorkoutTag(workout.getId(),
                        tagRepository.findById(tagId).get());
                workoutTagRepository.save(toAddWorkoutTag);
            }catch (Exception e) {
                System.out.println("Failed to tag to workout");
                return new ResponseEntity<>("Failed to add tag to workout " , HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("Succeed to create workout", HttpStatus.CREATED);
    }

    /**
     * Deletes a workout depending on the id.
     *
     * @param id the id
     * @return the id
     * HttpStatus
     * OK if workout with id exists
     * BAD_REQUEST if id is not valid
     * NOT FOUND if id is valid but not found
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Long> deleteWorkout(@PathVariable("id") Long id) {
        if (id == null) {
            return new ResponseEntity<>(id, HttpStatus.BAD_REQUEST);
        } else if (workoutRepository.findById(id).isPresent()) {
            workoutRepository.deleteById(id);
            return new ResponseEntity<>(id, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(id, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Deletes a workout and related activities depending on the id.
     *
     * @param id the id
     * @return the id
     * HttpStatus
     * OK if workout with id exists
     * BAD_REQUEST if id is not valid
     * NOT FOUND if id is valid but not found
     */
    @DeleteMapping("/delete_full_workout/{id}")
    public ResponseEntity<Long> deleteFullWorkout(@PathVariable("id") Long id) {
        if (id == null) {
            return new ResponseEntity<>(id, HttpStatus.BAD_REQUEST);
        } else if (workoutRepository.findById(id).isPresent()) {
            //Delete old activities
            List<Activity> activities = activityRepository.findAllByWorkoutId(id);
            activityRepository.deleteAll(activities);
            //Delete workout
            workoutRepository.deleteById(id);

            return new ResponseEntity<>(id, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(id, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Updates an existing workout in the database.
     *
     * @param toUpdate The updated workout.
     *                 {"id" : 1, "name": "cool_name", "desc": "cool_desc", duration: 2}
     * @return the updated workout.
     * HttpStatus
     * OK if workout with id exists
     * BAD_REQUEST if workout has invalid id
     * NOT_FOUND if workout has valid id but could not be found
     */
    @PutMapping("/update")
    public ResponseEntity<Workout> updateWorkout(@RequestBody Workout toUpdate) {
        if (toUpdate == null || toUpdate.getId() == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } else if (workoutRepository.findById(toUpdate.getId()).isPresent()) {
            workoutRepository.save(toUpdate);
            return new ResponseEntity<>(toUpdate, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(toUpdate, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Updates an existing workout and replaces related activities in the database.
     *
     * @param data WorkoutDataPackage containing the relevant data.
     *             {
     *             "workout":{"id" : 1, "name": "cool_name", "desc": "cool_desc", duration: 2},
     *             <p>
     *             "activeties":[{"id": 10, "workoutId": 1, "exerciseId": 2, "techniqueId": null,
     *             "name": "name", "desc": "desc", "duration": 1, "order": 0}]
     *             }
     * @return the updated workout.
     * HttpStatus
     * OK if workout with id exists
     * BAD_REQUEST if workout has invalid id
     * NOT_FOUND if workout has valid id but could not be found
     */
    @PutMapping("/update_full_workout")
    public ResponseEntity<Workout> updateFullWorkout(@RequestBody WorkoutDataPackage data) {
        Workout workout = data.getWorkout();
        Activity[] activities = data.getActivities();

        if (workout == null || workout.getId() == null) {
            return new ResponseEntity<>(workout, HttpStatus.BAD_REQUEST);
        } else if (workoutRepository.findById(workout.getId()).isPresent()) {
            //Delete old activities
            List<Activity> oldActivities = activityRepository.findAllByWorkoutId(workout.getId());
            activityRepository.deleteAll(oldActivities);

            //Update workout
            workoutRepository.save(workout);

            //Add new activities
            activityRepository.saveAll(Arrays.asList(activities));

            return new ResponseEntity<>(workout, HttpStatus.OK);

        } else {
            return new ResponseEntity<>(workout, HttpStatus.NOT_FOUND);
        }
    }


    /**
     * Adds a workout to the table of favorite workouts in database.
     *
     * @param favorite the favorite entity:
     *                 {"userId": 1, "workoutId": 2}
     * @return the favorite entity.
     * HttpStatus
     * BAD_REQUEST if workout could not be added to the table with favorite workouts
     * CREATED if the workout is successfully added to the table with favorite workouts
     */
    @PostMapping("/favorites")
    public ResponseEntity<WorkoutFavorite> markAsFavorite(@RequestBody WorkoutFavorite favorite) {
        if (favorite == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } else {
            favoriteRepository.save(favorite);
            return new ResponseEntity<>(favorite, HttpStatus.CREATED);
        }
    }

    /**
     * Removes a workout from the table of favorite workouts in database.
     *
     * @param favorite the favorite entity
     *                 {"userId": 1, "workoutId": 2}
     * @return the favorite entity.
     * HttpStatus
     * BAD_REQUEST if the workout could not be found in the table with favorite workouts
     * OK if the workout is successfully removed from the table with favorite workouts
     */
    @DeleteMapping("/favorites")
    public ResponseEntity<WorkoutFavorite> removeFavorite(@RequestBody WorkoutFavorite favorite) {
        if (favorite == null || favoriteRepository.findById(favorite).isEmpty()) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        favoriteRepository.deleteById(favorite);

        return new ResponseEntity<>(favorite, HttpStatus.OK);
    }

    /**
     * Get a list of all workouts that is marked as favorites.
     *
     * @param userId the user id
     * @return a list of workouts
     */
    @GetMapping("/favorites/{userId}")
    public List<Workout> getFavorites(@PathVariable int userId) {
        return workoutRepository.findAllFavorites(userId);
    }

    /**
     * Gets the state of a specific workout.
     *
     * @param userId the user id
     * @return true if a workout is favorited, false otherwise
     */
    @GetMapping("/favorites/{userId}/{workoutId}")
    public boolean getFavoriteById(@PathVariable int userId, @PathVariable int workoutId) {
        Predicate<Workout> filterByWorkoutId = workout -> workout.getId() == workoutId;
        List<Workout> result = workoutRepository.findAllFavorites(userId).stream().filter(filterByWorkoutId).collect(Collectors.toList());
        return !result.isEmpty();
    }


    /**
     * A method that is used to retrieve reviews from the database.
     *
     * @param id The id of the workout to retrieve reviews for.
     * @return ResponseEntity with the review information and HttpStatus OK.
     */
    @GetMapping("/reviews")
    public ResponseEntity<Object> getReviewsForWorkout(@RequestParam int id) {
        List<WorkoutReviewReturnInterface> list = reviewRepository.findReviewsForWorkout(id);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    /**
     * A method for inserting a review into the database.
     *
     * @param review The review to insert.
     * @return The inserted review.
     */
    @PostMapping("/reviews")
    public ResponseEntity<Object> insertReviewForWorkout(@RequestBody WorkoutReview review) {
        reviewRepository.save(review);
        return new ResponseEntity<>(review, HttpStatus.OK);
    }

    /**
     * A method for deleting a review from the database
     *
     * @param id The id for the review to delete
     * @return the id
     * HttpStatus
     * OK if workout with id exists
     * BAD_REQUEST if id is not valid
     * NOT FOUND if id is valid but not found
     */
    @DeleteMapping("/reviews")
    public ResponseEntity<Long> deleteReview(@RequestParam("id") Long id) {
        if (id == null) {
            return new ResponseEntity<>(id, HttpStatus.BAD_REQUEST);
        } else if (reviewRepository.findById(id).isPresent()) {
            reviewRepository.deleteById(id);
            return new ResponseEntity<>(id, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(id, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * A method for updating a review in the database
     *
     * @param review The review to update
     * @return the id
     * HttpStatus
     * OK if workout with id exists
     * BAD_REQUEST if id is not valid
     * NOT FOUND if id is valid but not found
     */
    @PutMapping("/reviews")
    public ResponseEntity<Object> updateReview(@RequestBody WorkoutReview review) {
        if (review == null || review.getId() == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } else if (reviewRepository.findById(review.getId()).isPresent()) {
            reviewRepository.save(review);
            return new ResponseEntity<>(review, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(review, HttpStatus.NOT_FOUND);
        }
    }
}

/**
 * Package containing data needed to update a workout.
 *
 * @author Grupp 8 Kebabpizza
 */
class WorkoutDataPackage {
    private Workout workout;
    private Activity[] activities;
    private Long[] users;
    private Long[]  tagIds;

    /**
     *
     * @return List of user ids
     */
    public Long[] getUsers() { return users; }

    /**
     *
     * @return List of tags
     */
    public Long[] getTagIds() { return tagIds; }

    /**
     * @return Workout to update
     */
    public Workout getWorkout() {
        return workout;
    }

    /**
     * @return Activities to update
     */
    public Activity[] getActivities() {
        return activities;
    }
}
