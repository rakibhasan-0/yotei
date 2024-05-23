<!-- sign-off-sheet:start -->
<!-- sign-off-cadence:1 month -->

This is the Sign-Off page for the documentation in this repository. Once you have read
and understood the documentation, please sign-off by adding your name and date below.

| Name          | Date            |
|--|--|
| Orange | 22 May 2024 |
<!-- sign-off-sheet:end -->

# Examination API

API for handling examinations.

<api>
name: Returns all gradings.
path: GET /api/examination/all
examples:
  - name: 200
    request: GET /api/examination/all
    response:
      content-type: application/json
      body: |
        [
          {
            "gradingId": 1,
            "creatorId": 1,
            "beltId": 1,
            "step": 1,
            "techniqueStepNum": 1,
            "createdAt": "2024-05-03"
          },
          {
            "gradingId": 2,
            "creatorId": 2,
            "beltId": 2,
            "step": 1,
            "techniqueStepNum": 1,
            "createdAt": "2024-05-07"
          }
        ]
</api>

<api>
name: Creates a grading.
path: POST /api/examination/grading
body-params:
  parameters:
    grading: The grading object to be created.| Object
examples:
  - name: 200
    request: |
      POST /api/examination/grading
      {
        "creatorId": 1,
        "beltId": 1,
        "step": 1,
        "techniqueStepNum": 1
      }
    response:
      content-type: application/json
      body: |
        {
          "gradingId": 1,
          "creatorId": 1,
          "beltId": 1,
          "step": 1,
          "techniqueStepNum": 1,
          "createdAt": "2024-05-22"
        }
</api>

<api>
name: Deletes a grading.
path: DELETE /api/examination/grading/{grading_id}
query-params:
  parameters:
    grading_id: The id of the grading to be deleted.| Integer
examples:
  - name: 200
    request: DELETE /api/examination/grading/1
    response:
      content-type: application/json
      body: |
        {}
</api>

<api>
name: Updates a grading.
path: PUT /api/examination/grading
body-params:
  parameters:
    grading: The updated grading object.| Object
examples:
  - name: 200
    request: |
      PUT /api/examination/grading
      {
        "gradingId": 1,
        "creatorId": 1,
        "beltId": 2,
        "step": 2,
        "techniqueStepNum": 2
      }
    response:
      content-type: application/json
      body: |
        {}
</api>

<api>
name: Returns a grading by id.
path: GET /api/examination/grading/{grading_id}
query-params:
  parameters:
    grading_id: The id of the grading.| Integer
examples:
  - name: 200
    request: GET /api/examination/grading/1
    response:
      content-type: application/json
      body: |
        {
          "gradingId": 1,
          "creatorId": 1,
          "beltId": 1,
          "step": 1,
          "techniqueStepNum": 1,
          "createdAt": "2024-05-03"
        }
</api>

<api>
name: Returns gradings by creator id.
path: GET /api/examination/grading/creator/{creator_id}
query-params:
  parameters:
    creator_id: The id of the creator.| Integer
examples:
  - name: 200
    request: GET /api/examination/grading/creator/1
    response:
      content-type: application/json
      body: |
        [
          {
            "gradingId": 1,
            "creatorId": 1,
            "beltId": 1,
            "step": 1,
            "techniqueStepNum": 1,
            "createdAt": "2024-05-03"
          }
        ]
</api>

<api>
name: Creates an examinee.
path: POST /api/examination/examinee
body-params:
  parameters:
    examinee: The examinee object to be created.| Object
examples:
  - name: 200
    request: |
      POST /api/examination/examinee
      {
        "examineeId": 1,
        "gradingId": 1,
        "name": "John Doe"
      }
    response:
      content-type: application/json
      body: |
        {
          "examineeId": 1,
          "gradingId": 1,
          "name": "John Doe"
        }
</api>

<api>
name: Deletes an examinee.
path: DELETE /api/examination/examinee/{examinee_id}
query-params:
  parameters:
    examinee_id: The id of the examinee to be deleted.| Integer
examples:
  - name: 200
    request: DELETE /api/examination/examinee/1
    response:
      content-type: application/json
      body: |
        {}
</api>

<api>
name: Updates an examinee.
path: PUT /api/examination/examinee
body-params:
  parameters:
    examinee: The updated examinee object.| Object
