
Swagger UI
PlagiarismSearch.com RESTful API

 3.1.0 

OAS 3.1

https://plagiarismsearch.com/docs/swagger.yaml
Welcome to the PlagiarismSearch API

PlagiarismSearch API is built to allow you to create an integration quickly and easily.

It follows a REST-based structure. If you've previously engaged with a RESTful API, you'll find many of the principles quite familiar.

You must be registered as a PlagiarismSearch user and have an active API profile. Base URL for API requests is https://plagiarismsearch.com/api/v3.

All configs are on the user API page My profile > API (https://plagiarismsearch.com/account/api).
Steps to Get our Plagiarism Detection API

    Contact us at services@plagiarismsearch.com for detailed information
    Describe your organization’s requirements to receive a quote
    Receive and integrate our API
    Keep in touch with us to receive API updates
    We will ensure you get instant help and a comprehensive response!

Plagiarism check Workflow

    Submit the text, file or public URL for plagiarism check /reports/create
    If your balance is active, plagiarism check process will be started automatically after the file upload. The report goes to a queue to be checked.
    Wait until the process of plagiarism check is completed. PlagiarismSearch will send POST request with ReportCheckedWebhook payload to the callback URL when the check is finished. If data on ReportCheckedWebhook payload is not enough you can call GET /reports/{id} method method and get all the report data
    You can also Update some fields of the Report or Delete it

 

Old documentation

PlagiarismSearch API: Questions and Answers

Report statuses

Php sample API code
Terms of service
Contact the developer
Find out more about PlagiarismSearch API
Servers
Reports

Methods for plagiarism check processing
POST
/reports/create
Add a new report (Submit the document for plagiarism check)

Add a new report (Submit the document for plagiarism check)
CURL example to send text for plagiarism check with custom callback_url

curl -X 'POST' \
'https://plagiarismsearch.com/api/v3/reports/create' \
-H 'Content-Type: application/json' \
-H 'Authorization: your:authorization_token_123' \
-d '{
  "callback_url": "https://plagiarismsearch.com/web-hook?id=100500",
  "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic."
}'

CURL example to send file for plagiarism check on Web and on Storage too

curl -X 'POST' \
'https://plagiarismsearch.com/api/v3/reports/create' \
-H 'Authorization: your:authorization_token_123' \
-F 'is_search_web="1"' \
-F 'is_search_storage="1"' \
-F 'document=@test_file_plagiarism.txt;type=text/plain' \
-F 'is_json=1'        

Parameters

No parameters
Request body

Create report object that needs to be added to checking.

One of fields text, document, url is required and should contain a text

{
  "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic.",
  "document": "string",
  "url": "https://plagiarismsearch.com/files/plagiarismsearch-mission-and-core-values.pdf",
  "title": "PlagiarismSearch_test.txt",
  "callback_url": "https://plagiarismsearch.com/callback-url",
  "remote_id": "exp-123456",
  "is_search_web": 1,
  "is_search_filter_chars": 0,
  "is_search_filter_references": 0,
  "is_search_filter_quotes": 0,
  "search_web_disable_urls": [],
  "search_web_exclude_urls": [],
  "is_search_ai": 1,
  "is_search_storage": 1,
  "is_search_storage_organization": 0,
  "is_add_storage": 1,
  "search_storage_filter": {
    "file_id": [
      100,
      500
    ],
    "user_id": [
      42,
      2
    ],
    "group_id": [
      100,
      500
    ]
  },
  "search_storage_user_group": [
    2,
    500
  ],
  "search_storage_proximity": 0.9,
  "search_storage_sensibility_percentage": 40,
  "search_storage_sensibility_words": 3,
  "storage_group_id": 500,
  "storage_user_id": 42,
  "storage_file_id": 100500,
  "limit_words": null,
  "is_json": 1,
  "force": 0
}

Responses
Code	Description	Links
202	

Successful operation
Media type
Controls Accept header.

{
  "status": true,
  "version": "3.0.1",
  "code": 202,
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "progress": 0.58,
    "status": 2,
    "status_label": "checked",
    "type": 1,
    "plagiarism": 32.46,
    "ai_probability": 10.2,
    "ai_average_probability": null,
    "file_id": 191,
    "title": "PlagiarismSearch_test.txt",
    "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic.",
    "length": 379,
    "length_raw": 453,
    "words": 453,
    "checked_words": 379,
    "language": "en",
    "similarity": 32.46,
    "originality": 67.54,
    "search_web": 1,
    "comment_key": "054ad22959ef49bc0618f4fb8fdc0ccc",
    "search_storage": 1,
    "search_storage_filter": {
      "file_id": [
        100,
        500
      ],
      "user_id": [
        42,
        500
      ],
      "group_id": [
        100,
        500
      ]
    },
    "storage_id": null,
    "search_ai": 1,
    "warnings": [],
    "links": []
  }
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
GET
/reports
List of reports

List of reports (You can use both methods GET or POST)
Parameters
Name	Description
show_relations
integer
(query)
	

Return report relations. (Full report data).

Acceptable values are:

    0: Returns basic information of the report (default).
    1: Returns all report data as a tree. Paragraphs, sentences and sources with highlighted text (data.paragraphs response field).
    -1: Returns all report raw data (data.paragraphs, data.blocks, data.sources response fields).
    -2: Returns the list of sources in plagiarism percent order (data.sources response field). (Better way is use /reports/sources/{id} route)
    -3: Returns html report content (data.html response field). (Better way is use /reports/html/{id} route)

Available values : 0, 1, -1, -2, -3
ids
array[integer]
(query)
	

Array of item ids.
remote_id
string
(query)
	

Local document id.
page
integer
(query)
	

Page number (Pagination).

Default value : 1
limit
integer
(query)
	

Items per page (Pagination).

Default value : 10
Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": [
    {
      "id": 100500,
      "auth_key": "32bed7dc477b4a9270818d941157952c",
      "remote_id": "exp-123456",
      "user_id": 42,
      "created": 1692955105,
      "modified": 1692955874,
      "notified": 1692955878,
      "progress": 0.58,
      "status": 2,
      "status_label": "checked",
      "type": 1,
      "plagiarism": 32.46,
      "ai_probability": 10.2,
      "ai_average_probability": null,
      "file_id": 191,
      "title": "PlagiarismSearch_test.txt",
      "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic.",
      "length": 379,
      "length_raw": 453,
      "words": 453,
      "checked_words": 379,
      "language": "en",
      "similarity": 32.46,
      "originality": 67.54,
      "search_web": 1,
      "comment_key": "054ad22959ef49bc0618f4fb8fdc0ccc",
      "search_storage": 1,
      "search_storage_filter": {
        "file_id": [
          100,
          500
        ],
        "user_id": [
          42,
          500
        ],
        "group_id": [
          100,
          500
        ]
      },
      "storage_id": null,
      "search_ai": 1,
      "warnings": [],
      "links": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "count": 42
  }
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
GET
/reports/{id}
Get report data

Get report data (You can use both methods GET or POST)
Parameters
Name	Description
id *
integer
(path)
	

Item id.
show_relations
integer
(query)
	

Return report relations. (Full report data).

Acceptable values are:

    0: Returns basic information of the report (default).
    1: Returns all report data as a tree. Paragraphs, sentences and sources with highlighted text (data.paragraphs response field).
    -1: Returns all report raw data (data.paragraphs, data.blocks, data.sources response fields).
    -2: Returns the list of sources in plagiarism percent order (data.sources response field). (Better way is use /reports/sources/{id} route)
    -3: Returns html report content (data.html response field). (Better way is use /reports/html/{id} route)

