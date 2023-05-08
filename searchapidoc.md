# API DOCS

Documentation for the Search API calls to the Budoklubb API. 

## Searching Techniques(Tekniker)

### API Endpoint:

    (GET) /api/search/techniques

### Params:

| Query | Explanation | Example | Type | Status |
|--|--|--|--|--|
| name | Name of technique | Karate-kick | String | Works(not tested)
| beltColors | Name of the belt colors | grön-barn,grön | List of Strings separated by ',' | Works(not tested) |
| kihon | If the technique is kihon | true/false | Boolean | Not implemented |
| tags | Tags related to the techniques | kniv,spark | List of Strings separated by ',' | Works(not tested) |

### Example query:

    (GET) /api/search/techniques?name=lm+ao&beltColors=grön,grön-barn&kihon=false&tags=kniv,spark

### Example Response

    {
    	result: [
    		{
    			techniqueID: 1,
    			name: "Backflip karate kick",
    			description: "A karate kick while doing a backflip",
    			beltColors: [
    				{ colorCode: "#123123", isChild: false, name: "shiny green" },
    				{ colorCode: "#123124", isChild: true, name: "shinier green" }
    			]
    		},
    		{
    			techniqueID: 2,
    			name: "Frontflip karate kick",
    			description: "A karate kick while doing a frontflip",
    			beltColors: [
    				{colorCode: "#123125", isChild: true, name: "shiniest green"}
    			]
    		}
    	],
    	tagCompletion: ["tag1", "tag2", "tag3"]
    }

### Extra

If no name is entered the result will be filtered based on the order for the techniques. This order is decided by weights contained by each technique and is based on the book that the customer uses.

If a name is entered the search result will be sorted based on the fuzzy search algorithm.

## Searching Workouts(Pass)

### API Endpoint:

    (GET) /api/search/workouts

### Params

| Query | Explanation | Example | Type | Status |
|--|--|--|--|--|
| name | Name of the Workout | Nybörjarpass | String | Works(not tested) |
| tags | Tags related to the Workout | kniv,spark | List of Strings seperated by ',' | Not implemented |
| from | Workouts starting from this date | 2023-04-20 | String with format (YYYY-MM-DD) | Works(not tested) |
| to | Workouts up until this date | 2023-06-09 | String with format (YYYY-MM-DD) | Works(not tested) |
| favourite | If the workout is a favourite | true/false | Boolean | Works(not tested) |
| id | The id of the user | 1 | Number | Works(not tested) |

Note that the ID is required to filter with favoruite. If no ID is given, the favoruite filter is not used.

### Example query:

    (GET) /api/search/workouts?name=lmao&from=2023-04-20&to=2023-04-20&favourite=false&tags=kniv,spark&id=1

### Example response

    {
    	result: [
    		{
    			workoutID: 1,
    			favourite: false,
    			name: "Some workout"
    		},
    		{
    			workoutID: 2,
    			favourite: true,
    			name: "Some other workout"
    		}
    	],
    	tagCompletion: ["tag1", "tag2", "tag3"]
    }

## Searching Exercises(Övningar)

### API Endpoint:

  

    (GET) /api/search/exercises

  

### Params

| Query | Explanation | Example | Type | Status |
|--|--|--|--|--|
| name | Name of the exercise | Kung fu kick | String | Not implemented |
| tags | Tags associated with the Exercise | kniv,spark | String | Not implemented |

### Example query:

    (GET) /api/search/exercises?name=something+something&tags=kniv,spark

### Example response:

    {
	    result: [
		    {
			    exerciseID: 1,
		        description: "Cool exercise",
		        duration: 13
		    },
	        {
			    exerciseID: 2,
			    description: "Another cool exercise",
			    duration: 14
		    }
	    ],
	    tagCompletion: ["tag1", "tag2", "tag3"]
    }

## Searching Plans(Grupplanering) NOT IMPLEMENTED

### API Endpoint:

    (GET) /api/search/plans

### Params

| Query | Explanation | Example | Type | Status |
|--|--|--|--|--|
| from | Sessions starting from this date | 2023-04-20 | String with format (YYYY-MM-DD) | Not implemented |
| to | Sessions up until this date | 2023-04-20 | String with format (YYYY-MM-DD) | Not implemented |
| previousSessions | Include session before given from date | true/false | Boolean | Not implemented |
| plans | ID's of specific groups to search for | 6,9,4,2,0 | List of Numbers divided by ',' | Not implemented |
| id | ID of the user making the search | 1 | Number | Not implemented |


### Example query:

    (GET) /api/search/plans?from=2023-04-20&to=2023-04-20&previousSessions=false&plans=1,2,3&id=1

### Example response

    {
    	result: [
    		{
    			planID: 1,
				name: "Cool plan 1",
    			planColors: [
    				{ colorCode: "#123123", isChild: false, name: "orange" },
    				{ colorCode: "#123124", isChild: true, name: "orangier" }
    			],
    			sessions: [
    				{
    					sessionID: 1,
    					date: "2023-04-20",
    					time: "14:30",
    					text: "Sheesh"
    				},
    				{
    					sessionID: 2,
    					date: "2023-04-27",
    					time: "14:30"
    					text: "Sheesh"
    				}
    			]
    		},
    		{
    			planID: 2,
				name: "Cool group 2",
    			planColors: [],
    			sessions: []
    		}
    	]
    }

  

## Extra

The tag completion array consists of a maximum of 3 tags that were found, these tags are based on the 'name' query parameter that was entered.

## Searching Tags(Taggar) NOT IMPLEMENTED

### API Endpoint:

    (GET) /api/search/tags

### Params

| Query | Explanation | Example | Type | Status |
|--|--|--|--|--|
| name | Name of tag | Karate-kick | String | Not implemented
| tagAmount | Number of tag suggestions to return | 3 | Number | Not implemented
| tags | Already chosen tags | kniv,spark | List of Strings seperated by ',' | Not implemented |

### Example query:

    (GET) /api/search/tags?name=lmao&tagAmount=3&tags=kniv,spark

### Example response

    {
    	result: [
    		{
    			tagID: 1,
				tagName: "tagSuggestion1"
    		},
    		{
    			tagID: 2,
				tagName: "tagSuggestion2"
    		},
    		{
    			tagID: 3,
				tagName: "tagSuggestion3"
    		}
    	]
    }

  
## Extra

The returned tags are based on the 'name' query parameter that was entered using fuzzy search. 