examples:
  - name: 200
    request: |
      PUT /api/examination/examinee
      {
        "examineeId": 1,
        "gradingId": 1,
        "name": "Jane Doe"
      }
    response:
      content-type: application/json
      body: |
        {}
</api>

<api>
name: Creates an examinee pair.
path: POST /api/examination/pair
body-params:
  parameters:
    examinee_pair: The examinee pair object to be created.| Object
examples:
  - name: 200
    request: |
      POST /api/examination/pair
      {
        "examineePairId": 1,
        "examinee1Id": 1,
        "examinee2Id": 2
      }
    response:
      content-type: application/json
      body: |
        {
          "examineePairId": 1,
          "examinee1Id": 1,
          "examinee2Id": 2
        }
</api>

<api>
name: Deletes an examinee pair.
path: DELETE /api/examination/pair/{examinee_pair_id}
query-params:
  parameters:
    examinee_pair_id: The id of the examinee pair to be deleted.| Integer
examples:
  - name: 200
    request: DELETE /api/examination/pair/1
    response:
      content-type: application/json
      body: |
        {}
</api>

<api>
name: Returns all examinee pairs.
path: GET /api/examination/pair/all
examples:
  - name: 200
    request: GET /api/examination/pair/all
    response:
      content-type: application/json
      body: |
        [
          {
            "examineePairId": 1,
            "examinee1Id": 1,
            "examinee2Id": 2
          },
          {
            "examineePairId": 2,
            "examinee1Id": 3,
            "examinee2Id": 4
          }
        ]
</api>

<api>
name: Returns examinee pairs by grading id.
path: GET /api/examination/pair/grading/{grading_id}
query-params:
  parameters:
    grading_id: The id of the grading.| Integer
examples:
  - name: 200
    request: GET /api/examination/pair/grading/1
    response:
      content-type: application/json
      body: |
        [
          {
            "pair_id": 1,
            "examinee_1": {
              "id": 1,
              "name": "John Doe"
            },
            "examinee_2": {
              "id": 2,
              "name": "Jane Doe"
            }
          },
          {
            "pair_id": 2,
            "examinee_1": {
              "id": 3,
              "name": "Bob Smith"
            },
            "examinee_2": null
          }
        ]
</api>

<api>
name: Returns all examinees.
path: GET /api/examination/examinee/all
examples:
  - name: 200
    request: GET /api/examination/examinee/all
    response:
      content-type: application/json
      body: |
        [
          {
            "examineeId": 1,
            "gradingId": 1,
            "name": "John Doe"
          },
          {
            "examineeId": 2,
            "gradingId": 1,
            "name": "Jane Doe"
          }
        ]
</api>

<api>
name: Returns an examinee by id.
path: GET /api/examination/examinee/{examinee_id}
query-params:
  parameters:
    examinee_id: The id of the examinee.| Integer
examples:
  - name: 200
    request: GET /api/examination/examinee/1
    response:
      content-type: application/json
      body: |
        {
          "examineeId": 1,
          "gradingId": 1,
          "name": "John Doe"
        }
</api>

<api>
name: Creates an examination comment.
path: POST /api/examination/comment
body-params:
  parameters:
    examination_comment: The examination comment object to be created.| Object
examples:
  - name: 200
    request: |
      POST /api/examination/comment
      {
        "commentId": 1,
        "gradingId": 1,
        "examineeId": 1,
        "examineePairId": null,
        "techniqueName": "Punch",
        "comment": "Good form"
      }
    response:
      content-type: application/json
      body: |
        {
          "commentId": 1,
          "gradingId": 1,
          "examineeId": 1,
          "examineePairId": null,
          "techniqueName": "Punch",
          "comment": "Good form"
        }
</api>

<api>
name: Updates an examination comment.
path: PUT /api/examination/comment
body-params:
  parameters:
    examination_comment: The updated examination comment object.| Object
examples:
  - name: 200
    request: |
      PUT /api/examination/comment
      {
        "commentId": 1,
        "gradingId": 1,
        "examineeId": 1,
        "examineePairId": null,
        "techniqueName": "Punch",
        "comment": "Excellent form"
      }
    response:
      content-type: application/json
      body: |
        {}
</api>

