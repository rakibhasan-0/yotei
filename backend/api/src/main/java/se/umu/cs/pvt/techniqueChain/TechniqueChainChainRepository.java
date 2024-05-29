package se.umu.cs.pvt.techniqueChain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * The repository for the TechniqueChainChain entity.
 * @author Team Durian
 * @date 2024-05-29
 * @version 1.0
 */
public interface TechniqueChainChainRepository extends JpaRepository<TechniqueChainChain, Long> {
    //gets all the nodes rows with matchin node_id
    @Query("SELECT tc FROM TechniqueChainChain tc LEFT JOIN FETCH tc.node WHERE tc.id = :id")
    TechniqueChainChain findByIdWithNodes(@Param("id") Long id);
}
