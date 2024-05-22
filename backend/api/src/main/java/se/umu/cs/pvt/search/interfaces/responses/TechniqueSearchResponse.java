package se.umu.cs.pvt.search.interfaces.responses;

import java.util.ArrayList;
import java.util.List;

/**
 * This class represents the Technique object returned
 * from the API.
 *
 * @author Minotaur (James Eriksson)
  * @updated 2024-05-20 Team Kiwi (Teodor Bäckström)
 * Added inverted belt category
 */
public class TechniqueSearchResponse implements SearchResponseInterface {
    private Long techniqueID;
    private String name;
    private List<ColorObject> beltColors;

    public TechniqueSearchResponse(Long techniqueID, String name, String belt_color, String belt_name, Boolean is_child, Boolean is_inverted) {
        this.techniqueID = techniqueID;
        this.name = name;
        this.beltColors = new ArrayList<>();
        if(belt_color != null) this.beltColors.add(new ColorObject(belt_color, belt_name, is_child, is_inverted));
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
     * @param is_inverted If belt to add is the inverted child belt
	 */
    public void addBeltColor(String belt_color_code, String belt_name, Boolean is_child, Boolean is_inverted) {
        if(belt_color_code != null) beltColors.add(new ColorObject(belt_color_code, belt_name, is_child, is_inverted));
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
        private boolean is_inverted;

        public ColorObject(String belt_color, String belt_name, boolean is_child, boolean is_inverted){
            this.belt_color = belt_color;
            this.belt_name = belt_name;
            this.is_child = is_child;
            this.is_inverted = is_inverted;
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

        public boolean getIs_inverted(){
            return is_inverted;
        }
    }
}
