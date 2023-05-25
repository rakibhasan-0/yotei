package se.umu.cs.pvt.media;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.commons.io.FileUtils;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.stubbing.Answer;
import org.springframework.core.io.FileSystemResource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;



/**
 * The tests for the Media API.
 *
 * @author Linus Landin
 * @author Adrian Alagic
 * date: 2023-05-22
 */
@ExtendWith(MockitoExtension.class)
class MediaControllerTest {

    //@Autowired
    private MediaController mediaController;

    @Mock
    private final MediaRepository mediaRepository = Mockito.mock(MediaRepository.class);

    @Mock
    private final MediaStorageOnDiskService mediaStorage = Mockito.mock(MediaStorageOnDiskService.class);

    private ArrayList<Media> media;
    private ArrayList<Media> emptyMedia;
    private ArrayList<Media> removeMedia;
    private ArrayList<Media> invalidMediaList;

    Media validMedia = new Media(1L, 2L, "testURl", false, true, "isATest");
    Media invalidMedia = new Media(2L, null, "testURl", false, true, "isATest");
    Media mediaToAdd = new Media(3L, 5L, "testURl", false, true, "isATest");
    Media mediaToRemove1 = new Media(4L, 6L, "testURl", false, true, "isATest");
    Media mediaToRemove2 = new Media(5L, 6L, "testURl", false, true, "isATest");

    @BeforeEach
    void init() throws IOException {
        media = new ArrayList<>();
        removeMedia = new ArrayList<>();
        emptyMedia = new ArrayList<>();
        invalidMediaList = new ArrayList<>();
        media.add(validMedia);
        media.add(mediaToAdd);
        media.add(mediaToRemove1);
        removeMedia.add(mediaToRemove1);
        removeMedia.add(mediaToRemove2);
        invalidMediaList.add(invalidMedia);
        mediaController = new MediaController(mediaRepository, mediaStorage );
    }