<api>
name: Deletes an examination comment.
path: DELETE /api/examination/comment/{examination_comment_id}
query-params:
  parameters:
    examination_comment_id: The id of the examination comment to be deleted.| Integer
examples:
  - name: 200
    request: DELETE /api/examination/comment/1
    response:
      content-type: application/json
      body: |
        {}
</api>

<api>
name: Returns group comments by grading id and technique name.
path: GET /api/examination/comment/group/{grading_id}?technique_name={technique_name}
query-params:
  parameters:
    grading_id: The id of the grading.| Integer
    technique_name: The name of the technique.| String
examples:
  - name: 200
    request: GET /api/examination/comment/group/1?technique_name=Punch
    response:
      content-type: application/json
      body: |
        [
          {
            "examineePairId": null,
            "gradingId": 1,
            "techniqueName": "Punch",
            "comment": "Good form"
          },
          {
            "examineePairId": null,
            "gradingId": 1,
            "techniqueName": "Punch",
            "comment": "Needs improvement"
          }
        ]
</api>

<api>
name: Returns all examination comments.
path: GET /api/examination/comment/all
examples:
  - name: 200
    request: GET /api/examination/comment/all
    response:
      content-type: application/json
      body: |
        [
          {
            "commentId": 1,
            "gradingId": 1,
            "examineeId": 1,
            "examineePairId": null,
            "techniqueName": "Punch",
            "comment": "Good form"
          },
          {
            "commentId": 2,
            "gradingId": 1,
            "examineeId": null,
            "examineePairId": 2,
            "techniqueName": "Kick",
            "comment": "Needs improvement"
          }
        ]
</api>

<api>
name: Returns examinee comments by examinee id and technique name.
path: GET /api/examination/comment/examinee/{examinee_id}?technique_name={technique_name}
query-params:
  parameters:
    examinee_id: The id of the examinee.| Integer
    technique_name: The name of the technique.| String
examples:
  - name: 200
    request: GET /api/examination/comment/examinee/1?technique_name=Punch
    response:
      content-type: application/json
      body: |
        [
          {
            "examineeId": 1,
            "gradingId": 1,
            "techniqueName": "Punch",
            "comment": "Good form"
          }
        ]
</api>

<api>
name: Returns all comments for an examinee.
path: GET /api/examination/comment/examinee/all/{examinee_id}
query-params:
  parameters:
    examinee_id: The id of the examinee.| Integer
examples:
  - name: 200
    request: GET /api/examination/comment/examinee/all/1
    response:
      content-type: application/json
      body: |
        [
          {
            "examineeId": 1,
            "gradingId": 1,
            "techniqueName": "Punch",
            "comment": "Good form"
          },
          {
            "examineeId": 1,
            "gradingId": 1,
            "techniqueName": "Kick",
            "comment": "Needs improvement"
          }
        ]
</api>

<api>
name: Returns all comments for an examinee pair.
path: GET /api/examination/comment/pair/all/{examinee_pair_id}
query-params:
  parameters:
    examinee_pair_id: The id of the examinee pair.| Integer
examples:
  - name: 200
    request: GET /api/examination/comment/pair/all/1
    response:
      content-type: application/json
      body: |
        [
          {
            "examineePairId": 1,
            "gradingId": 1,
            "techniqueName": "Punch",
            "comment": "Good teamwork"
          },
          {
            "examineePairId": 1,
            "gradingId": 1,
            "techniqueName": "Kick",
            "comment": "Needs improvement"
          }
        ]
</api>



<api>
name: Returns examinee pair comments by examinee pair id and technique name.
path: GET /api/examination/comment/pair/{examinee_pair_id}?technique_name={technique_name}
query-params:
 parameters:
   examinee_pair_id: The id of the examinee pair.| Integer
   technique_name: The name of the technique.| String
examples:
 - name: 200
   request: GET /api/examination/comment/pair/1?technique_name=Punch
   response:
     content-type: application/json
     body: |
       [
         {
           "examineePairId": 1,
           "gradingId": 1,
           "techniqueName": "Punch",
           "comment": "Good teamwork"
         }
       ]
</api>

<api>
name: Creates an examination result.
path: POST /api/examination/examresult
body-params:
 parameters:
   examination_result: The examination result object to be created.| Object
