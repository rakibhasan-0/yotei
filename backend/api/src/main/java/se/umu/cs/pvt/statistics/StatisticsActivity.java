package se.umu.cs.pvt.statistics;

import java.io.Serializable;
import java.time.LocalDate;

import se.umu.cs.pvt.belt.Belt;
import java.util.List;
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
public class StatisticsActivity implements Serializable {
  private Long session_id;
  private Long activity_id;
  private String name;
  private String type;
  private List<BeltResponse> belts;
  private Long count;
  private Boolean kihon;
  private LocalDate date;
  private Integer session_rating;

  /**
   * Create a new instance of StatisticsResponse.
   * @param sid id of the session
   * @param id id of the technique
   * @param name name of the technique
   * @param cnt number of occurrences of technique in sessions.
   * @param type the type of activity to represent exercise/techniques
   * @param date the date of the session
   * @param rating the rating of the session
   * @return new StatisticsActivity
   */
  public StatisticsActivity(Long sid, Long id, String name, String type, Long cnt, Boolean kihon, LocalDate date, Integer rating) {
    this.session_id = sid;
    this.activity_id = id;
    this.name = name;
    this.type = type;
    this.count  = cnt;
    this.kihon = kihon;
    this.date = date;
    this.session_rating = rating;
  }

  /**
   * Public getter for private property session_id
   * @return session id of the session that the activity was in.
   */
  public Long getSession_id() {
    return session_id;
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
   * @return belt colors of belts associated with activity
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
   * @return amount of time that the activity has been done.
   */
  public Long getCount() {
      return count;
  }

  /**
   * Public getter for private property kihon
   * @return true if activity is associated with the "kihon" tag, otherwise false
   */
  public Boolean getKihon() {
    return kihon;
  }

  /**
   * Public getter for private property date
   * @return date of the session review
   */
  public LocalDate getDate() {
    return date;
  }

  /**
   * Public getter for private property session_rating
   * @return rating of the session that the activity was done in.
   */
  public Integer getRating() {
    return session_rating;
  }
}