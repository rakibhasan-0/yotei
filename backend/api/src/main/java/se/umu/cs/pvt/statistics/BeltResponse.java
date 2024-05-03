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

    public BeltResponse(Belt belt) {
        this.belt = belt;
    }

    public String getBelt_color() {
        return belt.getColor();
    }

    public String getBelt_name() {
        return belt.getName();
    }

    public boolean getIs_Child() {
        return belt.isChild();
    }
}
