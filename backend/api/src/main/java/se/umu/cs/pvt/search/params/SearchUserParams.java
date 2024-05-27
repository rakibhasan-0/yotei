package se.umu.cs.pvt.search.params;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * This class stores the urlQuery in attributes.
 * 
 * @author Chimera (Ludvig Larsson)
 */
public class SearchUserParams {
    private String name;
    private String id;
    private Long roleId;

    public SearchUserParams(Map<String, String> urlQuery){
        try {
            if(urlQuery.get("name") != null)
            {
                name = new String(URLDecoder.decode(urlQuery.get("name"), StandardCharsets.UTF_8.toString()));
            }
        } catch (UnsupportedEncodingException e) {
            System.out.println("Failed to decode name string. " + e);
            name = urlQuery.get("name");
        }

        id = urlQuery.get("id");
        String inputRole = urlQuery.get("roleId");
        if (inputRole != null) {
            roleId = (long)(Integer.parseInt(inputRole));            
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
        return roleId != null;
    }

    public long getRoleId() {
        return roleId;
    }
}
