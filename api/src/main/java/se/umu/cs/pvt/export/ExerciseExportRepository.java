package se.umu.cs.pvt.export;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for exercise export entities.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
public interface ExerciseExportRepository extends JpaRepository<ExerciseExport, Long> {
}