Available values : 0, 1, -1, -2, -3
Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "progress": 0.58,
    "status": 2,
    "status_label": "checked",
    "type": 1,
    "plagiarism": 32.46,
    "ai_probability": 10.2,
    "ai_average_probability": null,
    "file_id": 191,
    "title": "PlagiarismSearch_test.txt",
    "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic.",
    "length": 379,
    "length_raw": 453,
    "words": 453,
    "checked_words": 379,
    "language": "en",
    "similarity": 32.46,
    "originality": 67.54,
    "search_web": 1,
    "comment_key": "054ad22959ef49bc0618f4fb8fdc0ccc",
    "search_storage": 1,
    "search_storage_filter": {
      "file_id": [
        100,
        500
      ],
      "user_id": [
        42,
        500
      ],
      "group_id": [
        100,
        500
      ]
    },
    "storage_id": null,
    "search_ai": 1,
    "warnings": [],
    "links": []
  }
}

	No links
202	

Accepted (Report is processing)
Media type

{
  "status": true,
  "version": "3.0.1",
  "code": 202,
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "progress": 0.58,
    "status": 2,
    "status_label": "checked",
    "type": 1,
    "plagiarism": 32.46,
    "ai_probability": 10.2,
    "ai_average_probability": null,
    "file_id": 191,
    "title": "PlagiarismSearch_test.txt",
    "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic.",
    "length": 379,
    "length_raw": 453,
    "words": 453,
    "checked_words": 379,
    "language": "en",
    "similarity": 32.46,
    "originality": 67.54,
    "search_web": 1,
    "comment_key": "054ad22959ef49bc0618f4fb8fdc0ccc",
    "search_storage": 1,
    "search_storage_filter": {
      "file_id": [
        100,
        500
      ],
      "user_id": [
        42,
        500
      ],
      "group_id": [
        100,
        500
      ]
    },
    "storage_id": null,
    "search_ai": 1,
    "warnings": [],
    "links": []
  }
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
GET
/reports/status/{id}
Get report status info

Check the status of the report (You can use both methods GET or POST)
Parameters
Name	Description
id *
integer
(path)
	

Item id.
Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "progress": 0.58,
    "status": 2,
    "status_label": "checked",
    "type": 1,
    "plagiarism": 32.46,
    "ai_probability": 10.2,
    "ai_average_probability": null
  }
}

	No links
202	

Accepted (Report is processing)
Media type

{
  "status": true,
  "version": "3.0.1",
  "code": 202,
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "progress": 0.58,
    "status": 2,
    "status_label": "checked",
    "type": 1,
    "plagiarism": 32.46,
    "ai_probability": 10.2,
    "ai_average_probability": null,
    "file_id": 191,
    "title": "PlagiarismSearch_test.txt",
    "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic.",
    "length": 379,
    "length_raw": 453,
    "words": 453,
    "checked_words": 379,
    "language": "en",
    "similarity": 32.46,
    "originality": 67.54,
    "search_web": 1,
    "comment_key": "054ad22959ef49bc0618f4fb8fdc0ccc",
    "search_storage": 1,
    "search_storage_filter": {
      "file_id": [
        100,
        500
      ],
      "user_id": [
        42,
        500
      ],
      "group_id": [
        100,
        500
      ]
    },
    "storage_id": null,
    "search_ai": 1,
    "warnings": [],
    "links": []
  }
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
GET
/reports/sources/{id}
Get grouped report's sources

Get grouped report's list of sources in plagiarism percent order (data.sources response field) (You can use both methods GET or POST)
Parameters
Name	Description
id *
integer
(path)
	

Item id.
Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "progress": 0.58,
    "status": 2,
    "status_label": "checked",
    "type": 1,
    "plagiarism": 32.46,
    "ai_probability": 10.2,
    "ai_average_probability": null,
    "file_id": 191,
    "title": "PlagiarismSearch_test.txt",
    "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic.",
    "length": 379,
    "length_raw": 453,
    "words": 453,
    "checked_words": 379,
    "language": "en",
    "similarity": 32.46,
    "originality": 67.54,
    "search_web": 1,
    "comment_key": "054ad22959ef49bc0618f4fb8fdc0ccc",
    "search_storage": 1,
    "search_storage_filter": {
      "file_id": [
        100,
        500
      ],
      "user_id": [
        42,
        500
      ],
      "group_id": [
        100,
        500
      ]
    },
    "storage_id": null,
    "search_ai": 1,
    "warnings": [],
    "links": [],
    "sources": [
      {
        "id": 1005002,
        "report_id": 100500,
        "status": 2,
        "status_label": "checked",
        "type": 1,
        "type_label": "web",
        "plagiarism": 51.020408,
        "plagiarism_quote": 30.020408,
        "matches": 57,
        "matches_quote": 0,
        "matched_words": 52,
        "count": 6,
        "length": 125,
        "title": "www.bbc.co.uk",
        "url": "https://www.bbc.co.uk/news/uk-scotland-highlands-islands-64875273",
        "view_url": "https://plagiarismsearch.com/sources/100500?rb=2100500&url=https%3A%2F%2Fwww.bbc.co.uk%2Fnews%2Fuk-scotland-highlands-islands-64875273"
      }
    ]
  }
}

	No links
202	

Accepted (Report is processing)
Media type

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "progress": 0.58,
    "status": 2,
    "status_label": "checked",
    "type": 1,
    "plagiarism": 32.46,
    "ai_probability": 10.2,
    "ai_average_probability": null,
    "file_id": 191,
    "title": "PlagiarismSearch_test.txt",
    "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic.",
    "length": 379,
    "length_raw": 453,
    "words": 453,
    "checked_words": 379,
    "language": "en",
    "similarity": 32.46,
    "originality": 67.54,
    "search_web": 1,
    "comment_key": "054ad22959ef49bc0618f4fb8fdc0ccc",
    "search_storage": 1,
    "search_storage_filter": {
      "file_id": [
        100,
        500
      ],
      "user_id": [
        42,
        500
      ],
      "group_id": [
        100,
        500
      ]
    },
    "storage_id": null,
    "search_ai": 1,
    "warnings": [],
    "links": [],
    "sources": [
      {
        "id": 1005002,
        "report_id": 100500,
        "status": 2,
        "status_label": "checked",
        "type": 1,
        "type_label": "web",
        "plagiarism": 51.020408,
        "plagiarism_quote": 30.020408,
        "matches": 57,
        "matches_quote": 0,
        "matched_words": 52,
        "count": 6,
        "length": 125,
        "title": "www.bbc.co.uk",
        "url": "https://www.bbc.co.uk/news/uk-scotland-highlands-islands-64875273",
        "view_url": "https://plagiarismsearch.com/sources/100500?rb=2100500&url=https%3A%2F%2Fwww.bbc.co.uk%2Fnews%2Fuk-scotland-highlands-islands-64875273"
      }
    ]
  }
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
GET
/reports/html/{id}
Get highlighted text of report

Get highlighted text of report (data.html response field) (You can use both methods GET or POST)
Parameters
Name	Description
id *
integer
(path)
	

