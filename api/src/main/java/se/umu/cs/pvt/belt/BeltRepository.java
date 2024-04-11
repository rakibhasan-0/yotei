package se.umu.cs.pvt.belt;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for belts.
 *
 * @author Max Thorén
 * @author Andre Byström
 * date: 2024-04-24
 */
public interface BeltRepository extends JpaRepository<Belt, Long> {
}
