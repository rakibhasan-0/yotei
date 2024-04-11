package se.umu.cs.pvt.search.interfaces.responses;

import java.util.ArrayList;
import java.util.List;

/**
 * This class represents the Technique object returned
 * from the API.
 *
 * @author Minotaur (James Eriksson)
 */
public class TechniqueSearchResponse implements SearchResponseInterface {
    private Long techniqueID;
    private String name;
    private List<ColorObject> beltColors;

    public TechniqueSearchResponse(Long techniqueID, String name, String belt_color, String belt_name, Boolean is_child) {
        this.techniqueID = techniqueID;
        this.name = name;
        this.beltColors = new ArrayList<>();
        if(belt_color != null) this.beltColors.add(new ColorObject(belt_color, belt_name, is_child));
    }

    public Long getTechniqueID() {
        return techniqueID;
    }

    public String getName() {
        return name;
    }

    public List<ColorObject> getBeltColors() {
        return beltColors;
    }

	/**
	 * Adds a belt colour to the technique
	 * @param belt_color_code Hexdecimal representation of belt colour to add
	 * @param belt_name Name of belt to add
	 * @param is_child If belt to add is a child belt
	 */
    public void addBeltColor(String belt_color_code, String belt_name, Boolean is_child) {
        if(belt_color_code != null) beltColors.add(new ColorObject(belt_color_code, belt_name, is_child));
    }

	/**
	  * Private class representing a techniques belt colour.
      *
	  * @author Minotaur (James Eriksson)
	 */
    private class ColorObject {
        private String belt_color;
        private String belt_name;
        private boolean is_child;

        public ColorObject(String belt_color, String belt_name, boolean is_child){
            this.belt_color = belt_color;
            this.belt_name = belt_name;
            this.is_child = is_child;
        }

        public String getBelt_name() {
            return belt_name;
        }

        public String getBelt_color() {
            return belt_color;
        }

        public boolean getIs_child() {
            return is_child;
        }
    }
}
