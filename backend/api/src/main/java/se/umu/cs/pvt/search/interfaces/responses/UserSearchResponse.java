package se.umu.cs.pvt.search.interfaces.responses;

/**
 * This class represents the User object returned
 * from the API.
 * 
 * @author Chimera (Ludvig Larsson)
 */
public class UserSearchResponse implements SearchResponseInterface {
    private long userId;
    private String name;
    private long roleId;

    public UserSearchResponse(long userId, String name, long roleId){
        this.userId = userId;
        this.name = name;
        this.roleId = roleId;
    }

    public String getName() {
        return name;
    }

    public long getUserId() {
        return userId;
    }

    public long getRole() {
        return roleId;
    }
}
