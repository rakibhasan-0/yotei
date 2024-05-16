package se.umu.cs.pvt.statistics;

import java.io.Serializable;
import se.umu.cs.pvt.belt.Belt;
import java.util.List;
import java.util.Set;
import java.util.ArrayList;

/**
 * Class representing the response entity for the statistics API. 
 * 
 * Example serialized object:
 * {
 *   "activity_id": 0,
 *   "name": "string",
 *   "type": "string",
 *   "count": 0,
 *   "beltColors": [
 *     {
 *       "belt_color": "string",
 *       "belt_name": "string",
 *       "is_child": true
 *     }
 *   ]
 * }
 * 
 * @author Cocount 
 * @version 1.0
 * @since 2024-04-29
 */
public class StatisticsResponse implements Serializable {
  private Long activity_id;
  private String name;
  private String type;
  private List<BeltResponse> belts;
  private Long count;


  /**
   * Create a new instance of StatisticsResponse.
   * @param id id of the technique
   * @param name name of the technique
   * @param cnt number of occurrences of technique in sessions.
   * @param type the type of activity to represent exercise/techniques
   * @return new StatisticsRespnse
   */
  public StatisticsResponse(Long id, String name, String type, Long cnt) {
    this.activity_id = id;
    this.name = name;
    this.type = type;
    this.count  = cnt;
  }

    /**
   * Create a new instance of StatisticsResponse with inferred 0 count.
   * @param id id of the technique
   * @param name name of the technique
   * @param type the type of activity to represent exercise/techniques
   * @return new StatisticsRespnse
   */
  public StatisticsResponse(Long id, String name, String type) {
    this.activity_id = id;
    this.name = name;
    this.type = type;
    this.count  = 0L;
}

  /**
   * Public getter for private property activity_id
   * @return activity id
   */
  public Long getActivity_id() {
      return activity_id;
  }

  /**
   * Public getter for private property name
   * @return activity name
   */
  public String getName() {
      return this.name;
  }

  /**
   * Public getter for private property type
   * @return activity type
   */
  public String getType() {
      return type;
  }

  /**
   * Public getter for private property belts
   * See BeltRepsonse
   * @return wrapped belts associated with activity.
   */
  public List<BeltResponse> getBeltColors() {
      return belts;
  }

  /**
   * Public setter for private property belts
   * @param belts
   */
  public void setBelts(List<Belt> belts) {
      this.belts = new ArrayList<>();
      for (Belt b : belts) {
        this.belts.add(new BeltResponse(b));
      }
  }


  /**
   * Public getter for private property count
   * @return amount of times that the activity has been done.
   */
  public Long getCount() {
      return count;
  }

  /**
   * Public getter for private property count
   */
  public void addToCount(Long count) {
    this.count += count;
}

  // Consider two StatisticsACtivity equal if the share the same activity_id 
  // to remove duplicates from output.
  @Override
  public boolean equals(Object obj) {

    if (obj == this) {
        return true;
    }
    if (!(obj instanceof StatisticsResponse)) {
        return false;
    }
    StatisticsResponse sr = (StatisticsResponse) obj;
    return this.activity_id.equals(sr.getActivity_id());
  }

  @Override
  public String toString() {
      return Long.toString(this.activity_id) + " - " + this.name;
  }
}