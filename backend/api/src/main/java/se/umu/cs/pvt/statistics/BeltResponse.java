package se.umu.cs.pvt.statistics;

import java.io.Serializable;
import se.umu.cs.pvt.belt.Belt;

/**
 * Used to create BeltColors in StatisticsResponse similar to search API.
 * Example:
 * {
 *  belt_color: "FFDD33",
 *  belt_name: "Gult",
 *  is_child: false
 * }
 * 
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-03
 */
public class BeltResponse implements Serializable {

    private Belt belt;

    /**
     * Constructor for BeltResponse entity.
     *
     * @param Belt belt to wrap
     * @return new BeltResponse
     */
    public BeltResponse(Belt belt) {
        this.belt = belt;
    }

       
    /**
     * Public getter for private property belt_color
     * @return color of the belt
     */
    public String getBelt_color() {
        return belt.getColor();
    }

    /**
     * Public getter for private property belt_name
     * @return name of the belt
     */
    public String getBelt_name() {
        return belt.getName();
    }

    /**
     * Public getter for private property is_child
     * @return true if belt is a child belt, otherwise false.
     */
    public boolean getIs_child() {
        return belt.isChild();
    }

    /**
     * Public getter for private proprty is_inverted
     * @return true if belt is a inverted belt, otherwise false.
     */
    public boolean getIs_inverted(){
        return belt.isInverted();
    }
}