Item id.
Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "progress": 0.58,
    "status": 2,
    "status_label": "checked",
    "type": 1,
    "plagiarism": 32.46,
    "ai_probability": 10.2,
    "ai_average_probability": null,
    "file_id": 191,
    "title": "PlagiarismSearch_test.txt",
    "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic.",
    "length": 379,
    "length_raw": 453,
    "words": 453,
    "checked_words": 379,
    "language": "en",
    "similarity": 32.46,
    "originality": 67.54,
    "search_web": 1,
    "comment_key": "054ad22959ef49bc0618f4fb8fdc0ccc",
    "search_storage": 1,
    "search_storage_filter": {
      "file_id": [
        100,
        500
      ],
      "user_id": [
        42,
        500
      ],
      "group_id": [
        100,
        500
      ]
    },
    "storage_id": null,
    "search_ai": 1,
    "warnings": [],
    "links": [],
    "html": "string"
  }
}

	No links
202	

Accepted (Report is processing)
Media type

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "progress": 0.58,
    "status": 2,
    "status_label": "checked",
    "type": 1,
    "plagiarism": 32.46,
    "ai_probability": 10.2,
    "ai_average_probability": null,
    "file_id": 191,
    "title": "PlagiarismSearch_test.txt",
    "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic.",
    "length": 379,
    "length_raw": 453,
    "words": 453,
    "checked_words": 379,
    "language": "en",
    "similarity": 32.46,
    "originality": 67.54,
    "search_web": 1,
    "comment_key": "054ad22959ef49bc0618f4fb8fdc0ccc",
    "search_storage": 1,
    "search_storage_filter": {
      "file_id": [
        100,
        500
      ],
      "user_id": [
        42,
        500
      ],
      "group_id": [
        100,
        500
      ]
    },
    "storage_id": null,
    "search_ai": 1,
    "warnings": [],
    "links": [],
    "html": "string"
  }
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
PUT
/reports/update/{id}
Update report

Update the report fields (You can use both methods PUT or POST)
Parameters
Name	Description
id *
integer
(path)
	

Item id.
Request body

Update report object

{
  "auth_key": "PlagiarismSearch_test.txt",
  "title": "PlagiarismSearch_test.txt",
  "callback_url": "https://plagiarismsearch.com/callback-url",
  "remote_id": "exp-123456"
}

Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": "string"
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
POST
/reports/sourcesToken/{id}
Refresh valid date for report sources token

Create report sources token if it is not exist and refresh valid date for report sources token (You can use both methods GET or POST)
Parameters
Name	Description
id *
integer
(path)
	

Item id.
Request body

SourcesTokenReport object.

If timestamp is null or SourcesTokenReport object is empty, system will generate timestamp like current_time + user.highlight_sources_token_ttl https://plagiarismsearch.com/account/system#highlight_sources_token_ttl

{
  "timestamp": 1700831403,
  "type": 1
}

Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": {
    "id": 1005002,
    "token": "35bda39bff44ff8db0f558d956adf8f2",
    "is_valid": true,
    "valid_at": 1692955874,
    "type": 2,
    "type_label": "Highlight on PlagiarismSearch.com for registered users using key"
  }
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
DELETE
/reports/delete/{id}
Delete report

Delete the report (You can use both methods DELETE or POST)
Parameters
Name	Description
id *
integer
(path)
	

Item id.
Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": "string"
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
AiReports

Methods for AI detection
POST
/ai-reports/create
Submit the document for AI detection

Submit the document for AI detection
CURL example to send text for AI detection with custom callback_url

curl -X 'POST' \
'https://plagiarismsearch.com/api/v3/ai-reports/create' \
-H 'Content-Type: application/json' \
-H 'Authorization: your:authorization_token_123' \
-d '{
  "callback_url": "https://plagiarismsearch.com/web-hook?id=100500",
  "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate AI report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic."
}'

CURL example to send file for AI detection

curl -X 'POST' \
'https://plagiarismsearch.com/api/v3/ai-reports/create' \
-H 'Authorization: your:authorization_token_123' \
-F 'document=@test_file_plagiarism.txt;type=text/plain' \
-F 'is_json=1'        

Parameters

No parameters
Request body

Create AI report object that needs to be added to checking.

One of fields text, document, url is required and should contain a text

{
  "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic.",
  "document": "string",
  "url": "https://plagiarismsearch.com/files/plagiarismsearch-mission-and-core-values.pdf",
  "title": "PlagiarismSearch_test.txt",
  "callback_url": "https://plagiarismsearch.com/callback-url",
  "remote_id": "exp-123456",
  "is_filter_references": 0,
  "is_json": 1,
  "force": 0
}

Responses
Code	Description	Links
202	

Successful operation
Media type
Controls Accept header.

{
  "status": true,
  "version": "3.0.1",
  "code": 202,
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "status": 2,
    "status_label": "checked",
    "ai_probability": 10.2,
    "ai_average_probability": null,
    "file_id": 191,
    "title": "PlagiarismSearch_test_AI.txt",
    "text": "Climate change refers to the long-term shift in global weather patterns caused by human activity,\\r\\n particularly the emission of greenhouse gases into the atmosphere. The most significant greenhouse gas is carbon dioxide, \\r\\n which is primarily produced by burning fossil fuels such as coal, oil, and gas.",
    "html": "<span class=\\\"ps-rb-ai\\\">Climate change refers to the long-term shift in global weather patterns caused by human activity,   particularly the emission of greenhouse gases into the atmosphere. </span><span class=\\\"ps-rb-ai\\\">The most significant greenhouse gas is carbon dioxide,    which is primarily produced by burning fossil fuels such as coal, oil, and gas. </span>",
    "length": 257,
    "words": 453,
    "links": []
  }
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
GET
/ai-reports
List of AI reports

List of AI reports (You can use both methods GET or POST)
Parameters
Name	Description
ids
array[integer]
(query)
	

Array of item ids.
remote_id
string
(query)
	

Local document id.
page
integer
(query)
	

Page number (Pagination).

Default value : 1
limit
integer
(query)
	

Items per page (Pagination).

Default value : 10
Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": [
    {
      "id": 100500,
      "auth_key": "32bed7dc477b4a9270818d941157952c",
      "remote_id": "exp-123456",
      "user_id": 42,
      "created": 1692955105,
      "modified": 1692955874,
      "notified": 1692955878,
      "status": 2,
      "status_label": "checked",
      "ai_probability": 10.2,
      "ai_average_probability": null,
      "file_id": 191,
      "title": "PlagiarismSearch_test_AI.txt",
      "text": "Climate change refers to the long-term shift in global weather patterns caused by human activity,\\r\\n particularly the emission of greenhouse gases into the atmosphere. The most significant greenhouse gas is carbon dioxide, \\r\\n which is primarily produced by burning fossil fuels such as coal, oil, and gas.",
      "html": "<span class=\\\"ps-rb-ai\\\">Climate change refers to the long-term shift in global weather patterns caused by human activity,   particularly the emission of greenhouse gases into the atmosphere. </span><span class=\\\"ps-rb-ai\\\">The most significant greenhouse gas is carbon dioxide,    which is primarily produced by burning fossil fuels such as coal, oil, and gas. </span>",
      "length": 257,
      "words": 453,
      "links": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "count": 42
  }
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
GET
/ai-reports/{id}
Get AI report data

Get AI report data (You can use both methods GET or POST)
Parameters
Name	Description
id *
integer
(path)
	

