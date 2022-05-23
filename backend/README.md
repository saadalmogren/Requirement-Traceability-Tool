## Getting Started

### Installing Dependencies

#### Python 3.8

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Enviornment

Instructions for setting up a virual enviornment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)



#### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by naviging to the root directory and running:

```bash
pip install -r requirements.txt
```

This will install all of the required packages we selected within the `requirements.txt` file.

## Testing
in the project directory execute the command `python -m unittest discover -p "*_test.py` to run all the tests.
## Running the server

From within the root directory first ensure you are working using your created virtual environment.

To run the server, execute:

```bash
run.py
```
## Api Documentation
ENDPOINTS
POST '/register'
POST '/login'
POST '/modify_account_information/<string:username>'
GET '/projects'
GET '/projects/<string:pID>'
POST '/projects'
PATCH '/projects'
DELETE '/projects/<string:pID>'
GET '/project/user'
POST '/project/user'
DELETE '/project/user'
DELETE '/project/leave
GET '/project/roles'
PATCH '/project/user/roles/add'
PATCH '/project/user/roles/delete'
GET '/project/user/roles'
GET '/project/user/privileges'
PATCH '/project/change_management'
GET '/role/privileges'
GET '/privileges'
POST '/role'
PATCH '/role'
PATCH '/role/privileges/add'
PATCH '/role/privileges/delete'
DELETE '/role'
GET '/project/artifact_types'
POST '/artifact_types'
PATCH '/artifact_types'
DELETE '/artifact_types'
GET '/project/artifacts'
POST '/artifact'
PATCH '/artifact'
DELETE '/artifact'
GET '/project/traceability_link_types'
POST '/traceability_link_type'
PATCH '/traceability_link_type'
DELETE '/traceability_link_type'
GET '/project/traceability_links'
POST '/traceability_links'
PATCH '/traceability_links'
DELETE '/traceability_links'
GET '/project/artifact_change_requests'
GET '/project/traceability_link_change_requests'
GET '/project/artifact_sent_change_requests'
GET '/project/traceability_link_sent_change_requests'
POST '/artifact_creation_request'
POST '/artifact_modification_request'
POST '/artifact_deletion_request'
POST '/accept_artifact_request'
POST '/reject_artifact_request'
DELETE '/artifact_request'
POST '/traceability_link_creation_request'
POST '/traceability_link_modification_request'
POST '/traceability_link_deletion_request'
POST '/traceability_link_artifact_request'
POST '/reject_traceability_link_request'
DELETE '/traceability_link_request'
GET '/export_traceability_link_information'
GET '/project/notifications'
DELETE '/notifications'
GET '/project/impact_analysis'
GET '/project/test_coverage_analysis'
GET '/project/elaboration_coverage_analysis'




POST '/register'
- Creates a new user
- Request Arguments: username, password, email
- Returns: the created username
Request: http://127.0.0.1:5000/register
Body:
{
    "username": "saad1",
    "password": "123",
    "email": "test@test.com"
}
Response:
{
    "success": true,
    "username": "saad1"
}

POST '/login'
- log in the user if it already exist
- Request Arguments: username, password
Request: http://127.0.0.1:5000/login
Body: 
{
    "username": "saad",
    "password": "1323"
}

Response:
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2FhZCIsImV4cCI6MTYxMjM3ODE1N30.8bwlpEm_XeT89kdaWKiIAXoy2C3acjfcoIztU8nk-oo",
    "success": true,
    "username": "saad",
    "email": "test@test.com"
}

POST '/modify_account_information/<string:username>'
- modifies the provided user information with the given email or password
- Request Arguments: email or password or both
Request: http://127.0.0.1:5000/modify_account_information/saad1
Body:
{
    "email": "test2@test.com"
}
Response:
{
    'success': True
}

GET '/projects'
- Gets the given project details
- Request Arguments: username

Request: http://127.0.0.1:5000/projects?username=saad4

