package se.umu.cs.pvt.gateway;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * PermissionValidator class is a helper class for AuthFilter for validation 
 * of user permissions.
 * 
 * When adding a new feature requiring new permissions:
 * 		- Create new permissions when necessary.
 *          - These should be added to permissions.sql AND util.js so 
 *            they all match.
 * 		- Add the permissions into the "permissionList".
 * 		- Create a new method for checking the permissions associated with the 
 *        feature.
 * 		- Create a list of regex patterns for each endpoint.
 *
 * @author Team Mango (Group 4) - 2024-05-29
 * 
 */
public class PermissionValidator {
    // Enum for all existing permissions
    // These are listed in permissions.sql and should mirror 
    // what is present in utils.js
    private enum permissionList {
        ADMIN_RIGHTS(1),
        BETA_ACCESS(2),
	    SESSION_GROUP_OWN(3), //Edit your own groups and sessions.
	    SESSION_GROUP_ALL(4), //Edit all groups and sessions.
	    WORKOUT_OWN(5),
	    WORKOUT_ALL(6),
        TECHNIQUE_ALL(7),
        EXERCISE_ALL(8),
	    GRADING_ALL(9);

        private final int value;
        private permissionList(int value) {
            this.value = value;
        }
	}

    /**
     * Validates if a user has permissions to use the API endpoints 
     * requested in the path.
     * 
     * @param path The path for the API call
     * @param permissions The permissions belonging to the user
     * 
     * @return True if the user has the required permissions; else false
     */
    public boolean validate(String path, List<Integer> permissions) {
        if ((path.startsWith("/api/session") || (path.startsWith("/api/plan")))
            && !checkSessionGroupPermissions(path, permissions)) return false;

            if ((path.startsWith("/api/techniques"))
            && !checkTechniquePermissions(path, permissions)) return false;

        if ((path.startsWith("/api/exercises"))
            && !checkExercisePermissions(path, permissions)) return false;

        if (path.startsWith("/api/examination")
            && !checkGradingPermissions(path, permissions)) return false;

        if (path.startsWith("/api/workouts") 
            && !checkWorkoutPermissions(path, permissions)) return false;

        return true;
    }

	public int getAdminRightsValue() {return permissionList.ADMIN_RIGHTS.value;}

    /**
     * Checks if a user is an admin.
     * 
     * Looks if the users permissions contains the admin permission.
     * 
     * @param permissions A list of permissions belonging to the user
     * 
     * @return True if the user has admin rights; else false
     */
    public static boolean isAdmin(List<Integer> permissions) {
        return permissions.contains(permissionList.ADMIN_RIGHTS.value);}  

    /**
     * Checks if a user has permissions to access API endpoints associated 
     * with Sessions and Groups (plans).
     * 
     * Checks when a user tries to access Sessions or Groups via POST, PUT, DELETE http methods. 
     * 
     * @param path The path for the API call
     * @param permissions The permissions belonging to the user
     * 
     * @return True if the user has the required permissions; else false.
     */
	private boolean checkSessionGroupPermissions(String path, List<Integer> permissions) {
        Pattern[] patterns = {
            // From PlanController
            Pattern.compile("^/api/plan/add$"),
            Pattern.compile("^/api/plan/remove$"),
            Pattern.compile("^/api/plan/update$"),
            // From SessionController
            Pattern.compile("^/api/session/add$"),
            Pattern.compile("^/api/session/addList$"),
            Pattern.compile("^/api/session/delete$"),
            Pattern.compile("^/api/session/deleteByPlan$"),
            Pattern.compile("^/api/session/update$"),
            // From SessionReviewController
            Pattern.compile("^/api/session/\\d+/review$"),
            Pattern.compile("^/api/session/\\d+/review/\\d+/activity$"),
            Pattern.compile("^/api/session/\\d+/review/\\d+/activity/\\d+$"),
            Pattern.compile("^/api/session/\\d+/review/\\d+$")
        };
    
        Integer[] permissionsToCheck = {
            permissionList.SESSION_GROUP_ALL.value,
            permissionList.SESSION_GROUP_OWN.value
        };

        return hasPermission(path, permissions, Arrays.asList(patterns), Arrays.asList(permissionsToCheck));
    }

    /**
     * Checks if a user has permissions to access API endpoints associated 
     * with Technique.
     * 
     * Checks when a user tries to access Technique via 
     * POST, PUT, DELETE http methods. 
     * 
     * @param path The path for the API call
     * @param permissions The permissions belonging to the user
     * 
     * @return True if the user has the required permissions; else false.
     */
    private boolean checkTechniquePermissions(String path, List<Integer> permissions) {
        Pattern[] patterns = {
            // From TechniqueController
            Pattern.compile("^/api/techniques$"),
            Pattern.compile("^/api/techniques/\\d+$"),
            Pattern.compile("^/api/techniques/reviews$"),
        };
    
        Integer[] permissionsToCheck = {
            permissionList.TECHNIQUE_ALL.value

        };

        return hasPermission(path, permissions, 
            Arrays.asList(patterns), Arrays.asList(permissionsToCheck));
    }

