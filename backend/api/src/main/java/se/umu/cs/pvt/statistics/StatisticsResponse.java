package se.umu.cs.pvt.statistics;

import java.io.Serializable;

public class StatisticsResponse implements Serializable {
  private Long technique_id;
  private Long count;


  public StatisticsResponse(Long id, Long cnt) {
    this.technique_id = id;
    this.count  = cnt;
  }

  public Long getTechniqueId() {
      return technique_id;
  }

  public Long getCount() {
      return count;
  }

}