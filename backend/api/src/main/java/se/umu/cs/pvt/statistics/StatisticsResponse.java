package se.umu.cs.pvt.statistics;

import java.io.Serializable;

import se.umu.cs.pvt.belt.Belt;
import java.util.List;

/**
 * Class representing the response entity for the statistics API. 
 * Example serialized object:
 * {
 *   id: 1,
 *   name: "Armhävningar"
 *   type: "technique"/"exercise"
 *   belt: id (OR null)
 *   count: 10
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
  private List<Belt> belts;
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
   * Public getter for private property activity_id
   */
  public Long getActivity_id() {
      return activity_id;
  }

  /**
   * Public getter for private property name
   */
  public String getName() {
      return this.name;
  }

  /**
   * Public getter for private property type
   */
  public String getType() {
      return type;
  }

  /**
   * Public getter for private property belts
   */
  public List<Belt> getBelts() {
      return belts;
  }

  /**
   * Public setter for private property belts
   * @param belts
   */
  public void setBelts(List<Belt> belts) {
      this.belts = belts;
  }

  /**
   * Public getter for private property count
   */
  public Long getCount() {
      return count;
  }
}