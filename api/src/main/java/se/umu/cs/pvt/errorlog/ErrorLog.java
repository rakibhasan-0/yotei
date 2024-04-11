package se.umu.cs.pvt.errorlog;

import javax.persistence.*;
import java.io.Serializable;
// import java.time.LocalDateTime;
import java.util.Date;

/**
 * A error log entity for Spring
 *
 * @author Team 3 Dragon
 * date: 2023-04-25
 */
@Entity
@Table(name = "error_log")
public class ErrorLog implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, name = "log_id")
    private Long id;

    @Column(nullable = false, name = "error_message")
    private String errorMessage;

    @Column(nullable = false, name = "info_message")
    private String infoMessage;

    @Column(nullable = false, name = "error_date_time")
    private Date errorDateTime;

    /**
     * No-args constructor required JPA spec
     */
    protected ErrorLog() {
    }

    public ErrorLog(Long id, String errorMessage, String infoMessage, Date errorDateTime) {
        try{
            this.id = id;
            this.errorMessage = errorMessage;
            this.infoMessage = infoMessage;
            this.errorDateTime = errorDateTime;
        } catch (Exception e){
            e.printStackTrace();
        }

    }


   /**
     * Getters for attributes
     */
    public Long getId() {
        return id;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public String getInfoMessage() {
        return infoMessage;
    }

    public Date getErrorDateTime(){
        return errorDateTime;
    }

    /**
     * Setter for infoMessage
     * @param infoMessage info
     */
    public void setInfoMessage(String infoMessage){
        this.infoMessage = infoMessage;
    }

    /**
     * check if any attribute is null, if any attribute is null, return true, else false
     * @return Boolean
     */
    public Boolean hasNullAttributes() {
        return errorMessage == null || infoMessage == null;
    }

}
