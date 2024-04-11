package se.umu.cs.pvt.export;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for technique export entities.
 *
 * @author Andre Byström
 * date: 2023-04-25
 */
public interface TechniqueExportRepository extends JpaRepository<TechniqueExport, Long> {
}
