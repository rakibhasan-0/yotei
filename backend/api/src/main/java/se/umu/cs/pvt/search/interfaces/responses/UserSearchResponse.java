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
    private String role;

    public UserSearchResponse(long userId, String name, String role){
        this.userId = userId;
        this.name = name;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public long getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }
}
