package se.umu.cs.pvt.media;


import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;

public class MediaStorageOnDiskService implements StorageService{

    private String mediaStoragePath;
    private final String defaultPath = "/";

    public MediaStorageOnDiskService(String mediaStoragePath) {
        this.mediaStoragePath = mediaStoragePath;
    }

    public MediaStorageOnDiskService() {
        this.mediaStoragePath = defaultPath;
    }

    @Override
    public String store(MultipartFile file) throws IllegalArgumentException, IOException {
        String fullFileName = file.getOriginalFilename();
        File newFile = new File(this.mediaStoragePath + fullFileName);
        String[] splittedName = fullFileName.split("\\.", 2);
        Integer nDuplicates = 0;

        if(fullFileName == null || fullFileName == ""){
            throw new IllegalArgumentException("Cannot have empty name");
        }

        //While there already exists a file with same name...
        while(newFile.exists()){
            String fileEnding;
            nDuplicates ++;

            //If the file has a file-ending
            if(splittedName.length >=  2){
                fileEnding = "."+splittedName[1];
            }else{
                fileEnding = "";
            }

            //Adjust name of the file
            fullFileName = splittedName[0] +"("+nDuplicates.toString() +")"+ fileEnding;
            newFile = new File(this.mediaStoragePath+ fullFileName);
        }
        file.transferTo(newFile);


        return fullFileName;

    }


    @Override
    public Path load(String filename) {
        return null;
    }

    @Override
    public Resource loadAsResource(String filename) throws IOException {
        Resource fileAsResource = new FileSystemResource(mediaStoragePath + filename);
        if(fileAsResource.exists()){
            return fileAsResource;
        }else {
            throw new IOException("Specified file does not exist");
        }
    }

    @Override
    public void deleteAll() throws IOException {
        FileUtils.cleanDirectory(new File(mediaStoragePath));
    }

    @Override
    public void delete(String filename) throws IOException {
        File file = new File(this.mediaStoragePath+ filename);
        if (file.delete()) {
            return;
        } else {
            throw new IOException("Failed to delete file " + filename);
        }
    }

}