Item id.
show_relations
integer
(query)
	

Return report relations. (Full report data).

Acceptable values are:

    0: Returns basic information of the report (default).
    1: Returns all report data as a tree. Paragraphs, sentences and sources with highlighted text (data.paragraphs response field).
    -1: Returns all report raw data (data.paragraphs, data.blocks, data.sources response fields).
    -2: Returns the list of sources in plagiarism percent order (data.sources response field). (Better way is use /reports/sources/{id} route)
    -3: Returns html report content (data.html response field). (Better way is use /reports/html/{id} route)

Available values : 0, 1, -1, -2, -3
Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "status": 2,
    "status_label": "checked",
    "ai_probability": 10.2,
    "ai_average_probability": null,
    "file_id": 191,
    "title": "PlagiarismSearch_test_AI.txt",
    "text": "Climate change refers to the long-term shift in global weather patterns caused by human activity,\\r\\n particularly the emission of greenhouse gases into the atmosphere. The most significant greenhouse gas is carbon dioxide, \\r\\n which is primarily produced by burning fossil fuels such as coal, oil, and gas.",
    "html": "<span class=\\\"ps-rb-ai\\\">Climate change refers to the long-term shift in global weather patterns caused by human activity,   particularly the emission of greenhouse gases into the atmosphere. </span><span class=\\\"ps-rb-ai\\\">The most significant greenhouse gas is carbon dioxide,    which is primarily produced by burning fossil fuels such as coal, oil, and gas. </span>",
    "length": 257,
    "words": 453,
    "links": []
  }
}

	No links
202	

Accepted (AiReport is processing)
Media type

{
  "status": true,
  "version": "3.0.1",
  "code": 202,
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "status": 2,
    "status_label": "checked",
    "ai_probability": 10.2,
    "ai_average_probability": null,
    "file_id": 191,
    "title": "PlagiarismSearch_test_AI.txt",
    "text": "Climate change refers to the long-term shift in global weather patterns caused by human activity,\\r\\n particularly the emission of greenhouse gases into the atmosphere. The most significant greenhouse gas is carbon dioxide, \\r\\n which is primarily produced by burning fossil fuels such as coal, oil, and gas.",
    "html": "<span class=\\\"ps-rb-ai\\\">Climate change refers to the long-term shift in global weather patterns caused by human activity,   particularly the emission of greenhouse gases into the atmosphere. </span><span class=\\\"ps-rb-ai\\\">The most significant greenhouse gas is carbon dioxide,    which is primarily produced by burning fossil fuels such as coal, oil, and gas. </span>",
    "length": 257,
    "words": 453,
    "links": []
  }
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
GET
/ai-reports/status/{id}
Get AI report status info

Check the status of the AI report (You can use both methods GET or POST)
Parameters
Name	Description
id *
integer
(path)
	

Item id.
Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "status": 2,
    "status_label": "checked",
    "ai_probability": 10.2,
    "ai_average_probability": null
  }
}

	No links
202	

Accepted (AiReport is processing)
Media type

{
  "status": true,
  "version": "3.0.1",
  "code": 202,
  "data": {
    "id": 100500,
    "auth_key": "32bed7dc477b4a9270818d941157952c",
    "remote_id": "exp-123456",
    "user_id": 42,
    "created": 1692955105,
    "modified": 1692955874,
    "notified": 1692955878,
    "status": 2,
    "status_label": "checked",
    "ai_probability": 10.2,
    "ai_average_probability": null,
    "file_id": 191,
    "title": "PlagiarismSearch_test_AI.txt",
    "text": "Climate change refers to the long-term shift in global weather patterns caused by human activity,\\r\\n particularly the emission of greenhouse gases into the atmosphere. The most significant greenhouse gas is carbon dioxide, \\r\\n which is primarily produced by burning fossil fuels such as coal, oil, and gas.",
    "html": "<span class=\\\"ps-rb-ai\\\">Climate change refers to the long-term shift in global weather patterns caused by human activity,   particularly the emission of greenhouse gases into the atmosphere. </span><span class=\\\"ps-rb-ai\\\">The most significant greenhouse gas is carbon dioxide,    which is primarily produced by burning fossil fuels such as coal, oil, and gas. </span>",
    "length": 257,
    "words": 453,
    "links": []
  }
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
PUT
/ai-reports/update/{id}
Update AI report

Update the AI report fields (You can use both methods PUT or POST)
Parameters
Name	Description
id *
integer
(path)
	

Item id.
Request body

Update AI report object

{
  "auth_key": "PlagiarismSearch_test.txt",
  "title": "PlagiarismSearch_test.txt",
  "callback_url": "https://plagiarismsearch.com/callback-url",
  "remote_id": "exp-123456"
}

Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": "string"
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
DELETE
/ai-reports/delete/{id}
Delete AI report

Delete the AI report (You can use both methods DELETE or POST)
Parameters
Name	Description
id *
integer
(path)
	

Item id.
Responses
Code	Description	Links
200	

OK
Media type
Controls Accept header.

{
  "status": true,
  "code": 200,
  "version": "3.0.1",
  "data": "string"
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
Storage

Methods for Storage processing
POST
/storage/create
Submit the document to personal Storage

Submit the document to personal Storage
CURL example to send file to local Storage

curl -X 'POST' \
'https://plagiarismsearch.com/api/v3/ai-reports/create' \
-H 'Authorization: your:authorization_token_123' \
-F 'title="Student_99__10.txt"\
-F 'group_id="10"\
-F 'user_id="99"\
-F 'document=@test_storage.doc;type=text/plain' \
-F 'is_json=1'        

Parameters

No parameters
Request body

Create Storage request object.

One of fields text, document, url is required and should contain a text

{
  "text": "PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic.",
  "document": "string",
  "url": "https://plagiarismsearch.com/files/plagiarismsearch-mission-and-core-values.pdf",
  "title": "PlagiarismSearch_test.txt",
  "group_id": 123456,
  "user_id": 42,
  "file_id": 42,
  "is_search_filter_chars": 0
}

Responses
Code	Description	Links
202	

Successful operation
Media type
Controls Accept header.

{
  "status": true,
  "version": "3.0.1",
  "code": 202,
  "data": 1005001,
  "is_archive": false
}

	No links
400	

Bad Request
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 400,
  "message": "Bad Request"
}

	No links
401	

Unauthorized
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 401,
  "message": "Unauthorized"
}

	No links
403	

Forbidden
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 403,
  "message": "Forbidden"
}

	No links
404	

Not Found
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 404,
  "message": "Not Found"
}

	No links
405	

Method Not Allowed
Media type

{
  "status": false,
  "errors": [],
  "version": "3.0.1",
  "code": 405,
  "message": "Method Not Allowed"
}

	No links
Schemas
object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of report creation
Example1692955105
integerdate-time

Unix timestamp of report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
number[0, 1]float

Progress [0..1]
Example0.58
integer

Current report status

status == 2 report was checked

status > -10 report is checking

status <= -10 same error
Allowed values

    -13-12-11-10-9-4-3-2-10143567892

Example2
string

Text report status
Allowed values

    "not paid""server core error""server error""error""init""processing storage""storage check""processing files""files check""processing""pre-checked""post-checked""sources""snippets""reserved""checked"

Example"checked"
integer

0 - archived, 1 - live
Allowed values

    01

Example1
deprecatednumber≤ 100float
Example32.46
number≤ 100float