examples:
 - name: 200
   request: |
     POST /api/examination/examresult
     {
       "resultId": 1,
       "examineeId": 1,
       "gradingId": 1,
       "techniqueName": "Punch",
       "pass": true
     }
   response:
     content-type: application/json
     body: |
       {
         "resultId": 1,
         "examineeId": 1,
         "gradingId": 1,
         "techniqueName": "Punch",
         "pass": true
       }
</api>

<api>
name: Updates an examination result.
path: PUT /api/examination/examresult
body-params:
 parameters:
   examination_result: The updated examination result object.| Object
examples:
 - name: 200
   request: |
     PUT /api/examination/examresult
     {
       "resultId": 1,
       "examineeId": 1,
       "gradingId": 1,
       "techniqueName": "Punch",
       "pass": false
     }
   response:
     content-type: application/json
     body: |
       {}
</api>

<api>
name: Returns all examination results.
path: GET /api/examination/examresult/all
examples:
 - name: 200
   request: GET /api/examination/examresult/all
   response:
     content-type: application/json
     body: |
       [
         {
           "resultId": 1,
           "examineeId": 1,
           "gradingId": 1,
           "techniqueName": "Punch",
           "pass": true
         },
         {
           "resultId": 2,
           "examineeId": 2,
           "gradingId": 1,
           "techniqueName": "Kick",
           "pass": false
         }
       ]
</api>

<api>
name: Returns examination results by grading id.
path: GET /api/examination/examresult/grading/{grading_id}
query-params:
 parameters:
   grading_id: The id of the grading.| Integer
examples:
 - name: 200
   request: GET /api/examination/examresult/grading/1
   response:
     content-type: application/json
     body: |
       {
         "totalTechniques": 10,
         "examineeResults": [
           {
             "examineeId": "1",
             "passedTechniques": "8",
             "name": "John Doe"
           },
           {
             "examineeId": "2",
             "passedTechniques": "6",
             "name": "Jane Doe"
           }
         ]
       }
</api>

<api>
name: Deletes an examination result.
path: DELETE /api/examination/examresult/{result_id}
query-params:
 parameters:
   result_id: The id of the examination result to be deleted.| Integer
examples:
 - name: 200
   request: DELETE /api/examination/examresult/1
   response:
     content-type: application/json
     body: |
       {}
</api>

<api>
name: Returns the result of all examinees on a given technique.
path: GET /api/examination/examresult/{grading_id}?technique_name={technique_name}
query-params:
 parameters:
   grading_id: The id of the grading.| Integer
   technique_name: The name of the technique.| String
examples:
 - name: 200
   request: GET /api/examination/examresult/1?technique_name=Punch
   response:
     content-type: application/json
     body: |
       [
         {
           "examinee_id": 1,
           "result": true
         },
         {
           "examinee_id": 2,
           "result": false
         }
       ]
</api>

<api>
name: Returns the result of all techniques for a given examinee.
path: GET /api/examination/examresult/{examinee_id}
query-params:
 parameters:
   examinee_id: The id of the examinee.| Integer
examples:
 - name: 200
   request: GET /api/examination/examresult/1
   response:
     content-type: application/json
     body: |
       [
         {
           "resultId": 1,
           "examineeId": 1,
           "gradingId": 1,
           "techniqueName": "Punch",
           "pass": true
         },
         {
           "resultId": 2,
           "examineeId": 1,
           "gradingId": 1,
           "techniqueName": "Kick",
           "pass": false
         }
       ]
</api>

<api>
name: Returns all examination protocols.
path: GET /api/examination/examinationprotocol/all
examples:
 - name: 200
   request: GET /api/examination/examinationprotocol/all
   response:
     content-type: application/json
     body: |
       [
         {
           "beltId": 1,
           "examinationProtocol": "Protocol details for belt 1"
         },
         {
           "beltId": 2,
           "examinationProtocol": "Protocol details for belt 2"
         }
       ]
</api>

<api>
name: Exports an examination to PDF.
path: GET /api/examination/exportpdf/{grading_id}
query-params:
 parameters:
   grading_id: The id of the grading.| Integer
examples:
 - name: 200
   request: GET /api/examination/exportpdf/1
   response:
     content-type: application/pdf
     body: |
       <binary PDF data>
</api>