package se.umu.cs.pvt.errorlog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository for error logs
 *
 * @author Team 3 Dragon
 * date: 2024-04-25
 */
public interface ErrorLogRepository extends JpaRepository<ErrorLog, Long> {
    ErrorLog findById(int id);
    <T> List<T> findAllProjectedBy(Class<T> type);
}