    /**
     * Checks if a user has permissions to access API endpoints associated 
     * with Exercise.
     * 
     * Checks when a user tries to access Exercise via 
     * POST, PUT, DELETE http methods. 
     * 
     * @param path The path for the API call
     * @param permissions The permissions belonging to the user
     * 
     * @return True if the user has the required permissions; else false.
     */
    private boolean checkExercisePermissions(String path, List<Integer> permissions) {
        Pattern[] patterns = {
            // From ExerciseController
            Pattern.compile("^/api/exercises/add$"),
            Pattern.compile("^/api/exercises/add/update$"),
            Pattern.compile("^/api/exercises/add/remove/\\d+$"),
            Pattern.compile("^/api/exercises/add/image$")
        };
    
        Integer[] permissionsToCheck = {
            permissionList.EXERCISE_ALL.value
        };

        return hasPermission(path, permissions, 
            Arrays.asList(patterns), Arrays.asList(permissionsToCheck));
    }

    /**
     * Checks if a user has permissions to access API endpoints associated 
     * with Grading.
     * 
     * Checks when a user tries to access Grading via POST, PUT, DELETE http methods. 
     * 
     * @param path The path for the API call
     * @param permissions The permissions belonging to the user
     * 
     * @return True if the user has the required permissions; else false.
     */
    private boolean checkGradingPermissions(String path, List<Integer> permissions) {
        Pattern[] patterns = {
            // From ExaminationController
            Pattern.compile("^/api/examination/grading$"),
            Pattern.compile("^/api/examination/grading/\\d+$"),
            Pattern.compile("^/api/examination/examinee$"),
            Pattern.compile("^/api/examination/examinee/\\d+$"),
            Pattern.compile("^/api/examination/pair$"),
            Pattern.compile("^/api/examination/pair/\\d+$"),
            Pattern.compile("^/api/examination/comment$"),
            Pattern.compile("^/api/examination/comment/\\d+$"),
            Pattern.compile("^/api/examination/examresult$"),
            Pattern.compile("^/api/examination/examresult/\\d+$")
        };
    
        Integer[] permissionsToCheck = {
            permissionList.GRADING_ALL.value
        };

        return hasPermission(path, permissions, 
            Arrays.asList(patterns), Arrays.asList(permissionsToCheck));
    }

    /**
     * Checks if a user has permissions to access API endpoints associated 
     * with Workout.
     * 
     * Checks when a user tries to access Workout via POST, PUT, DELETE http methods. 
     * 
     * @param path The path for the API call
     * @param permissions The permissions belonging to the user
     * 
     * @return True if the user has the required permissions; else false.
     */
    private boolean checkWorkoutPermissions(String path, List<Integer> permissions) {
        Pattern[] patterns = {
            // From WorkoutController
            Pattern.compile("^/api/workouts$"),
            Pattern.compile("^/api/workouts/update_full_workout$"),
            Pattern.compile("^/api/workouts/reviews$"),
            Pattern.compile("^/api/workouts/favorites$"),
            Pattern.compile("^/api/workouts/add_full_workout$"),
            Pattern.compile("^/api/workouts/delete_full_workout/\\d+$"),
            Pattern.compile("^/api/workouts/delete/\\d+$"),
            // From UserWorkoutController
            Pattern.compile("^/api/workouts/add/workout/\\d+/user/\\d+$"),
            Pattern.compile("^/api/workouts/remove/workout/\\d+/user/\\d+$"),
        };
    
        Integer[] permissionsToCheck = {
            permissionList.WORKOUT_ALL.value,
            permissionList.WORKOUT_OWN.value
        };

        return hasPermission(path, permissions, 
            Arrays.asList(patterns), Arrays.asList(permissionsToCheck));
    }

    /**
     * If the path matches ONE pattern, then it checks the if the list
     * permissions contains at least one of the required permissions in 
     * "permissionsToCheck".
     * 
     * @param path The path for the API call
     * @param permissions The permissions belonging to the user
     * @param patterns The patterns of the API endpoints
     * @param permissionsToCheck A list of required permissions
     * 
     * @return True if the users has the required permissions or if no pattern 
     * matches; else false
     */
    private boolean hasPermission(
		String path, List<Integer> permissions, List<Pattern> patterns, 
		List<Integer> permissionsToCheck) {

        for (Pattern pattern : patterns) {
            Matcher matcher = pattern.matcher(path);

            if (matcher.matches()) {
                if (Collections.disjoint(permissions, permissionsToCheck)) {
                    return false;
                }
            }
        }

        return true;
    }
}
