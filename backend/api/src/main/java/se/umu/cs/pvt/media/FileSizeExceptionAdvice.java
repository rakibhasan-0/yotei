package se.umu.cs.pvt.media;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;

/**
 * Handles MaxUploadSizeExceededExceptions that is thrown when file-size of uploaded
 * file is larger than specified in application.yml
 *
 *  @author Dragon Dynasty
 *  date: 2023-05-30
 */
@ControllerAdvice
public class FileSizeExceptionAdvice {
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Object> handleFileSizeException(MaxUploadSizeExceededException e
    ){
        Map<String, Object> response = new HashMap<>();

        return new ResponseEntity<Object>("Filen är för stor! Maximalt 1GB är tillåten", HttpStatus.BAD_REQUEST);
    }
}
