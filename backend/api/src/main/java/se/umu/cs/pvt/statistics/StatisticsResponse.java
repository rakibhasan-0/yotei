package se.umu.cs.pvt.statistics;

import java.io.Serializable;

/**
  {
    id: 1,
    name: "Armhävningar"
    type: "technique"/"exercise"
    belt: id (OR null)
    count: 10
  }

 */
public class StatisticsResponse implements Serializable {
  private Long activity_id;
  private String name;
  private String type;
  private Long belt_id;
  private Long count;


  public StatisticsResponse(Long id, String name, Long belt_id, Long cnt) {
    this.activity_id = id;
    this.name = name;
    this.type = "techqniue";
    this.belt_id = belt_id;
    this.count  = cnt;
  
  }

  public StatisticsResponse(Long id, String name, Long cnt) {
    this.activity_id = id;
    this.name = name;
    this.type = "exercise";
    this.belt_id = null;
    this.count  = cnt;
  }

  public Long getActivity_id() {
      return activity_id;
  }

  public String getName() {
      return this.name;
  }

  public String getType() {
      return type;
  }

  public Long getBelt_id() {
      return belt_id;
  }

  public Long getCount() {
      return count;
  }

}