package se.umu.cs.pvt.techniqueChain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TechniqueChainChainRepository extends JpaRepository<TechniqueChainChain, Long> {
    @Query("SELECT tc FROM TechniqueChainChain tc LEFT JOIN FETCH tc.node WHERE tc.id = :id")
    TechniqueChainChain findByIdWithNodes(@Param("id") Long id);
}
