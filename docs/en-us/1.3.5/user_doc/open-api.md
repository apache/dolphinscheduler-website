
# Open API

## Background
Generally, projects and processes are created through pages, but integration with third-party systems requires API calls to manage projects and processes.

## Operating steps

### Create token
1. Log in to the scheduling system, click "Security", then click "Token manage" on the left, and click "Create token" to create a token.

<p align="center">
   <img src="/img/token-management-en.png" width="80%" />
 </p>

2. Select the "Expiration time" (Token validity), select "User" (to perform the API operation with the specified user), click "Generate token", copy the Token string, and click "Submit"

<p align="center">
   <img src="/img/create-token-en1.png" width="80%" />
 </p>

### Use token
1. Open the API documentation page
    > Address：http://192.168.xx.xx:12345/dolphinscheduler/doc.html
<p align="center">
   <img src="/img/api-documentation-en.png" width="80%" />
 </p>
 
2. select a test API, the API selected for this test: queryAllProjectList
    > projects/query-project-list
                                                                             >
3. Open Postman, fill in the API address, and enter the Token in Headers, and then send the request to view the result
    ```
    token:The Token just generated
    ```
<p align="center">
   <img src="/img/test-api.png" width="80%" />
 </p>  