Plagiarism percent
Example32.46
null | number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2
null | number≤ 100float

The total percentage of AI generated passages in the text (float or null)
Examplenull
integer
Example191
string

Title of report
Example"PlagiarismSearch_test.txt"
string

Raw text for checking
Example"PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic."
integer
Example379
integer
Example453
integer
Example453
integer
Example379
string
Example"en"
number≤ 100float

Plagiarism percent
Example32.46
number≤ 100float

Originality percent
Example67.54
integer

search on the web
Example1
string
Example"054ad22959ef49bc0618f4fb8fdc0ccc"
integer

search in storage
Example1
object

array<any>

Exclude local file ids from storage search
Example[100, 500]
array<any>

Exclude local user ids from storage search
Example[42, 500]

    array<any>

    Exclude local group (course) ids from storage search
    Example[100, 500]

integer
Examplenull
integer

search AI content
Example1
array<any>
Example[]

    array<any>
    Example[]

object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of report creation
Example1692955105
integerdate-time

Unix timestamp of report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
number[0, 1]float

Progress [0..1]
Example0.58
integer

Current report status

status == 2 report was checked

status > -10 report is checking

status <= -10 same error
Allowed values

    -13-12-11-10-9-4-3-2-10143567892

Example2
string

Text report status
Allowed values

    "not paid""server core error""server error""error""init""processing storage""storage check""processing files""files check""processing""pre-checked""post-checked""sources""snippets""reserved""checked"

Example"checked"
integer

0 - archived, 1 - live
Allowed values

    01

Example1
deprecatednumber≤ 100float
Example32.46
number≤ 100float

Plagiarism percent
Example32.46
null | number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2

    null | number≤ 100float

    The total percentage of AI generated passages in the text (float or null)
    Examplenull

object

Once the report was checked, you will receive information about its status (and any additional details) to your callback url.

string
Example"report.checked"
integer
Example100500
number≤ 100float

Plagiarism percent
Example32.46
null | number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2
null | number≤ 100float

The total percentage of AI generated passages in the text (float or null)
Examplenull
integerdate-time

Unix timestamp of report creation
Example1692955105
integerdate-time

Unix timestamp of report modification
Example1692955874
integer
Example453
checked_words
integer
integer

Current report status

status == 2 report was checked

status > -10 report is checking

status <= -10 same error
Allowed values

    -13-12-11-10-9-4-3-2-10143567892

Example2
string

Text report status
Allowed values

    "not paid""server core error""server error""error""init""processing storage""storage check""processing files""files check""processing""pre-checked""post-checked""sources""snippets""reserved""checked"

Example"checked"
string
Example"32bed7dc477b4a9270818d941157952c"

    array<any>
    Example[]

object

Report statuses

status == 2 report was checked

status > -10 report is checking

status <= -10 same error
Additional properties
string
Example{"0":"processing","1":"pre-checked","2":"checked","3":"sources","4":"post-checked","5":"snippets","6":"reserved","7":"reserved","8":"reserved","9":"reserved","-13":"not paid","-12":"server core error","-11":"server error","-10":"error","-9":"init","-4":"processing storage","-3":"storage check","-2":"processing files","-1":"files check"}
object

List of sources in plagiarism percent order grouped by url

integer
Example1005002
integer
Example100500
integer

Current sources status
Allowed values

    -2-1012345679101112

Example2
string

Text source status
Allowed values

    "deleted""processing""checked"

Example"checked"
integer

1 - web, 2 - files, 4 - storage, 8 - academic
Allowed values

    1248

Example1
string

Text source type
Allowed values

    "web""files""storage""academic"

Example"web"
deprecatednumber≤ 100float
Example51.020408
number≤ 100float

Plagiarism percent
Example51.020408
deprecatednull | number≤ 100float
Example30.020408
null | number≤ 100float

Percent of citations plagiarism if is_search_filter_quotes is enabled and search block has citation or null
Example30.020408
integer
Example57
integer
Example0
integer
Example52
integer

Total number of hits
Example6
integer

Total blocks words
Example125
string

Url domain or filename
Example"www.bbc.co.uk"
string
Example"https://www.bbc.co.uk/news/uk-scotland-highlands-islands-64875273"

    string
    Example"https://plagiarismsearch.com/sources/100500?rb=2100500&url=https%3A%2F%2Fwww.bbc.co.uk%2Fnews%2Fuk-scotland-highlands-islands-64875273"

object

SourcesToken object

integer

Report id
Example1005002
string

Report sources token
Example"35bda39bff44ff8db0f558d956adf8f2"
boolean
Exampletrue
integerdate-time

Unix timestamp validity of Report sources token
Example1692955874
integer
Allowed values

    01234

Example2

    string
    Example"Highlight on PlagiarismSearch.com for registered users using key"

object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of AI report creation
Example1692955105
integerdate-time

Unix timestamp of AI report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
integer

Current AI report status

status == 2 AI report was checked

status > -10 AI report is checking

status <= -10 same error
Allowed values

    -13-11-9012

Example2
string

Text AI report status
Allowed values

    "not paid""failed""init""processing""snippets""building""checked"

Example"checked"
number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2
number≤ 100float

The total percentage of AI generated passages in the text (float or null)
Examplenull
integer
Example191
string

Title of AI report
Example"PlagiarismSearch_test_AI.txt"
string

Raw text for checking
Example"Climate change refers to the long-term shift in global weather patterns caused by human activity,\\r\\n particularly the emission of greenhouse gases into the atmosphere. The most significant greenhouse gas is carbon dioxide, \\r\\n which is primarily produced by burning fossil fuels such as coal, oil, and gas."
string

AI highlighted text
Example"<span class=\\\"ps-rb-ai\\\">Climate change refers to the long-term shift in global weather patterns caused by human activity, particularly the emission of greenhouse gases into the atmosphere. </span><span class=\\\"ps-rb-ai\\\">The most significant greenhouse gas is carbon dioxide, which is primarily produced by burning fossil fuels such as coal, oil, and gas. </span>"
integer

Characters count
Example257
integer

Words count
Example453

    array<any>
    Example[]

object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of AI report creation
Example1692955105
integerdate-time

Unix timestamp of AI report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
integer

Current AI report status

status == 2 AI report was checked

status > -10 AI report is checking

status <= -10 same error
Allowed values

    -13-11-9012

Example2
string

Text AI report status
Allowed values

    "not paid""failed""init""processing""snippets""building""checked"

Example"checked"
number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2

    number≤ 100float

    The total percentage of AI generated passages in the text (float or null)
    Examplenull

object

Once the AI report was checked, you will receive information about its status (and any additional details) to your callback url.

string
Example"ai-report.checked"
integer
Example100500
number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2
number≤ 100float

The total percentage of AI generated passages in the text (float or null)
Examplenull
integerdate-time

Unix timestamp of AI report creation
Example1692955105
integerdate-time

Unix timestamp of AI report modification
Example1692955874
integer

Characters count
Example257
integer

Words count
Example85
integer

Current AI report status

status == 2 AI report was checked

status > -10 AI report is checking

status <= -10 same error
Allowed values

    -13-11-9012

Example2
string

Text AI report status
Allowed values

    "not paid""failed""init""processing""snippets""building""checked"

Example"checked"
string
Example"32bed7dc477b4a9270818d941157952c"

    array<any>
    Example[]

object

AiReport statuses

status == 2 AI report was checked

