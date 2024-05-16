package se.umu.cs.pvt.session;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.sql.Time;
import java.time.LocalTime;

/**
 * Not used anywhere in production code or tests. Should be removed?
 * 
 * Converts between time types LocalTime and Time (between java times and sql times)
 * Not sure if this is needed since JPA mght do this automatically.
 * 
 * @author c19rll (Hawaii) (Doc: Griffins c20jjs)
 */
@Converter
public class SessionTimeConverter implements AttributeConverter<LocalTime, Time> {

    /**
     * Converts LocalTime to sql.Time.
     * 
     * @param localTime A LocalTime object.
     * @return A Time object with the same time.
     */
    @Override
    public Time convertToDatabaseColumn(LocalTime localTime) {
        if(localTime == null) return null;
        return Time.valueOf(localTime);
    }

    /**
     * Converts Time to sql.LocalTime.
     * 
     * @param time A time object.
     * @return A LocalTime object with the same time.
     */
    @Override
    public LocalTime convertToEntityAttribute(Time time) {
        if(time == null) return null;
        return time.toLocalTime();
    }
}
