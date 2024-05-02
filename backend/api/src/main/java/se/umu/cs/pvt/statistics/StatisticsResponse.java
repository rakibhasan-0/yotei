package se.umu.cs.pvt.statistics;

import java.io.Serializable;

import se.umu.cs.pvt.belt.Belt;

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
  private Belt belt;
  private Long count;

  /**
   * Create a new instance of StatisticsResponse representing a technique.
   * @param id id of the technique
   * @param name name of the technique
   * @oaram belt_id id of the belt of the technique
   * @param cnt number of occurrences of technique in sessions.
   * @return new StatisticsRespnse
   */
  public StatisticsResponse(Long id, String name, Long belt_id, String belt_name, String belt_color, boolean belt_isChild, Long cnt) {
    this.activity_id = id;
    this.name = name;
    this.type = "techqniue";
    this.belt = new Belt(belt_id, belt_name, belt_color, belt_isChild);
    this.count  = cnt;
  
  }

  /**
   * Create a new instance of StatisticsResponse representing an exercise
   * @param id id of the exercise
   * @param name name of the exercise
   * @param cnt number of occurrences of technique in sessions.
   * 
   * Note: Exercises have no associated belt and belt is therefore set to null.
   * 
   * @return new StatisticsRespnse
   */
  public StatisticsResponse(Long id, String name, Long cnt) {
    this.activity_id = id;
    this.name = name;
    this.type = "exercise";
    this.belt = null;
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
   * Public getter for private property belt
   */
  public Belt getBelt() {
      return belt;
  }

  /**
   * Public getter for private property count
   */
  public Long getCount() {
      return count;
  }
}