Response:
{
    "projects": [
        {
            "description": "test",
            "id": "[test1]_7wDt6",
            "name": "[test1]"
        }
    ],
    "username": "saad4"
}

GET '/projects/<string:pID>'
- Gets the given project details
- Request Arguments: pID

Request: http://127.0.0.1:5000/projects/test1_JBL67

Response:
{
    "project_details": {
        "description": "test",
        "id": "test1_JBL67",
        "name": "test1",
        "users": [
            "saad4",
            "saad1"
        ]
    }

POST '/projects'
- creates a new project
- Request Arguments: username, name, description

Request: http://127.0.0.1:5000/projects
{
    "username": "saad4",
    "name": "test1",
    "description": "test"
}

Response:
{
    "success": true
}

PATCH '/projects'
- modifies the given project indormartion
- Request Arguments: username, pID,name, description
- Return: the user's projct after modification
Request: http://127.0.0.1:5000/projects
{
    "pID": "test1_JBL67",
    "username": "saad4",
    "name": "test1",
    "description": "test"
}

Response:
{
    "projects": [
        {
            "description": "test",
            "id": "test1_JBL67",
            "name": "test1"
        }
    ],
    "success": true
}

DELETE '/projects/<string:pID>'
- deletes the given project
- Request Arguments: pID and username
- Return: the user's projct after deletion

Request: http://127.0.0.1:5000/projects/test1_JBL67?username=saad4

Response:
{
    "projects": [],
    "success": true
}

GET '/project/users'
- returns all users in the given project
- Request Arguments: pID

Request:  http://127.0.0.1:5000/project/user?pID=name_PKEAz

Response:
{
    "success": true,
    "users": [
        "saad1"
    ]
}

POST '/project/user'
- adds the given user to a project
- Request Arguments: pID and username

Request: http://127.0.0.1:5000/project/user

Body:
{
    "pID": "test1_JBL67",
    "username": "saad1"
}

DELETE '/project/user'
- deletes the given user from a project
- Request Arguments: pID and username
Request: http://127.0.0.1:5000/project/user?username=saad1&pID=test1_JBL67

DELETE '/project/leave
- removes user from the project
- Request Arguments: pID
Request: http://127.0.0.1:5000/project/leave?pID=name_Ko3Mn

GET '/project/roles'
- gets all the roles in the given project
- Request Arguments: pID
Request: http://127.0.0.1:5000/project/roles?pID=name_5stv9

Response:
{
    "roles": [
        {
            "id": "Project Manager_J5xHb",
            "name": "Project Manager",
            "pID": "name_5stv9"
        }
    ],
    "success": true
}



PATCH '/project/user/roles/add'
- adds the given role to the user in the project
- Request Arguments: pID, username, roles list
Request: http://127.0.0.1:5000/project/user/roles/add
{
    "username": "saad2",
    "roles": ["test_73cuV"],
    "pID": "name_5stv9"
}

Response:
{
    "success": true
}

PATCH '/project/user/roles/delete'
- deletes the given role to the user in the project
- Request Arguments: pID, username, roles list
Request: http://127.0.0.1:5000/project/user/roles/delete
{
    "username": "saad2",
    "roles": ["test_73cuV"],
    "pID": "name_5stv9"
}

Response:
{
    "success": true
}

GET '/project/user/roles'
- gets all the user roles in the given project
- Request Arguments: pID, username
http://127.0.0.1:5000/project/user/roles?pID=name_5stv9&username=saad1

{
    "roles": [
        {
            "id": "Project Manager_J5xHb",
            "name": "Project Manager",
            "pID": "name_5stv9"
        }
    ],
    "username": "saad1"
}

GET '/project/user/privileges'
- gets all the user privileges in the given project
- Request Arguments: pID, username
http://127.0.0.1:5000/project/user/privileges?pID=name_5stv9&username=saad2

{
    "privileges": [
        [
            "Create artifact",
            "Modify artifact",
            "Remove artifact"
        ]
    ],
    "username": "saad2"
}

PATCH '/project/change_management'
- changes the manager of the given project
- Request Arguments: oldUdername, oldUsername, pID
Request: http://127.0.0.1:5000/project/change_management
{
    "oldUsername": "saad2",
    "newUsername": "saad1",
    "pID": "name_5stv9"
}
Response
{
    "success": true
}
GET '/role/privileges'
- gets all the privileges in the system
Request: http://127.0.0.1:5000/privileges
Response:
{
    "privileges": [
        "Create artifact",
        "Modify artifact",
        "Remove artifact",
        "Create traceability link",
        "Define new artifact type",
        "Modify artifact type",
        "Remove artifact type",
        "Define new traceability link type",
        "Modify traceability link type",
        "Remove traceability link type",
        "View, accept, and reject change request",
        "Add user to project",
        "Remove user from project",
        "Modify project information",
        "View project roles",
        "Create new role",
        "Modify role",
        "Remove role",
        "Change user role",
        "Change management"
    ]
}

GET '/role/privileges'
- gets the privileges of the given role
- Request Arguments: pID, rName
Request: http://127.0.0.1:5000/role/privileges?pID=name_5stv9&rName=Project Manager

Response
{
    "privileges": [
        "Create artifact",
        "Modify artifact",
        "Remove artifact",
        "Create traceability link",
        "Define new artifact type",
        "Modify artifact type",
        "Remove artifact type",
        "Define new traceability link type",
        "Modify traceability link type",
        "Remove traceability link type",
        "View, accept, and reject change request",
        "Add user to project",
        "Remove user from project",
        "Modify project information",
        "View project roles",
        "Create new role",
        "Modify role",
        "Remove role",
        "Change user role",
        "Change management"
    ],
    "rName": "Project Manager"
}
POST '/role'
- creates new role
- Request Arguments: rName, rPrivileges, pID
Request: http://127.0.0.1:5000/role
{
    "rName": "test",
    "rPrivileges": ["Create artifact", "Modify artifact", "Remove artifact"],
    "pID": "name_5stv9"
}
Response:
{
    "success": true
}

PATCH '/role/privileges/add'
- modifies the role name
- Request Arguments: rName, rID, pID
http://127.0.0.1:5000/role
{
    "rID": "Project Manager_TQWhr",
    "rName": "test5",
    "pID": "name_7T358"
}
Response:
{
    "success": true
}


PATCH '/role/privileges/add'
- adds the given privileges from the role
- Request Arguments: rName, rPrivileges, pID
http://127.0.0.1:5000/role/privileges/delete
{
    "rName": "test",
    "rPrivileges": [{"name":"Create artifact of a specific type", "type": "Source_7CT9Q"}],
    "pID": "name_3YM3r"
}
Response:
{
    "success": true
}

PATCH '/role/privileges/delete'
- deletes the given privileges from the role
- Request Arguments: rName, rPrivileges, pID
http://127.0.0.1:5000/role/privileges/delete
{
    "rName": "test",
    "rPrivileges": ["Modify artifact", "Remove artifact"],
    "pID": "name_5stv9"
}
Response:
{
    "success": true
}

DELETE '/role'
- deletes the given role from the project
- Request Arguments: rName, pID
http://127.0.0.1:5000/role?rName=test&pID=name_5stv9

Response:
{
    "success": true
}

GET '/project/artifact_types'
- returns all artifact types in the given project
- Request Arguments: pID
http://127.0.0.1:5000/project/artifact_types?pID=name_5stv9
{
    "artifact_types": [
        {
            "aID": "test_7QqEx",
            "aName": "test",
            "aDescription": "test",
            "pID": "name_5stv9"
        }
    ],
    "success": true
}

POST '/artifact_types'
- creates artifact type
- Request Arguments: aID, aName, aDesscription, pID
Request:
{
    "aID": "test_7QqEx",
    "aName": "test",
    "aDescription": "test",
    "pID": "name_5stv9"
}
{
    "success": true
}

PATCH '/artifact_types'
- modifies the given artifact type
- Request Arguments: aID, aName, aDesscription, pID

Request:
{
    "aID": "test_7QqEx",
    "aName": "test_modified",
    "aDescription": "test",
    "pID": "name_5stv9"
}
Response:
{
    "success": true
}

DELETE '/artifact_types'
- deletes the given artifact type
- Request Arguments: aID, pID

Request:
http://127.0.0.1:5000/artifact_types?aID=test_7QqEx&pID=name_P7GJ5

Response:
{
    "success": true
}

GET '/project/artifacts'
- returns all artifacts in the given project
- Request Arguments: pID
http://127.0.0.1:5000/project/artifacts?pID=name_3YM3r
{
    "artifacts": [
        {
            "artifact_type": "test0",
            "created_by": "saad1",
            "creation_date": "Sat, 20 Feb 2021 00:00:00 GMT",
            "description": "test",
            "id": "requiremenfdgdfgt_FHFvS",
            "name": "requiremenfdgdfgt",
            "project_name": "name_3YM3r",
            "version": 1
        }
    ],
    "success": true
}

POST '/artifact'
- creates artifact
- Request Arguments: aID, aName, aDesscription, artifact_type, pID, username
Request:
{
    "aName": "requirement",
    "aDescription": "test",
    "username": "saad1",
    "artifact_type": "test_QAJR5",
    "pID": "name_3YM3r"
}
Response:
{
    "success": true
}

PATCH '/artifact'
- modifies an artifact
- Request Arguments: aID, aName, aDesscription,artifact_type, pID
Request:
{
    "aID" : "requirement_YcJp9",
    "aName": "requirement_modified",
    "aDescription": "test",
    "username": "saad1",
    "artifact_type": "test_QAJR5",
    "pID": "name_3YM3r"
}
Response:
{
    "success": true
}

DELETE '/artifact'
- deletes the given artifact
- Request Arguments: aID, pID
http://127.0.0.1:5000/artifact?aID=requirement_RsXsd&pID=name_P7GJ5

Response:
{
    "success": true
}

GET '/project/traceability_link_types'
- returns all traceability link types in the given project
- Request Arguments: pID
http://127.0.0.1:5000/project/traceability_link_types?pID=name_VkuAh

Response:
{
    "success": true,
    "traceability_link_types": [
        {
            "description": "Link between requirement and another requirement.",
            "first_artifact_type": "Requirement_RoqwB",
            "id": "Depends on_BxVmN",
            "name": "Depends on",
            "project_name": "name_VkuAh",
            "second_artifact_type": "Requirement_RoqwB"
        },
    ]
}
POST '/traceability_link_type'
- creates new traceability link type in the given project
- Request Argument: pID, tName, tDescription, artifactType1, artifactType2
http://127.0.0.1:5000/traceability_link_type
Reuqest:
{
"tDescription": "test",
"artifactType1": "Requirement_RoqwB",
"tName": "test",
"pID": "name_VkuAh",
"artifactType2": "Requirement_RoqwB"
}
Response:
{
    "success": true
}

PATCH '/traceability_link_type'
- modifies traceability link type in the given project
- Request Argument: pID,tID, tName, tDescription, artifactType1, artifactType2
http://127.0.0.1:5000/traceability_link_type
Reuqest:
{
"tID": "test_LxT44",
"tDescription": "test modified",
"artifactType1": "Requirement_RoqwB",
"tName": "test",
"pID": "name_VkuAh",
"artifactType2": "Requirement_RoqwB"
}
Response:
{
    "success": true
}
DELETE '/traceability_link_type'
- deletes the given traceability link type
- Request Argument:tID, pID

http://127.0.0.1:5000/traceability_link_type?tID=test_LxT44&pID=name_P7GJ5

Response:
{
    "success": true
}

GET '/project/traceability_links'
- returns all traceability links in the given project
- Request Arguments: pID
http://127.0.0.1:5000/project/traceability_links?pID=name_VkuAh

Response:
{
    "success": true,
    "traceability_links": [
        {
            "created_by": "saad1",
            "creation_date": "Sat, 27 Feb 2021 00:00:00 GMT",
            "description": "test",
            "first_artifact": "test1_FAJ54",
            "id": "test_Vbs3r",
            "name": "test",
            "project_name": "name_VkuAh",
            "second_artifact": "test2_67Caw",
            "traceability_Link_Type": "test",
            "version": 1
        }
    ]
}
POST '/traceability_link'
- creates new traceability link in the given project
- Request Argument: pID, tName, tDescription, artifactType1,artifactType2, username, tType
http://127.0.0.1:5000/traceability_links
Reuqest:
{
"username": "saad1",
"tDescription": "test_modified",
"artifact1": "test1_FAJ54",
"tName": "test",
"tType": "test_D3rJc",
"pID": "name_VkuAh",
"artifact2": "test2_67Caw"
}
Response:
{
    "success": true
}

PATCH '/traceability_link_type'
- modifies traceability link in the given project
- Request Argument: pID,tID, tName, tDescription, artifact1, artifact2, tType
http://127.0.0.1:5000/traceability_links
Reuqest:
{
"tID": "test_Vbs3r",
"tDescription": "test_modified",
"artifact1": "test1_FAJ54",
"tName": "test",
"tType": "test_D3rJc",
"pID": "name_VkuAh",
"artifact2": "test2_67Caw"
}
Response:
{
    "success": true
}
DELETE '/traceability_link_type'
- deletes the given traceability link
- Request Argument:tID, pID

http://127.0.0.1:5000/traceability_links?tID=test_Vbs3r&pID=name_P7GJ5

Response:
{
    "success": true
}

GET '/artifact_change_requests'
- returns all artifact change requests in the given project
- Request Arguments: pID
http://127.0.0.1:5000/project/artifact_change_requests?pID=test_Yrtaf

Respnse:
{
    "success": true,
    "artifact_change_requests": [
        {
            "artifact_description": "test",
            "artifact_id": null,
            "artifact_name": "requirement",
            "artifact_type": "Requirement",
            "created_by": "saad1",
            "creation_date": "Fri, 05 Mar 2021 00:00:00 GMT",
            "description": "test",
            "id": "test_SdsU9",
            "project_name": "test_Yrtaf",
            "request_type": "Creation",
            "status": "Pending",
            "title": "test"
        }
    ]
}

GET '/traceability_link_change_requests'
- returns all traceability link change requests in the given project
- Request Arguments: pID
http://127.0.0.1:5000/project/traceability_link_change_requests?pID=test_Yrtaf

Respnse:
{
    "success": true,
    "traceability_link_change_requests": [
        {
            "artifact_description": "test",
            "artifact_id": null,
            "artifact_name": "requirement",
            "artifact_type": "Requirement",
            "created_by": "saad1",
            "creation_date": "Fri, 05 Mar 2021 00:00:00 GMT",
            "description": "test",
            "id": "test_SdsU9",
            "project_name": "test_Yrtaf",
            "request_type": "Creation",
            "status": "Pending",
            "title": "test"
        }
    ]
}

GET '/artifact_sent_change_requests'
- returns all artifact change requests in the given project that has been sent by the given user
- Request Arguments: pID
http://127.0.0.1:5000/project/artifact_sent_change_requests?pID=test_Yrtaf

Respnse:
{
    "success": true,
    "artifact_sent_change_requests": [
        {
            "artifact_description": "test",
            "artifact_id": null,
            "artifact_name": "requirement",
            "artifact_type": "Requirement",
            "created_by": "saad1",
            "creation_date": "Fri, 05 Mar 2021 00:00:00 GMT",
            "description": "test",
            "id": "test_SdsU9",
            "project_name": "test_Yrtaf",
            "request_type": "Creation",
            "status": "Pending",
            "title": "test"
        }
    ]
}

GET '/traceability_link_sent_change_requests'
- returns all traceability link change requests in the given project that has been sent by the given user
- Request Arguments: pID
http://127.0.0.1:5000/project/traceability_link_sent_change_requests?pID=test_Yrtaf

Respnse:
{
    "success": true,
    "traceability_link_sent_change_requests": [
        {
            "created_by": "saad1",
            "creation_date": "Mon, 08 Mar 2021 00:00:00 GMT",
            "description": "test",
            "first_artifact": "Design class_VMsdp",
            "id": "test_An2y7",
            "project_name": "test_Yrtaf",
            "reject_reason": null,
            "request_type": "Create Traceability Link",
            "second_artifact": "class_AMUQd",
            "status": "Accepted",
            "title": "test",
            "traceability_link_description": "test",
            "traceability_link_id": null,
            "traceability_link_name": "link",
            "traceability_link_type": "Is implemented in"
        }
    ]
}

POST '/artifact_creation_request'
- creates a new change requests of type "Creation" in the given project
http://127.0.0.1:5000/artifact_creation_request
Request:
{
    "title": "test",
    "description": "test",
    "request_type": "Creation",
    "aName": "requirement2",
    "aDescription": "test",
    "artifact_type": "Requirement_YAem5",
    "pID": "test_Yrtaf"
}
Response:
{
    "success": true
}

POST '/artifact_modification_request'
- creates a new change requests of type "Modification" in the given project
http://127.0.0.1:5000/artifact_modification_request
Request:
{
    "title": "test",
    "description": "test",
    "request_type": "Modification",
    "aID": "requirement_T2nVv",
    "aName": "requirement2",
    "aDescription": "test",
    "artifact_type": "Requirement_YAem5",
    "pID": "test_Yrtaf"
}
Response:
{
    "success": true
}

POST '/artifact_deletion_request'
- creates a new change requests of type "Deletion" in the given project
- Request Arguments: pID
http://127.0.0.1:5000/artifact_deletion_request
Request:
{
    "title": "test",
    "description": "test",
    "request_type": "Deletion",
    "aID": "requirement_T2nVv",
    "pID": "test_Yrtaf"
}
Response:
{
    "success": true
}

POST '/accept_artifact_request'
- accepts the given change request 
- Request Arguments: pID, id
http://127.0.0.1:5000/accept_artifact_request
Request
{
    "pID": "test_Yrtaf",
    "id":"test_XSxFD"
}
Response:
{
    "success": true
}

POST '/reject_artifact_request'
- rejects the given change request 
- Request Arguments: pID, id, reject_reason
http://127.0.0.1:5000/reject_artifact_request
Request
{
    "pID": "test_Yrtaf",
    "id":"test_TAhc3",
    "reject_reason": "reason"
}
Response:
{
    "success": true
}

DELETE '/artifact_request'
- deletes the given change reuqest
- Request Arguments: id
http://127.0.0.1:5000/artifact_request?id=test_TAhc3

Response:
{
    "success": true
}

POST '/traceability_link_modification_request'
- creates a new change requests of type "Creation" in the given project
- Request Arguments: pID
http://127.0.0.1:5000/traceability_link_modification_request
Request:
{
    "title": "test",
    "description": "test",
    "request_type": "Modify Traceability Link",
    "pID": "test_Yrtaf",
    "tDescription": "test",
    "tName": "link",
    "tType": "Is implemented in_3d5VJ",
    "artifact1": "Design class_VMsdp",
    "artifact2": "class_AMUQd"
}
Response:
{
    "success": true
}

POST '/traceability_link_modification_request'
- creates a new change requests of type "Modification" in the given project
- Request Arguments: pID
http://127.0.0.1:5000/traceability_link_modification_request
Request:
{
    "title": "test",
    "description": "test",
    "request_type": "Modify Traceability Link",
    "pID": "test_Yrtaf",
    "tID": "test_modified2_Z8jZj",
    "tDescription": "test",
    "tName": "link",
    "tType": "Is implemented in_3d5VJ",
    "artifact1": "Design class_VMsdp",
    "artifact2": "class_AMUQd"
}

Response:
{
    "success": true
}

POST '/traceability_link_deletion_request'
- creates a new change requests of type "Deletion" in the given project
- Request Arguments: pID
http://127.0.0.1:5000/traceability_link_deletion_request
Request:
{
    "title": "test",
    "description": "test",
    "request_type": "Deletion",
    "tID": "test_modified2_Z8jZj",
    "pID": "test_Yrtaf"
}
Response:
{
    "success": true
}

POST '/accept_traceability_link_request'
- accepts the given change request 
- Request Arguments: pID, id
http://127.0.0.1:5000/accept_traceability_link_request
Request
{
    "pID": "test_Yrtaf",
    "id":"test_XSxFD"
}
Response:
{
    "success": true
}

POST '/reject_traceability_link_request'
- rejects the given change request 
- Request Arguments: pID, id, reject_reason
http://127.0.0.1:5000/reject_traceability_link_request
Request
{
    "pID": "test_Yrtaf",
    "id":"test_TAhc3",
    "reject_reason": "reason"
}
Response:
{
    "success": true
}

DELETE '/traceability_link_request'
- deletes the given change reuqest
- Request Arguments: id
http://127.0.0.1:5000/traceability_link_request?id=test_TAhc3

Response:
{
    "success": true
}

GET '/export_traceability_link_information'
- Returns a CSV file containing all traceability links inforamtion in the given project
- Request Arguments: pID

GET '/export_artifact_information'
- Returns a CSV file containing all artifacts inforamtion in the given project
- Request Arguments: pID
http://127.0.0.1:5000/project/export_artifact_information?pID=test_5ATqo

GET '/project/notifications'
- Returns all notifications for the user in the given project
- Request Arguments: pID
http://127.0.0.1:5000/project/notifications?pID=test_5ATqo

Response:
{
    "notifications": [
        {
            "artifact_request_id": "test2_TkRn8",
            "id": "saad1_EoCKB",
            "pID": "test_5ATqo",
            "username": "saad1"
        }
    ],
    "num_of_notifications": 1
}

DELETE '/notifications'
- deletes the given notification
- Request Arguments: notify_id
http://127.0.0.1:5000/notifications?notify_id=saad1_5X3Vi
Response:
{
    "success": true
}

GET '/project/impact_analysis'
- returns the result of an impact anaylsis of the given artifact
- Request Arguments: pID, aID
http://127.0.0.1:5000/project/impact_analysis?pID=test_5ATqo&aID=test1_5ZzDN
{
    "affected_artifacts_percentage": 75.0,
    "direct_artifacts": [
        {
            "Traceability_Link_Type": "Is origin of",
            "name": "req1"
        }
    ],
    "indirect_artifacts": [
        "req2",
        "test"
    ]
}

GET '/project/test_coverage_analysis'
- returns the result of a test coverage analysis of the given project
- Request Arguments: pID
http://127.0.0.1:5000/project/test_coverage_analysis?pID=test_5ATqo
{
    "covered_artifacts": [
        {
            "name": "req1",
            "test_case": "test",
            "traceability_link_name": "origin"

        }
    ],
    "covered_artifacts_percentage": 50.0,
    "uncovered_artifacts": [
        "req2"
    ]
}

GET '/project/elaboration_coverage_analysis'
- returns the result of an elaboration coverage analysis of the project
- Request Arguments: pID
http://127.0.0.1:5000/project/elaboration_coverage_analysis?pID=test_5ATqo
{
    "covered_artifacts": [
        {
            "business_need": "need",
            "requirements": [
                "req"
            ]
        },
        {
            "business_need": "need2",
            "requirements": [
                "req2"
            ]
        }
    ],
    "covered_artifacts_percentage": 66.67,
    "uncovered_artifacts": [
        "need3"
    ]
}