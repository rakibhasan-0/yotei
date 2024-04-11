package se.umu.cs.pvt.belt;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TechniqueBeltRepository extends JpaRepository<TechniqueBelt, Long> {
}
