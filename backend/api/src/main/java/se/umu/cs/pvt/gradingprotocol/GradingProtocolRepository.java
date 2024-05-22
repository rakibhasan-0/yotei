package se.umu.cs.pvt.gradingprotocol;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import se.umu.cs.pvt.gradingprotocol.DTOs.BeltIdDTO;
import se.umu.cs.pvt.gradingprotocol.DTOs.TechniqueDTO;
import se.umu.cs.pvt.statistics.gradingprotocolDTO.GradingProtocolTechinqueDTO;

/**
 * JPARepository for GradingProtocol
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-20
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

    @Query("""
            SELECT
                new se.umu.cs.pvt.gradingprotocol.DTOs.BeltIdDTO(gp.belt.id)
            FROM
                GradingProtocol gp
            """)
    List<BeltIdDTO> findAllBelts();

    @Query("""
            SELECT 
                new se.umu.cs.pvt.gradingprotocol.DTOs.TechniqueDTO(gpt.order ,t.name)
            FROM
                GradingProtocolTechnique gpt
            JOIN
                Technique t
            ON
                t.id = gpt.techniqueId
            WHERE
                gpt.categoryId = :categoryId
            """)
    List<TechniqueDTO> findTechniqueDTOsByCategory(Long categoryId);   

}