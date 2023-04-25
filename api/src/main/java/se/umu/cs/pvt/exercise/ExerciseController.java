package se.umu.cs.pvt.exercise;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;


/**
 * Class to get, insert, update, and remove exercise.
 *
 * @author Quattro Formaggio, Carlskrove, Hawaii
 */
@RestController
@CrossOrigin
@RequestMapping(path = "/api/exercises")
public class ExerciseController {
    private ExerciseRepository exerciseRepository;

    @Autowired
    public ExerciseController(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    /**
     * Returns all exercises in the database
     * @return all exercises
     */
    @GetMapping("/all")
    public Object getExercises() {
        List<Exercise> exerciseList = exerciseRepository.findAll();

        if (exerciseList == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return exerciseList;
    }

    /**
     * Returns an exercise depending on the id
     * @param id the id
     * @return exercise if exercise could be gotten, else a HttpStatus
     * indicating error
     */
    @GetMapping("/{id}")
    public Object getExercise(@PathVariable("id") Long id) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        
        if (!exerciseRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Exercise exercise = exerciseRepository.findById(id).get();
        return exercise;
    }

    /**
     * Returns the description and time of specified exercise given an id
     * @param id The id to query to the database 
     * @return Description and time for exercise, or if exercise could not be found:
     * response indicating error.
     */
    @GetMapping("/getdesc")
    public Object getDescription(@RequestParam Long id) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (!exerciseRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        ExerciseDropDownProjection exercise = exerciseRepository.getExerciseDropDownById(id).get();
        return exercise;
    }

    /**
     * Returns all exercises with only id and name
     * @return all exercises, or a response indicating if there is error.
     */
    @GetMapping("/all/idname")
    public Object getExercisesIdName() {
        List<ExerciseShort> exerciseList = exerciseRepository.findAllProjectedBy(ExerciseShort.class);

        if (exerciseList == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return exerciseList;
    }

    /**
     * This method adds an exercise to the database.
     *
     * Returns 409 CONFLICT if exercise name already taken
     * Returns 400 BAD_REQUEST if exercise is not valid format
     * Returns 200 OK if exercise is posted
     *
     * @param toAdd the body in json format with correct attributes example:
     *              {"name": "cool_name", "description": "cool_desc", "duration": 2}
     *
     * @return response BAD_REQUEST if request was bad, else OK if exercise
     * was added, also returns the exercise
     */
    @PostMapping("/add")
    public ResponseEntity<Object> postExercise(@RequestBody Exercise toAdd) {

        
        toAdd.trimText();

        
        if (!exerciseRepository.findByNameIgnoreCase(toAdd.getName()).isEmpty()) {
            return new ResponseEntity<>(toAdd,HttpStatus.CONFLICT);
        }

        
        if (!toAdd.validFormat()) {
            return new ResponseEntity<>("Fel format",HttpStatus.BAD_REQUEST);
        }

        try {
            exerciseRepository.save(toAdd);
        } catch (Exception e) {
            return new ResponseEntity<>("Kunde inte spara till databasen", HttpStatus.NOT_ACCEPTABLE);
        }

        return new ResponseEntity<>(toAdd, HttpStatus.OK);
    }

    /**
     * Takes forwarded content from JSON file and saves it to the databse
     * as individual JSON objects. Saves only those exercises that have valid
     * format.
     *
     * @param listImport The list of JSON objects
     * @return response indicating if import worked or was BAD_REQUEST. Also
     * BAD_REQUEST if some exercise has invalid format.
     */
    @PostMapping("/import")
    public ResponseEntity<ExerciseImportResponse> postImport(@RequestBody List<Exercise> listImport) {
        int duplicates = 0;
        int i = 0;
        List<Long> ids = new ArrayList<>();

        if (listImport == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        for (Exercise exercise : listImport) {
            i++;
            if(exercise.validFormat()) {
                exercise.trimText();
                try {
                    ids.add(exerciseRepository.save(exercise).getId());
                } catch (Exception e) {
                    ids.add(exerciseRepository.findByName(exercise.getName()).getId());
                    duplicates += 1;
                }
            }
            else {
                return new ResponseEntity<>(new ExerciseImportResponse("Övningar fram till " + i +  ".\"" + exercise.getName() + "\" har importerats", ids), HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }

        if(duplicates > 0) {
            return new ResponseEntity<>(new ExerciseImportResponse(duplicates + " övningar av samma namn existerar redan", ids), HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>(new ExerciseImportResponse("", ids), HttpStatus.OK);
    }


    /**
     * This method updates an existing exercise in the database
     * @param toUpdate the body in json format with correct attributes example:
     *                   {"id": 1, "name": "cool_name", "description": "cool_desc", "duration": 2}
     */
    @PutMapping("/update")
    public ResponseEntity<Object> updateExercise(@RequestBody Exercise toUpdate) {
        
        if (exerciseRepository.findById(toUpdate.getId()).isEmpty()) {
            return new ResponseEntity<>(toUpdate, HttpStatus.BAD_REQUEST);
        }

        if (!toUpdate.validFormat()) {
            return new ResponseEntity<>("Fel format", HttpStatus.BAD_REQUEST);
        }

        try {
            exerciseRepository.save(toUpdate);
        } catch (Exception e) {
            return new ResponseEntity<>("Kunde inte uppdatera övning", HttpStatus.NOT_ACCEPTABLE);
        }

        return new ResponseEntity<>(toUpdate, HttpStatus.OK);
    }

    /**
     * This method removes an existing exercise in the database. If the exercise does not exist in the database a
     * BAD_REQUEST is returned.
     * @param id The Id of the exercies to remove.
     * @return Returns OK if the exercise exists in the database, else BAD_REQUEST.
     */
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Exercise> removeExercise(@PathVariable("id") Long id) {
        if (exerciseRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Exercise exercise = exerciseRepository.findById(id).get();
        exerciseRepository.delete(exercise);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * This method saves an image to ./database/images/
     * Supported format: only BMP, GIF, JPG and PNG are recognized
     * Note: right now the image is not associated with any exercise or technique.
     * This method only save an image to the server.
     *
     * @param file The image to save
     * @return Returns OK if the picture could be saved, otherwise NOT_ACCEPTABLE
     *
     * @author Per Sondell (Group 6)
     */
    @PostMapping(value = "/image",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Object image(@RequestParam("file") MultipartFile file) {
        try {
            InputStream input = file.getInputStream();
            // It's an image (only BMP, GIF, JPG and PNG are recognized).
            ImageIO.read(input).toString();
        } catch (IOException | NullPointerException e) {
            //invalid file type
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }

        String folder = "./database/images/";
        try {
            byte[] bytes = file.getBytes();
            Path path = Paths.get(folder + file.getOriginalFilename());
            Files.write(path,bytes);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

}