package se.umu.cs.pvt.gradingprotocol;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.responses.*;
import io.swagger.v3.oas.annotations.Operation;
import se.umu.cs.pvt.gradingprotocol.DTOs.BeltIdDTO;
import se.umu.cs.pvt.gradingprotocol.DTOs.CategoryDTO;
import se.umu.cs.pvt.gradingprotocol.DTOs.GradingProtocolDTO;

import java.util.ArrayList;
import java.util.List;


/**
 * Class for handling requests to the GradingProtocol API.
 *
 * @author Cocount 
 * @version 1.0
 * @since 2024-05-20
 */
@RestController
@RequestMapping(path = "/api/grading_protocol")
public class GradingProtocolController {
    
    private GradingProtocolRepository gradingProtocolRepository;

    @Autowired
    public GradingProtocolController(GradingProtocolRepository gradingProtocolRepository) {
        this.gradingProtocolRepository = gradingProtocolRepository;
    }

    @Operation(summary = "Returns all belt ids that have a grading protocol associated with them in the database.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "OK - Successfully retrieved"),
    })
    @GetMapping("/belts")
    public ResponseEntity<List<BeltIdDTO>> getSessionReviewStatistics() {
        List<BeltIdDTO> belts = gradingProtocolRepository.findAllBelts();

        return new ResponseEntity<>(belts, HttpStatus.OK);
    }

    @Operation(summary = "Returns the grading protocol associated with the belt specified by the parameter.", 
               description = "Must include the id of the belt of the grading protocol as a request parameter.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "OK - Successfully retrieved"),
        @ApiResponse(responseCode = "204", description = "No content - Found no protocol associated with the belt id")
    })
    @GetMapping("")
    public ResponseEntity<GradingProtocolDTO> getGradingProtocolView(@RequestParam Long beltId){

        // Get the protocol associated with the belt.
        GradingProtocol protocol = gradingProtocolRepository.findByBeltId(beltId);

        if (protocol == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            // Find categories and build response object.
            List<GradingProtocolCategory> categories = gradingProtocolRepository.findAllByProtocolId(protocol.getId());
            List<CategoryDTO> responseCategories = new ArrayList<>();

            // Find the techinuqes associated with each category.
            for (GradingProtocolCategory cat : categories) {
                CategoryDTO newCategory = new CategoryDTO(cat.getCategoryName(), gradingProtocolRepository.findTechniqueDTOsByCategory(cat.getId()));  
                responseCategories.add(newCategory);       
            }

            GradingProtocolDTO response = new GradingProtocolDTO(protocol.getCode(), protocol.getName(), responseCategories);

            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

}