status > -10 AI report is checking

status <= -10 same error
Additional properties
string
Example{"0":"processing","1":"building","2":"checked","-13":"not paid","-12":"failed","-9":"init"}
object

integer
Example1005001
string

Title of document
Example"Storage_1.txt"
string

Document text
Example"Climate change refers to the long-term shift in global weather patterns caused by human activity,\\r\\n particularly the emission of greenhouse gases into the atmosphere. The most significant greenhouse gas is carbon dioxide, \\r\\n which is primarily produced by burning fossil fuels such as coal, oil, and gas."
string

Source URL
integer

Text size in bytes
Example1683
string
Example"5:0:0:0:0:1171469882"
any

If it was created from Report
Example100500
any

External group_id (Course id)
Example123456
integer

External user_id (Student id)
Example42
integerint64

External file_id (Assigment id)
Example42
boolean

Is the document in Search index
Exampletrue
integerdate-time

Unix timestamp of document creation
Example1692955105
integerdate-time

Unix timestamp of document modification
Example1692955874
integer

Current document status

-6: file (processing)

-5: archive (processing)

-4: processing (processing)

-2: hidden

-1: error

0: empty

1: active

2: active old (same like active)
Allowed values

    -6-5-4-2-1012

Example2

    string

    Document status
    Allowed values
        "file""archive""processing""hidden""error""empty""active""active old"
    Example"active"

object

integer
Example1
integer
Example10

    integer
    Example42

object

string

Raw text for checking
Example"PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic."
stringbinary

File with text content (same file). For multipart/form-data should set is_json=1 for better compatibility
string

Public URL for downloading and checking.
Example"https://plagiarismsearch.com/files/plagiarismsearch-mission-and-core-values.pdf"
string<= 255 characters

Title of report
Example"PlagiarismSearch_test.txt"
string

POST request will be sent directly to URL after checking the report.
Example"https://plagiarismsearch.com/callback-url"
string<= 128 characters

Your local document id
Example"exp-123456"
integer

Search on the web
Default1
integer

Only latin characters (same filter_chars)
Default0
integer

Exclude references (same filter_references)
Default0
integer

Exclude in-text citations (same filter_quotes)
Default0
array<string>

If you add the chosen URLs to the Whitelist, then the excluded web pages will not be scanned for plagiarism. Therefore, even if there are contextual or formatting coincidences on some domains and web pages, applying this feature eradicates the ability to discern plagiarism in the mentioned content. Hence, when the option “Whitelist URLs” is activated, all similarities found on the URLs will be ignored.
Items
string
Default[]
array<string>

If you choose to exclude certain URLs automatically, the tool will still search for plagiarized parts, but it will not influence the general percentage of plagiarism in your report. This feature allows you to add lists of domains and specific web pages that will be checked for plagiarism. The detector will search for coincidences all over the web. However, if plagiarism is revealed on the selected URLs, it will not be included in the final reports.
Items
string
Default[]
integer

Search for AI text (same search_ai)
Example1
integer

Search on storage (same search_storage, search_files_api)
Example1
integer

Search on organization storage
Example0
integer

Add report text to storage (same storage, add_files_api) Default is 1 if is_search_storage is enabled
Default1
object

Filter for search in storage.

array<any>

Exclude local file ids from storage search
Example[100, 500]
array<any>

Exclude local user ids from storage search
Example[42, 2]

    array<any>

    Exclude local group (course) ids from storage search
    Example[100, 500]

array<any>

