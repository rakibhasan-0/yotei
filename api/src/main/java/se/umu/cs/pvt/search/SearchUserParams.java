package se.umu.cs.pvt.search;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import se.umu.cs.pvt.user.User.Role;

/**
 * This class stores the urlQuery in attributes.
 * 
 * @author Chimera (Ludvig Larsson)
 */
public class SearchUserParams {
    private String name;
    private String id;
    private String role;

    public SearchUserParams(Map<String, String> urlQuery){
        try {
			if(urlQuery.get("name") != null)
			{
				name = new String(URLDecoder.decode(urlQuery.get("name"), StandardCharsets.UTF_8.toString()));
			}	
		} catch (UnsupportedEncodingException e) {
			// Failed to decode string use uncoded string.
			name = urlQuery.get("name");
		}
        id = urlQuery.get("id");
        String inputRole = urlQuery.get("role");
        if (inputRole != null) {
            if (isRole(inputRole.toUpperCase())) {
                role = Integer.toString(Role.valueOf(inputRole.toUpperCase()).ordinal());
            } else {
                role = inputRole;
            }
        }
    }

    public boolean hasName() {
        return name != null;
    }

    public String getName() {
        return name;
    }

    public boolean hasId() {
        return id != null;
    }

    public String getId() {
        return id;
    }

    public boolean hasRole() {
        return role != null;
    }

    public String getRole() {
        return role;
    }

    /**
     * Checks if the enum Role contains the given string.
     *
     * @param str The string to check
     * @return True if the string is in the enum Role, false otherwise
     */
    private Boolean isRole(String str) {
        for (Role role : Role.values()) {
            if (role.name().equals(str)) {
                return true;
            }
        }
        return false;
    }
}
