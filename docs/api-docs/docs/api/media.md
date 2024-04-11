<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Dragon      | 1st June 2023   |
<!-- sign-off-sheet:end -->

# Media API

API for handling media. Both files and meta-data.

<!-- write documentation here! -->

<api>
name: Add media 
path: POST /api/media/
locked: true
text: |
    Add media-meta-data (url, if the media is locally stored, if its an image, 
    the id of the exercise or technique, description to the media)
body:
    type: application/json
    parameters:
        movementId: The id of the technique or exercise that the media is added to | 10
        url: Url where the media-resource can be accessed | "https://www.youtube.com/watch?v=GIhcL8K4shg"
        localStorage: true if the media is stored on server. False if stored on other place. | false
        image: true if media is an image, false otherwise | false
        description: a description to the media | "Jocke spelar wow"
        
examples:
  - name: 200
    request: |
        POST /api/media
        
        [
            {
                "movementId":10,
                "url":"https://www.youtube.com/watch?v=GIhcL8K4shg",
                "localStorage":false,
                "image":false,
                "description":"Jocke spelar wow"
            }
        ]
        
    response:
        content-type: text/plain
        body: "Media-uppladdning lyckades!"
</api>


<api>
name: Remove all
path: DELETE /api/media/remove-all/{id}
locked: true
text: |
    Removes all existing media belonging to a technique/exercise in the database. If media is stored locally, removes the file.
path-params:
    parameters:
        id: The id of the exercise/technique's media to delete. | 1

examples:
  - name: 200
    request: |
        DELETE /api/media/remove-all/1

    response:
        content-type: text/plain
        body: 

  - name: 400
    request: |
        DELETE /api/media/remove-all/-100

    response:
      content-type: text/plain
      body:
</api>


<api>
name: Remove media
path: DELETE /api/media
locked: true
text: |
    Removes a list of media-objects and. If media is stored locally, removes the file.
body:
    type: application/json
    parameters:
        movementId: The id of the technique or exercise that the media is added to | 10
        url: Url where the media-resource can be accessed | "https://www.youtube.com/watch?v=GIhcL8K4shg"
        localStorage: true if the media is stored on server. False if stored on other place. | false
        image: true if media is an image, false otherwise | false
        description: a description to the media | "Jocke spelar wow"
examples:
  - name: 200
    request: |
        DELETE /api/media

        {
            "movementId":10,
            "url":"https://www.youtube.com/watch?v=GIhcL8K4shg",
            "localStorage":false,
            "image":false,
            "description":"Jocke spelar wow"
        }

    response:
        content-type: text/plain
        body: 
  
  - name: 400
    request: |
        DELETE /api/media/

        {
            "movementId":-100,
            "url":"https://www.youtube.com/watch?v=GIhcL8K4shg",
            "localStorage":false,
            "image":false,
            "description":"Jocke spelar wow"
        }

    response:
      content-type: text/plain
      body:
</api>


<api>
name: Get all media
path: GET /api/media
locked: true
text: |
    Returns all media-meta-data as a list.
examples:
  - name: 200
    request: | 
        GET /api/media

    response:
        content-type: application/json
        body: |
            [{
                    "movementId":1,
                    "url":"https://www.youtube.com/watch?v=GIhcL8K4shg",
                    "localStorage":false,
                    "image":false,
                    "description":"Jocke spelar wow"
               },
               {
                    "movementId":3,
                    "url":"https://i.kym-cdn.com/entries/icons/mobile/000/031/003/cover3.jpg",
                    "localStorage":false,
                    "image":true,
                    "description":"When you fail to rank up to black belt"
               }
            ]
</api>


<api>
name: Get movement media
path: GET /api/media/{id}
locked: true
text: |
    Returns all media-meta-data belonging to a exercise/technique as a list.
path-params:
    parameters:
        id: The id of the exercise/technique. | 1
examples:
  - name: 200
    request: |
        GET /api/media/1

    response:
        content-type: application/json
        body: |
            [
               {
                    "movementId": 1,
                    "url": "https://www.youtube.com/watch?v=GIhcL8K4shg",
                    "localStorage":false,
                    "image":false,
                    "description":"Jocke spelar wow"
               },
               {
                    "movementId":1,
                    "url": "https://i.kym-cdn.com/entries/icons/mobile/000/031/003/cover3.jpg",
                    "localStorage":false,
                    "image":true,
                    "description":"When you fail to rank up to black belt"
               }
            ]
</api>

<api>
name: Handle file upload
path: POST /api/media/upload
locked: true
text: |
    Endpoint to upload a media-file. Response is the filename that the file is stored as. 
body:
    type: multipart/form-data
    content: Represents a binary part of a multipart/form-data payload where the content of the part is binary or the content of the file itself.
examples:
  - name: 200
    request: |
        POST /api/media/upload

        text: A file with name 'cat.png' is insterted in the form-data

    response:
        content-type: application/json
        body: |
            {
                "filename": "cat(1).png"
            }
</api>


<api>
name: Serve media-file
path: GET /api/media/files/{filename}
locked: false
text: |
    Returns media-file as a resource if file with name 'filename' exists
path-params:
    parameters:
        filename: The name of the file that is requested. | "cat(1).png"
examples:
  - name: 200
    request: | 
        GET /api/media/files/cat(1).png

    response:
        content-type: text/plain
        body: |
            The file-data
  - name: 417
    request: | 
        GET /api/media/files/fileThatDoesNotExist.tmp

    response:
        content-type: text/plain
        body: |
            Kunde inte hitta önskad resurs på server
</api>
