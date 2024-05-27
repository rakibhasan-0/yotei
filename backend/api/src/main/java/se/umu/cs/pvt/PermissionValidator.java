package se.umu.cs.pvt;

import java.util.List;

/**
 * A class for checking admin permission rights. The enum and function is a copy of 
 * what's present in the permission validator from the gateway, this solely exists
 * since the gateway classes can't be accessed from within this package.
 * 
 * @author Team Mango (Group 4) - 2024-05-23
 */
public class PermissionValidator {
    // Enum for all existing permissions
    // These are listed in permissions.sql and should mirror 
    // what is present in utils.js
    private enum permissionList {
        ADMIN_RIGHTS(1),
	    SESSION_OWN(2), //Edit your own sessions.
	    SESSION_ALL(3), //Edit all sessions.
	    PLAN_OWN(4),
	    PLAN_ALL(5),
	    WORKOUT_OWN(6),
	    WORKOUT_ALL(7),
        TECHNIQUE_EXERCISE_ALL(8),
	    GRADING_ALL(9);

        private final int value;
        private permissionList(int value) {
            this.value = value;
        }
	}

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
}
