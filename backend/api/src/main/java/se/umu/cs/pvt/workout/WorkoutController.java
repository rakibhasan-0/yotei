package se.umu.cs.pvt.workout;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.web.bind.annotation.*;

import com.auth0.jwt.interfaces.DecodedJWT;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.*;
import se.umu.cs.pvt.exercise.Exercise;
import se.umu.cs.pvt.exercise.ExerciseRepository;
import se.umu.cs.pvt.tag.Tag;
import se.umu.cs.pvt.technique.Technique;
import se.umu.cs.pvt.technique.TechniqueRepository;
import se.umu.cs.pvt.user.JWTUtil;
import se.umu.cs.pvt.tag.TagRepository;
import se.umu.cs.pvt.tag.WorkoutTag;
import se.umu.cs.pvt.tag.WorkoutTagRepository;
import se.umu.cs.pvt.workout.detail.WorkoutDetail;
import se.umu.cs.pvt.workout.detail.WorkoutDetailRepository;
import se.umu.cs.pvt.workout.detail.WorkoutDetailResponse;
import java.util.*;
import java.time.LocalDate;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * UserWorkout API for creating, reading and deleting workouts.
 *
 * @author Grupp 8 Kebabpizza (Doc: Griffin ens19amd)
 *         Group 8 Minotaur, new post method.
 *         Team Tomato
 * @updated 2024-04-23 by Team Tomato
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
    private TechniqueRepository techniqueRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private UserWorkoutRepository userWorkoutRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private WorkoutTagRepository workoutTagRepository;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    public WorkoutController(WorkoutRepository wc) {
        this.workoutRepository = wc;
    }

    public WorkoutController(WorkoutDetailRepository wc) {
        this.workoutDetailRepository = wc;
    }

    public WorkoutController(WorkoutFavoriteRepository wc) {
        this.favoriteRepository = wc;
    }

    public WorkoutController(WorkoutReviewRepository repository) {
        this.reviewRepository = repository;
    }

    @Operation(summary = "Returns the workout with the specified id", description = "The workout must be public or the user needs to be an admin or been assigned access to it")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK - Successfully retrieved"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Token does not exist or is not valid"),
            @ApiResponse(responseCode = "404", description = "Not found - if workout with id does not exist or user does not have permission")
    })
    @GetMapping("/detail/{id}")
    public ResponseEntity<WorkoutDetailResponse> getWorkoutDetails(@RequestHeader(value = "token") String token,
            @PathVariable Long id) {
        int userId;
        Long userIdL;

        try {
            DecodedJWT jwt = jwtUtil.validateToken(token);
            userId = jwt.getClaim("userId").asInt();
            userIdL = Long.valueOf(userId);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Optional<WorkoutDetail> workoutOpt = workoutDetailRepository.findWorkoutByIdAndUserAccess(id, userIdL);

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
     *         HttpStatus
     *         NO_CONTENT if there are no workouts
     *         OK if there are workouts
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
     *         HttpStatus
     *         NO_CONTENT if there are no workouts
     *         OK if there are workouts
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
     * Returns the description, duration and date created of a workout depending on
     * the id.
     *
     * @param id the id
     * @return the workout's attributes if found.
     *         HttpStatus
     *         OK if workout with id was found
     *         BAD_REQUEST if invalid id
     *         NOT_FOUND if id is valid but no workout with id exists
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
     *         HttpStatus
     *         OK if workout with id was found
     *         BAD_REQUEST if invalid id
     *         NOT_FOUND if id is valid but no workout with id exists
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
     *         HttpStatus
     *         OK if workout with id was found
     *         BAD_REQUEST if invalid id
     *         NOT_FOUND if id is valid but no workout with id exists
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
     *             "workout":{"name": "cool_name", "desc": "cool_desc", duration:
     *             2},
     *             <p>
     *             "activeties":[{"exerciseId": 2, "techniqueId": null, "name":
     *             "name",
     *             "desc": "desc", "duration": 1, "order": 0}]
     *             }
     * @return the added workout
     *         HttpStatus
     *         BAD_REQUEST if invalid workout
     *         CREATED if the workout was added
     */
    @PostMapping("/add_full_workout")
    public ResponseEntity<Workout> postFullWorkout(@RequestBody WorkoutDataPackage data) {
        Workout workout = data.getWorkout();
        Activity[] activities = data.getActivities();

        if (workout == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        workout = workoutRepository.save(workout);

        // Links the activities to the workout id and saves them.
        for (Activity activity : activities) {
            activity.setWorkoutId(workout.getId());
            activityRepository.save(activity);
        }

        return new ResponseEntity<>(workout, HttpStatus.CREATED);
    }

    /**
     * Method for creating a workout. Will handle
     * Adding the workout
     * Adding the Activities
     * Adding the users related to the workout.
     * Adding tags related to the workout
     *
     * @param data
     * @return String with status on operations and https response.
     */
    @Transactional
    @PostMapping("")
    public ResponseEntity<WorkoutResponse> postWorkout(@RequestBody WorkoutDataPackage data) {
        Workout workout = data.getWorkout();
        workout.setCreated(LocalDate.now());
        workout.setChanged(LocalDate.now());
        Activity[] activities = data.getActivities();

        try {
            workout = workoutRepository.save(workout);

            for (Activity activity : activities) {
                activity.setWorkoutId(workout.getId());
                activityRepository.save(activity);
            }

            for (Long user : data.getUsers()) {
                userWorkoutRepository.save(new UserWorkout(user, workout.getId()));
            }

            for (Long tagId : data.getTagIds()) {
                Optional<Tag> tag = tagRepository.findById(tagId);
                if (tag.isPresent())
                    workoutTagRepository.save(new WorkoutTag(workout.getId(), tag.get()));
            }
        } catch (Exception e) {
            return new ResponseEntity<>(new WorkoutResponse(e.getMessage(), workout.getId(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value()), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(new WorkoutResponse("Succeed to create workout",
                workout.getId(), HttpStatus.CREATED.value()), HttpStatus.CREATED);
    }

    /**
     * Method for updating a workout.
     * 
     * @param data Object containing data related to workouts
     * @return String containing status of operations and http response.
     */
    @Transactional
    @PutMapping("")
    public ResponseEntity<WorkoutResponse> updateWorkout(@RequestBody WorkoutDataPackage data) {
        Workout workout = data.getWorkout();
        Long workoutId = workout.getId();
        Activity[] activities = data.getActivities();

        if (workoutRepository.findById(workoutId).isEmpty()) {
            return new ResponseEntity<>(new WorkoutResponse("The Workout entered does not exist.", workoutId,
                    HttpStatus.BAD_REQUEST.value()), HttpStatus.BAD_REQUEST);
        }

        try {
            workout.setChanged(LocalDate.now());
            workoutRepository.save(workout);

            List<Activity> oldActivities = activityRepository.findAllByWorkoutId(workoutId);
            activityRepository.deleteAll(oldActivities);
            activityRepository.flush();
            for (Activity activity : activities) {
                activity.setWorkoutId(workoutId);
                activityRepository.save(activity);
            }

            List<WorkoutTag> oldTags = workoutTagRepository.findByWorkId(workoutId);
            workoutTagRepository.deleteAll(oldTags);
            workoutTagRepository.flush();
            for (Long tagId : data.getTagIds()) {
                Optional<Tag> tag = tagRepository.findById(tagId);
                tag.ifPresent(value -> workoutTagRepository.save(new WorkoutTag(workoutId, value)));
            }

            List<UserWorkout> oldUsers = userWorkoutRepository.findAllByWorkoutId(workoutId);
            userWorkoutRepository.deleteAll(oldUsers);
            userWorkoutRepository.flush();
            for (Long user : data.getUsers()) {
                userWorkoutRepository.save(new UserWorkout(user, workoutId));
            }
        } catch (Exception e) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return new ResponseEntity<>(new WorkoutResponse(e.getMessage(), workoutId,
                    HttpStatus.INTERNAL_SERVER_ERROR.value()), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(new WorkoutResponse("Successfully updated the workout.",
                workoutId, HttpStatus.OK.value()), HttpStatus.OK);
    }

    /**
     * Deletes a workout depending on the id.
     *
     * @param id the id
     * @return the id
     *         HttpStatus
     *         OK if workout with id exists
     *         BAD_REQUEST if id is not valid
     *         NOT FOUND if id is valid but not found
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
     *         HttpStatus
     *         OK if workout with id exists
     *         BAD_REQUEST if id is not valid
     *         NOT FOUND if id is valid but not found
     */
    @DeleteMapping("/delete_full_workout/{id}")
    public ResponseEntity<Long> deleteFullWorkout(@PathVariable("id") Long id) {
        if (id == null) {
            return new ResponseEntity<>(id, HttpStatus.BAD_REQUEST);
        } else if (workoutRepository.findById(id).isPresent()) {
            // Delete old activities
            List<Activity> activities = activityRepository.findAllByWorkoutId(id);
            activityRepository.deleteAll(activities);
            // Delete workout
            workoutRepository.deleteById(id);

            return new ResponseEntity<>(id, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(id, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Updates an existing workout and replaces related activities in the database.
     *
     * @param data WorkoutDataPackage containing the relevant data.
     *             {
     *             "workout":{"id" : 1, "name": "cool_name", "desc": "cool_desc",
     *             duration: 2},
     *             <p>
     *             "activeties":[{"id": 10, "workoutId": 1, "exerciseId": 2,
     *             "techniqueId": null,
     *             "name": "name", "desc": "desc", "duration": 1, "order": 0}]
     *             }
     * @return the updated workout.
     *         HttpStatus
     *         OK if workout with id exists
     *         BAD_REQUEST if workout has invalid id
     *         NOT_FOUND if workout has valid id but could not be found
     */
    @PutMapping("/update_full_workout")
    public ResponseEntity<Workout> updateFullWorkout(@RequestBody WorkoutDataPackage data) {
        Workout workout = data.getWorkout();
        Activity[] activities = data.getActivities();

        if (workout == null || workout.getId() == null) {
            return new ResponseEntity<>(workout, HttpStatus.BAD_REQUEST);
        } else if (workoutRepository.findById(workout.getId()).isPresent()) {
            // Delete old activities
            List<Activity> oldActivities = activityRepository.findAllByWorkoutId(workout.getId());
            activityRepository.deleteAll(oldActivities);

            // Update workout
            workoutRepository.save(workout);

            // Add new activities
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
     *         HttpStatus
     *         BAD_REQUEST if workout could not be added to the table with favorite
     *         workouts
     *         CREATED if the workout is successfully added to the table with
     *         favorite workouts
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
     *         HttpStatus
     *         BAD_REQUEST if the workout could not be found in the table with
     *         favorite workouts
     *         OK if the workout is successfully removed from the table with
     *         favorite workouts
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
        List<Workout> result = workoutRepository.findAllFavorites(userId).stream().filter(filterByWorkoutId)
                .collect(Collectors.toList());
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
     *         HttpStatus
     *         OK if workout with id exists
     *         BAD_REQUEST if id is not valid
     *         NOT FOUND if id is valid but not found
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
     *         HttpStatus
     *         OK if workout with id exists
     *         BAD_REQUEST if id is not valid
     *         NOT FOUND if id is valid but not found
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

    /**
     * This method returns a list of all workout containing a specific technique
     *
     * Returns 200 OK if the technique is posted.
     * Returns 404 NOT FOUND if the given technique ID was not found or if no
     * workouts were found.
     * Returns 500 INTERNAL SERVER ERROR if an error occurs during the database
     * transaction.
     *
     * @param id of the technique
     * @return responseEntity indicating the success-status of the post as well as a
     *         JSON list
     *         of all techniques.
     */
    @GetMapping("/associated/technique/{id}")
    public ResponseEntity<Object> associatedTechniques(@PathVariable("id") Long id) {
        if (techniqueRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>("Ingen teknik med ID " + id + " hittades", HttpStatus.NOT_FOUND);
        }

        List<Workout> foundWorkouts = findWorkouts(id, Technique.class);

        if (foundWorkouts.isEmpty()) {
            return new ResponseEntity<>("Tekniken med id " + id + " finns inte inlagt i några pass.",
                    HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(foundWorkouts, HttpStatus.OK);
    }

    /**
     * Find all workouts associated with a technique or exercise
     * 
     * @param id     the id of what you want to find workouts for
     * @param object Class objectt. Must be either Technique.class or Exercise.class
     * @return
     * @throws IllegalArgumentException
     */
    private List<Workout> findWorkouts(Long id, Object object) throws IllegalArgumentException {
        boolean isTechnique = object == Technique.class;
        boolean isExercise = object == Exercise.class;
        List<Workout> foundWorkouts = new ArrayList<>();
        List<Activity> activities = activityRepository.findAll();

        if (!(isTechnique || isExercise)) {
            throw new IllegalArgumentException("Object must either Technique or Exercise");
        }

        for (Activity activity : activities) {
            long temp_id = -1337L; // was chosen by dev team as a default error-value
            if (isTechnique && activity.getTechniqueId() != null)
                temp_id = activity.getTechniqueId();
            if (isExercise && activity.getExerciseId() != null)
                temp_id = activity.getExerciseId();
            if (temp_id == -1337L)
                continue;

            if (id.equals(temp_id)) {
                Optional<Workout> result = workoutRepository.findById(activity.getWorkoutId());
                result.ifPresent(foundWorkouts::add);
            }
        }
        return foundWorkouts.stream().distinct().toList();
    }

    /**
     * This method returns a list of all workout containing a specific technique
     *
     * Returns 200 OK if the technique is posted.
     * Returns 404 NOT FOUND if the given technique ID was not found or if no
     * workouts were found.
     * Returns 500 INTERNAL SERVER ERROR if an error occurs during the database
     * transaction.
     *
     * @param id of the technique
     * @return responseEntity indicating the success-status of the post as well as a
     *         JSON list
     *         of all techniques.
     */
    @GetMapping("/associated/exercise/{id}")
    public ResponseEntity<Object> associatedExercises(@PathVariable("id") Long id) {
        if (exerciseRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>("Ingen övning med ID " + id + " hittades", HttpStatus.NOT_FOUND);
        }
        List<Workout> foundWorkouts = findWorkouts(id, Exercise.class);
        if (foundWorkouts.isEmpty()) {
            return new ResponseEntity<>("Övningen med id " + id + " finns inte inlagt i några pass.",
                    HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(foundWorkouts, HttpStatus.OK);
    }

    private void addTags(Long workoutID, Long[] tagIds) throws Exception {
        // Add tags related to workout
        for (Long tagId : tagIds) {
            WorkoutTag toAddWorkoutTag = new WorkoutTag(workoutID,
                    tagRepository.findById(tagId).get());
            workoutTagRepository.save(toAddWorkoutTag);
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
    private Long[] tagIds;

    /**
     * @return List of user ids
     */
    public Long[] getUsers() {
        return users;
    }

    /**
     * @return List of tags
     */
    public Long[] getTagIds() {
        return tagIds;
    }

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