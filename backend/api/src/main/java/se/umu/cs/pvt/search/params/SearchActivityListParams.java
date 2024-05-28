package se.umu.cs.pvt.search.params;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;


/**
 * This class stores the urlQuery in attributes.
 *
 * @author Team Tomato 2024-05-20, updated 2024-05-27
 * 
 */
public class SearchActivityListParams {
	private Boolean hidden;
    private Boolean isAuthor;
    private Boolean isShared;
	private String name;
    private Long techniqueId;
    private Long exerciseId;

    public SearchActivityListParams(Map<String, String> urlQuery){
        try {
            if(urlQuery.get("name") != null) {
                name = new String(URLDecoder.decode(urlQuery.get("name"), StandardCharsets.UTF_8.toString()));
            }
        } catch (UnsupportedEncodingException e) {
            System.out.println("Failed to decode name string. " + e);
            name = urlQuery.get("name");
        }
        
        if(urlQuery.containsKey("hidden")){
            hidden = Boolean.parseBoolean(urlQuery.get("hidden"));
        }
        if(urlQuery.containsKey("isAuthor")){
            isAuthor = Boolean.parseBoolean(urlQuery.get("isAuthor"));
        }
        if(urlQuery.containsKey("isShared")){
            isShared = Boolean.parseBoolean(urlQuery.get("isShared"));
        }
        if(urlQuery.containsKey("techniqueId")){
            if(urlQuery.get("techniqueId").contains("undefined") || urlQuery.get("techniqueId").contains("null")){
                techniqueId = null;
            }
            else{
                techniqueId = Long.parseLong(urlQuery.get("techniqueId"));
            }
            
        }
        if(urlQuery.containsKey("exerciseId")){
            if(urlQuery.get("exerciseId").contains("undefined") || urlQuery.get("exerciseId").contains("null")){
                exerciseId = null;
            }
            else{
                exerciseId = Long.parseLong(urlQuery.get("exerciseId"));
            }
            
        }

    }

    public boolean hasName() {
        return name != null;
    }

    public String getName() {
        return name;
    }

    public boolean hasHidden() {
        return hidden != null;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public boolean hasIsAuthor() {
        return isAuthor != null;
    }

    public Boolean getIsAuthor() {
        return isAuthor;
    }

    public boolean hasIsShared() {
        return isShared != null;
    }

    public Boolean getIsShared() {
        return isShared;
    }

    public boolean hasTecniqueId() {
        return techniqueId != null;
    }

    public Long getTechniqueId() {
        return techniqueId;
    }

    public boolean hasExerciseId() {
        return exerciseId != null;
    }

    public Long getExerciseId() {
        return exerciseId;
    }

    
}