Array of 2 elements (User id and group (course) id. Filter for search in storage. Exclude all user documents with group ids
Example[2, 500]
number≤ 1float

Storage search sensibility rate [0...1]
Example0.9
number≤ 1float

Minimal % sensitive to plagiarism check within storage sources [0...100]
Default40
integer≤ 15

Minimal word number sensitive to plagiarism check within storage sources [3...15]
Example3
integer

Link local group id (course id) to storage document (same storage_course_id)
Example500
integer

Link local user id to storage document
Example42
integer

Link local file id to storage document
Example100500
integer

Max words per report. Text will be truncated, if it is longer than limit_words words
Defaultnull
Example100000
integer

For multipart/form-data should set is_json=1 for better compatibility
Example1

    integer

    If is is true or 1 PlagiarismSearch will not try to find report by remote_id

object
object
object
object

string<= 32 characters

Title of AI report
Example"PlagiarismSearch_test.txt"
string<= 255 characters

Title of AI report
Example"PlagiarismSearch_test.txt"
string

POST request will be sent directly to URL after checking the AI report.
Example"https://plagiarismsearch.com/callback-url"

    string<= 255128 characters

    Your local document id
    Example"exp-123456"

object

string

Raw text
Example"PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic."
stringbinary

File with text content (same file). For multipart/form-data should set is_json=1 for better compatibility
string

Public URL for downloading
Example"https://plagiarismsearch.com/files/plagiarismsearch-mission-and-core-values.pdf"
string<= 255 characters

Title of document
Example"PlagiarismSearch_test.txt"
any

External group_id (Course id)
Example123456
integer

External user_id (Student id)
Example42
integerint64

External file_id (Assigment id)
Example42

    integer

    Only latin characters (same filter_chars)
    Default0

object

    status
    boolean

string
Example"3.0.1"
integer
Example202
object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of report creation
Example1692955105
integerdate-time

Unix timestamp of report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
number[0, 1]float

Progress [0..1]
Example0.58
integer

Current report status

status == 2 report was checked

status > -10 report is checking

status <= -10 same error
Allowed values

    -13-12-11-10-9-4-3-2-10143567892

Example2
string

Text report status
Allowed values

    "not paid""server core error""server error""error""init""processing storage""storage check""processing files""files check""processing""pre-checked""post-checked""sources""snippets""reserved""checked"

Example"checked"
integer

0 - archived, 1 - live
Allowed values

    01

Example1
deprecatednumber≤ 100float
Example32.46
number≤ 100float

Plagiarism percent
Example32.46
null | number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2
null | number≤ 100float

The total percentage of AI generated passages in the text (float or null)
Examplenull
integer
Example191
string

Title of report
Example"PlagiarismSearch_test.txt"
string

Raw text for checking
Example"PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic."
integer
Example379
integer
Example453
integer
Example453
integer
Example379
string
Example"en"
number≤ 100float

Plagiarism percent
Example32.46
number≤ 100float

Originality percent
Example67.54
integer

search on the web
Example1
string
Example"054ad22959ef49bc0618f4fb8fdc0ccc"
integer

search in storage
Example1
object

array<any>

Exclude local file ids from storage search
Example[100, 500]
array<any>

Exclude local user ids from storage search
Example[42, 500]

    array<any>

    Exclude local group (course) ids from storage search
    Example[100, 500]

integer
Examplenull
integer

search AI content
Example1
array<any>
Example[]

        array<any>
        Example[]

object

    status
    boolean

integer
Example200
string
Example"3.0.1"
object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of report creation
Example1692955105
integerdate-time

Unix timestamp of report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
number[0, 1]float

Progress [0..1]
Example0.58
integer

Current report status

status == 2 report was checked

status > -10 report is checking

status <= -10 same error
Allowed values

    -13-12-11-10-9-4-3-2-10143567892

Example2
string

Text report status
Allowed values

    "not paid""server core error""server error""error""init""processing storage""storage check""processing files""files check""processing""pre-checked""post-checked""sources""snippets""reserved""checked"

Example"checked"
integer

0 - archived, 1 - live
Allowed values

    01

Example1
deprecatednumber≤ 100float
Example32.46
number≤ 100float

Plagiarism percent
Example32.46
null | number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2
null | number≤ 100float

The total percentage of AI generated passages in the text (float or null)
Examplenull
integer
Example191
string

Title of report
Example"PlagiarismSearch_test.txt"
string

Raw text for checking
Example"PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic."
integer
Example379
integer
Example453
integer
Example453
integer
Example379
string
Example"en"
number≤ 100float

Plagiarism percent
Example32.46
number≤ 100float

Originality percent
Example67.54
integer

search on the web
Example1
string
Example"054ad22959ef49bc0618f4fb8fdc0ccc"
integer

search in storage
Example1
object

array<any>

Exclude local file ids from storage search
Example[100, 500]
array<any>

Exclude local user ids from storage search
Example[42, 500]

    array<any>

    Exclude local group (course) ids from storage search
    Example[100, 500]

integer
Examplenull
integer

search AI content
Example1
array<any>
Example[]

        array<any>
        Example[]

object

    status
    boolean

integer
Example200
string
Example"3.0.1"
object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of report creation
Example1692955105
integerdate-time

Unix timestamp of report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
number[0, 1]float

Progress [0..1]
Example0.58
integer

Current report status

status == 2 report was checked

status > -10 report is checking

status <= -10 same error
Allowed values

    -13-12-11-10-9-4-3-2-10143567892

Example2
string

Text report status
Allowed values

    "not paid""server core error""server error""error""init""processing storage""storage check""processing files""files check""processing""pre-checked""post-checked""sources""snippets""reserved""checked"

Example"checked"
integer

0 - archived, 1 - live
Allowed values

    01

Example1
deprecatednumber≤ 100float
Example32.46
number≤ 100float

Plagiarism percent
Example32.46
null | number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2
null | number≤ 100float

The total percentage of AI generated passages in the text (float or null)
Examplenull
integer
Example191
string

Title of report
Example"PlagiarismSearch_test.txt"
string

Raw text for checking
Example"PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic."
integer
Example379
integer
Example453
integer
Example453
integer
Example379
string
Example"en"
number≤ 100float

Plagiarism percent
Example32.46
number≤ 100float

Originality percent
Example67.54
integer

search on the web
Example1
string
Example"054ad22959ef49bc0618f4fb8fdc0ccc"
integer

search in storage
Example1
object

array<any>

Exclude local file ids from storage search
Example[100, 500]
array<any>

Exclude local user ids from storage search
Example[42, 500]

    array<any>

    Exclude local group (course) ids from storage search
    Example[100, 500]

integer
Examplenull
integer

search AI content
Example1
array<any>
Example[]
array<any>
Example[]
array<object>
object

List of sources in plagiarism percent order grouped by url

integer
Example1005002
integer
Example100500
integer

Current sources status
Allowed values

    -2-1012345679101112

Example2
string

Text source status
Allowed values

    "deleted""processing""checked"

Example"checked"
integer

1 - web, 2 - files, 4 - storage, 8 - academic
Allowed values

    1248

Example1
string

Text source type
Allowed values

    "web""files""storage""academic"

Example"web"
deprecatednumber≤ 100float
Example51.020408
number≤ 100float

Plagiarism percent
Example51.020408
deprecatednull | number≤ 100float
Example30.020408
null | number≤ 100float

Percent of citations plagiarism if is_search_filter_quotes is enabled and search block has citation or null
Example30.020408
integer
Example57
integer
Example0
integer
Example52
integer

Total number of hits
Example6
integer

Total blocks words
Example125
string

Url domain or filename
Example"www.bbc.co.uk"
string
Example"https://www.bbc.co.uk/news/uk-scotland-highlands-islands-64875273"

            string
            Example"https://plagiarismsearch.com/sources/100500?rb=2100500&url=https%3A%2F%2Fwww.bbc.co.uk%2Fnews%2Fuk-scotland-highlands-islands-64875273"

object

    status
    boolean

integer
Example200
string
Example"3.0.1"
object

SourcesToken object

integer

Report id
Example1005002
string

Report sources token
Example"35bda39bff44ff8db0f558d956adf8f2"
boolean
Exampletrue
integerdate-time

Unix timestamp validity of Report sources token
Example1692955874
integer
Allowed values

    01234

Example2

        string
        Example"Highlight on PlagiarismSearch.com for registered users using key"

object

    status
    boolean

integer
Example200
string
Example"3.0.1"
object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of report creation
Example1692955105
integerdate-time

Unix timestamp of report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
number[0, 1]float

Progress [0..1]
Example0.58
integer

Current report status

status == 2 report was checked

status > -10 report is checking

status <= -10 same error
Allowed values

    -13-12-11-10-9-4-3-2-10143567892

Example2
string

Text report status
Allowed values

    "not paid""server core error""server error""error""init""processing storage""storage check""processing files""files check""processing""pre-checked""post-checked""sources""snippets""reserved""checked"

Example"checked"
integer

0 - archived, 1 - live
Allowed values

    01

Example1
deprecatednumber≤ 100float
Example32.46
number≤ 100float

Plagiarism percent
Example32.46
null | number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2
null | number≤ 100float

The total percentage of AI generated passages in the text (float or null)
Examplenull
integer
Example191
string

Title of report
Example"PlagiarismSearch_test.txt"
string

Raw text for checking
Example"PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic."
integer
Example379
integer
Example453
integer
Example453
integer
Example379
string
Example"en"
number≤ 100float

Plagiarism percent
Example32.46
number≤ 100float

Originality percent
Example67.54
integer

search on the web
Example1
string
Example"054ad22959ef49bc0618f4fb8fdc0ccc"
integer

search in storage
Example1
object

array<any>

Exclude local file ids from storage search
Example[100, 500]
array<any>

Exclude local user ids from storage search
Example[42, 500]

    array<any>

    Exclude local group (course) ids from storage search
    Example[100, 500]

integer
Examplenull
integer

search AI content
Example1
array<any>
Example[]
array<any>
Example[]

        string

        Highlighted text of report

        Common CSS selectors:
            .rb-r - Plagiarism detected text
            .rb-y - Similarities detected text
            .rb-p - Citation detected text
            .rb-ai - AI detected text
            .status--10 .rp - Title page (References)
            .status--11 .rp - Bibliography (References)

object

    status
    boolean

integer
Example200
string
Example"3.0.1"
object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of report creation
Example1692955105
integerdate-time

Unix timestamp of report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
number[0, 1]float

Progress [0..1]
Example0.58
integer

Current report status

status == 2 report was checked

status > -10 report is checking

status <= -10 same error
Allowed values

    -13-12-11-10-9-4-3-2-10143567892

Example2
string

Text report status
Allowed values

    "not paid""server core error""server error""error""init""processing storage""storage check""processing files""files check""processing""pre-checked""post-checked""sources""snippets""reserved""checked"

Example"checked"
integer

0 - archived, 1 - live
Allowed values

    01

Example1
deprecatednumber≤ 100float
Example32.46
number≤ 100float

Plagiarism percent
Example32.46
null | number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2

        null | number≤ 100float

        The total percentage of AI generated passages in the text (float or null)
        Examplenull

object

    status
    boolean

integer
Example200
string
Example"3.0.1"
array<object>
object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of report creation
Example1692955105
integerdate-time

Unix timestamp of report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
number[0, 1]float

Progress [0..1]
Example0.58
integer

Current report status

status == 2 report was checked

status > -10 report is checking

status <= -10 same error
Allowed values

    -13-12-11-10-9-4-3-2-10143567892

Example2
string

Text report status
Allowed values

    "not paid""server core error""server error""error""init""processing storage""storage check""processing files""files check""processing""pre-checked""post-checked""sources""snippets""reserved""checked"

Example"checked"
integer

0 - archived, 1 - live
Allowed values

    01

Example1
deprecatednumber≤ 100float
Example32.46
number≤ 100float

Plagiarism percent
Example32.46
null | number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2
null | number≤ 100float

The total percentage of AI generated passages in the text (float or null)
Examplenull
integer
Example191
string

Title of report
Example"PlagiarismSearch_test.txt"
string

Raw text for checking
Example"PlagiarismSearch.com is a leading plagiarism checking website\\nThat will provide you with an accurate report during a short timeframe. Prior to submitting your home assignments, run them through our plagiarism checker to make sure your content is authentic."
integer
Example379
integer
Example453
integer
Example453
integer
Example379
string
Example"en"
number≤ 100float

Plagiarism percent
Example32.46
number≤ 100float

Originality percent
Example67.54
integer

search on the web
Example1
string
Example"054ad22959ef49bc0618f4fb8fdc0ccc"
integer

search in storage
Example1
object

array<any>

Exclude local file ids from storage search
Example[100, 500]
array<any>

Exclude local user ids from storage search
Example[42, 500]

    array<any>

    Exclude local group (course) ids from storage search
    Example[100, 500]

integer
Examplenull
integer

search AI content
Example1
array<any>
Example[]

    array<any>
    Example[]

object

integer
Example1
integer
Example10

        integer
        Example42

object

    status
    boolean

string
Example"3.0.1"
integer
Example202
object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of AI report creation
Example1692955105
integerdate-time

Unix timestamp of AI report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
integer

Current AI report status

status == 2 AI report was checked

status > -10 AI report is checking

status <= -10 same error
Allowed values

    -13-11-9012

Example2
string

Text AI report status
Allowed values

    "not paid""failed""init""processing""snippets""building""checked"

Example"checked"
number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2
number≤ 100float

The total percentage of AI generated passages in the text (float or null)
Examplenull
integer
Example191
string

Title of AI report
Example"PlagiarismSearch_test_AI.txt"
string

Raw text for checking
Example"Climate change refers to the long-term shift in global weather patterns caused by human activity,\\r\\n particularly the emission of greenhouse gases into the atmosphere. The most significant greenhouse gas is carbon dioxide, \\r\\n which is primarily produced by burning fossil fuels such as coal, oil, and gas."
string

AI highlighted text
Example"<span class=\\\"ps-rb-ai\\\">Climate change refers to the long-term shift in global weather patterns caused by human activity, particularly the emission of greenhouse gases into the atmosphere. </span><span class=\\\"ps-rb-ai\\\">The most significant greenhouse gas is carbon dioxide, which is primarily produced by burning fossil fuels such as coal, oil, and gas. </span>"
integer

Characters count
Example257
integer

Words count
Example453

        array<any>
        Example[]

object

    status
    boolean

integer
Example200
string
Example"3.0.1"
object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of AI report creation
Example1692955105
integerdate-time

Unix timestamp of AI report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
integer

Current AI report status

status == 2 AI report was checked

status > -10 AI report is checking

status <= -10 same error
Allowed values

    -13-11-9012

Example2
string

Text AI report status
Allowed values

    "not paid""failed""init""processing""snippets""building""checked"

Example"checked"
number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2
number≤ 100float

The total percentage of AI generated passages in the text (float or null)
Examplenull
integer
Example191
string

Title of AI report
Example"PlagiarismSearch_test_AI.txt"
string

Raw text for checking
Example"Climate change refers to the long-term shift in global weather patterns caused by human activity,\\r\\n particularly the emission of greenhouse gases into the atmosphere. The most significant greenhouse gas is carbon dioxide, \\r\\n which is primarily produced by burning fossil fuels such as coal, oil, and gas."
string

AI highlighted text
Example"<span class=\\\"ps-rb-ai\\\">Climate change refers to the long-term shift in global weather patterns caused by human activity, particularly the emission of greenhouse gases into the atmosphere. </span><span class=\\\"ps-rb-ai\\\">The most significant greenhouse gas is carbon dioxide, which is primarily produced by burning fossil fuels such as coal, oil, and gas. </span>"
integer

Characters count
Example257
integer

Words count
Example453

        array<any>
        Example[]

object

    status
    boolean

integer
Example200
string
Example"3.0.1"
object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of AI report creation
Example1692955105
integerdate-time

Unix timestamp of AI report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
integer

Current AI report status

status == 2 AI report was checked

status > -10 AI report is checking

status <= -10 same error
Allowed values

    -13-11-9012

Example2
string

Text AI report status
Allowed values

    "not paid""failed""init""processing""snippets""building""checked"

Example"checked"
number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2

        number≤ 100float

        The total percentage of AI generated passages in the text (float or null)
        Examplenull

object

    status
    boolean

integer
Example200
string
Example"3.0.1"
array<object>
object

integer
Example100500
string
Example"32bed7dc477b4a9270818d941157952c"
string
Example"exp-123456"
integer
Example42
integerdate-time

Unix timestamp of AI report creation
Example1692955105
integerdate-time

Unix timestamp of AI report modification
Example1692955874
integerdate-time

Unix timestamp of callback request sending
Example1692955878
integer

Current AI report status

status == 2 AI report was checked

status > -10 AI report is checking

status <= -10 same error
Allowed values

    -13-11-9012

Example2
string

Text AI report status
Allowed values

    "not paid""failed""init""processing""snippets""building""checked"

Example"checked"
number≤ 100float

The percentage of likelihood that the whole text was AI generated (float or null)
Example10.2
number≤ 100float

The total percentage of AI generated passages in the text (float or null)
Examplenull
integer
Example191
string

Title of AI report
Example"PlagiarismSearch_test_AI.txt"
string

Raw text for checking
Example"Climate change refers to the long-term shift in global weather patterns caused by human activity,\\r\\n particularly the emission of greenhouse gases into the atmosphere. The most significant greenhouse gas is carbon dioxide, \\r\\n which is primarily produced by burning fossil fuels such as coal, oil, and gas."
string

AI highlighted text
Example"<span class=\\\"ps-rb-ai\\\">Climate change refers to the long-term shift in global weather patterns caused by human activity, particularly the emission of greenhouse gases into the atmosphere. </span><span class=\\\"ps-rb-ai\\\">The most significant greenhouse gas is carbon dioxide, which is primarily produced by burning fossil fuels such as coal, oil, and gas. </span>"
integer

Characters count
Example257
integer

Words count
Example453

    array<any>
    Example[]

object

integer
Example1
integer
Example10

        integer
        Example42

object

    status
    boolean

string
Example"3.0.1"
integer
Example202
integer
Example1005001

    boolean
    Examplefalse

object

    status
    boolean

integer
Example200

    string
    Example"3.0.1"
    data
    any

object

boolean
Examplefalse
integer
Example404
string
Example"Not found"
errors
array<any>

    string
    Example"3.0.1"

Online validator badge
