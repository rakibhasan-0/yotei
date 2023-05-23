package se.umu.cs.pvt.media;


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
    public void store(MultipartFile file) throws IOException {
        File newFile = new File(this.mediaStoragePath + file.getOriginalFilename());
        file.transferTo(newFile);
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
            throw new IOException("Error: Specified file does not exist");
        }
    }

    @Override
    public void deleteAll() {

    }

    @Override
    public void delete(String filename) {

    }

}