    @Test
    void shouldSucceedWhenAddingMedia() {
        Mockito.when(mediaRepository.saveAll(media)).thenReturn(media);

        ResponseEntity<Object> response = mediaController.addMedia(media);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void shouldFailWhenAddingEmptyMedia() {
        Mockito.when(mediaRepository.saveAll(emptyMedia)).thenThrow(DataIntegrityViolationException.class);

        ResponseEntity<Object> response = mediaController.addMedia(emptyMedia);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void shouldSucceedWhenRemovingMediaForTechnique() {

        ResponseEntity<Object> response = mediaController.removeMedia(removeMedia);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void shouldFailWhenRemovingMediaForInvalidMovement() {
        Mockito.doThrow(DataIntegrityViolationException.class).when(mediaRepository).deleteListOfMedia(invalidMedia.getMovementId(), invalidMedia.getUrl());

        ResponseEntity<Object> response = mediaController.removeMedia(invalidMediaList);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void shouldSuccedWhenRemovingMediaStoredLocally() {
        Mockito.doThrow(DataIntegrityViolationException.class).when(mediaRepository).deleteListOfMedia(invalidMedia.getMovementId(), invalidMedia.getUrl());

        ResponseEntity<Object> response = mediaController.removeMedia(invalidMediaList);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }





    @Test
    void shouldSucceedWhenRemovingAllMediaForTechnique() {
        Mockito.when(mediaRepository.findAllMediaById(mediaToRemove1.getMovementId())).thenReturn(removeMedia);

        ResponseEntity<Object> response = mediaController.removeAllMedia(mediaToRemove1.getMovementId());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void shouldFailWhenRemovingAllMediaForInvalidMovement() {
        Mockito.when(mediaRepository.findAllMediaById(mediaToRemove1.getMovementId())).thenReturn(removeMedia);
        Mockito.doThrow(DataIntegrityViolationException.class).when(mediaRepository).deleteAll();

        ResponseEntity<Object> response = mediaController.removeAllMedia(mediaToRemove1.getMovementId());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void shouldFailWhenRemovingAllMediaForNullId() {
        ResponseEntity<Object> response = mediaController.removeAllMedia(invalidMedia.getMovementId());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void shouldSucceedWhenRemovingSpecificMedia() {
        ResponseEntity<Object> response = mediaController.removeSpecificMedia(mediaToRemove1, mediaToRemove1.getMovementId());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void shouldFailWhenRemovingSpecificMediaThatIsInvalid() {
        Mockito.doThrow(DataIntegrityViolationException.class).when(mediaRepository).delete(invalidMedia);

        ResponseEntity<Object> response = mediaController.removeSpecificMedia(invalidMedia, invalidMedia.getMovementId());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void shouldSucceedWhenGettingAllMedia() {
        Mockito.when(mediaRepository.findAll()).thenReturn(media);
        ResponseEntity<List<Media>> response = mediaController.getMediaAll();
        List<Media> result = response.getBody();

        assertThat(result.size()).isEqualTo(media.size());
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void shouldFailWhenGettingAllMediaFromEmpty() {
        Mockito.when(mediaRepository.findAll()).thenReturn(emptyMedia);
        ResponseEntity<List<Media>> response = mediaController.getMediaAll();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void shouldSucceedWhenGettingTechniqueURLs() {
        Mockito.when(mediaRepository.findAllMediaById(validMedia.getMovementId())).thenReturn(media);

        ResponseEntity<Object> response = mediaController.getTechniqueURLs(validMedia.getMovementId());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void shouldFailWhenGettingTechniqueURLsOfNull(){
        ResponseEntity<Object> response = mediaController.getTechniqueURLs(invalidMedia.getMovementId());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void shouldFailWhenGettingTechniqueURLsOfEmpty() {
        Mockito.when(mediaRepository.findAllMediaById(anyLong())).thenReturn(emptyMedia);

        ResponseEntity<Object> response = mediaController.getTechniqueURLs(anyLong());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void handleFileUploadOkFileHttpStatusTest() throws IOException {
        String fileName = "testfile.tmp";
        MultipartFile multipartFile = new MockMultipartFile(fileName,
                fileName ,null, "Hello World".getBytes());
        Mockito.when(mediaStorage.store(multipartFile)).thenReturn(fileName);

        ResponseEntity<Object> response = mediaController.handleFileUpload(multipartFile);


        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

    }

    @Test
    void handleFileUploadOkFileReturnValueTest() throws IOException {
        String fileName = "testfile.tmp";
        MultipartFile multipartFile = new MockMultipartFile(fileName,
                fileName, null, "Hello World".getBytes());
        Mockito.when(mediaStorage.store(multipartFile)).thenReturn(fileName);

        ResponseEntity<Object> response = mediaController.handleFileUpload(multipartFile);


        assertThat(response.getBody()).isEqualTo("{\"filename\":\""+fileName +"\"}");

    }
    @Test
    void handleFileUploadNoNameOnFileTest() throws IOException {
        String fileName = "";
        MultipartFile multipartFile = new MockMultipartFile("bob",
                fileName ,null, "Hello World".getBytes());
        Mockito.doThrow(IllegalArgumentException.class).when(mediaStorage).store(multipartFile);

        ResponseEntity<Object> response = mediaController.handleFileUpload(multipartFile);


        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void serveMediaFileNotExistTest() throws IOException {
        String fileName = "";
        Mockito.doThrow(IOException.class).when(mediaStorage).loadAsResource(fileName);
        ResponseEntity<Object> response = mediaController.serveMediaFile(fileName);


        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.EXPECTATION_FAILED);
    }

    @Test
    void serveMediaFileOkTest() throws IOException {
        String fileName = "testFile.tmp";
        List<String> lines = Arrays.asList("hello world");
        Path file = Paths.get(fileName);
        Files.write(file, lines, StandardCharsets.UTF_8);

        Mockito.when(mediaStorage.loadAsResource(fileName)).thenReturn(new FileSystemResource(fileName));
        ResponseEntity<Object> response = mediaController.serveMediaFile(fileName);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        //Teardown. Delete created file.
        FileUtils.deleteQuietly(new File( fileName ));
    }




}

