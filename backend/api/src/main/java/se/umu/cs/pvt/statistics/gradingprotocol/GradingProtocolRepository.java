package se.umu.cs.pvt.statistics.gradingprotocol;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import se.umu.cs.pvt.statistics.gradingprotocolDTO.GradingProtocolTechinqueDTO;
import se.umu.cs.pvt.technique.Technique;

/**
 * JPARepository for GradingProtocol
 * @author Calzone
 */

public interface GradingProtocolRepository extends JpaRepository<GradingProtocol, Long> {
    
    GradingProtocol findByBeltId(Long beltId);

    @Query("""
            SELECT 
                gpc
            FROM
                GradingProtocolCategory gpc
            WHERE
                gpc.protocolId = :protocolId
            """)
    List<GradingProtocolCategory> findAllByProtocolId(Long protocolId);

    @Query("""
            SELECT 
                new se.umu.cs.pvt.statistics.gradingprotocolDTO.GradingProtocolTechinqueDTO(t.name, gpt.techniqueId)
            FROM
                GradingProtocolTechnique gpt
            JOIN
                Technique t
            ON
                t.id = gpt.techniqueId
            WHERE
                gpt.categoryId = :categoryId
            """)
    List<GradingProtocolTechinqueDTO> findAllByCategoryId(Long categoryId);

}