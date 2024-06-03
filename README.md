# Coding Challenge

This coding challenge is designed to assess how you approach and solve a problem that is very similar to the day to day way of working at MerchantSpring. It is based off a real requirement to give you a sense of what the work is like, however it is not real work for our product. It shouldn't take more than a few hours, there are no hidden tricks, please approch this problem as you would if you were releasing it to production.

## Assets

- coding-challenge-ui - this is the front end (React + Typescript)
- coding-challnge-api - this is the backend (NodeJS, Typescript + Express)

### To run both:

`npm run dev`

### To run tests:

`npm run test`

## Requirements

- Provided is a wireframe for a widget we would like you to build (wireframe.jpeg) The application helps marketplace sellers with cross-marketplace data insights. The widget we want you to build is a view of the orders that have been placed that are overdue for shipping.
- The data to populate the widget is provided in two .csv files (coding-challenge-api/data). The orders data is gzipped due to its size.
- Create an REST api that reads in data from the csv and returns it to the front-end
  in the appropriate format
- Create the required components on the front-end to match the wireframe
- Write production quality code and follow best practises for testing
- Note that the wireframe has an option for sorting, please make sure the implementation reflects this
- You can use any third party libraries you want to
- You can refactor the code, both your own and the existing code, as long as it can be run locally with the same commands
- Please don't change the format of the csv
- The code should run locally on your machine (doesn't need to be deployed anywhere)
- Please check the completed challenge in to a git repository and email us the link
- If you have any questions about the challenge or the requirements please feel free to reach out to the team and we will answer them :)


## Coding Challenge - Installations and Api endpoints

## Installations

### Run the backend
 
 - `cd coding-challnge-api`
 - `npm run dev`

### Run the frontend 

 - `cd coding-challnge-ui`
 - `npm run dev`

 ## Test

  Run `npm run test` from the root dir

## Api

### Get order api

This api is used to fetch the orders from the order.csv. Response is the json order object.

URL- `api/orders`

### Get stores Api

This api is used to fetch the stores from the store.csv. Response is the json store object.

URL- `api/stores`

### Get merged-orders Api

This api is used to fetch the particular order from order.csv which has a storeId present in the store.csv. Response is the json object whihc has all the order details along with the days overdue field.

URL- `api/merged-orders`

## Design Choices

- Modular Design - The API is designed in a modular way, where each function is responsible for a specific task. This modularity improves readability, maintainability, and testability of the code. The /api/merged-orders endpoint demonstrates how to merge data from different orders and stores.
- Use of Promises and Async/Await - The API makes use of JavaScript Promises and async/await syntax for handling asynchronous operations. This approach makes the code easy to read and understand compared to traditional callback-based approaches.
- Streaming- The fs.createReadStream function is used to handle potentially large CSV files efficiently without loading the entire file into memory.
- Compression- The zlib.createGunzip function is used to decompress gzipped orders CSV files. This is for reducing the storage space.


## Tests
- These tests provide a basic but effective way to ensure the API endpoints are functioning correctly. By checking the status codes and response structures, we can catch many common issues early in development.
-  Each test has a timeout to ensure they complete within a reasonable time frame due to the enormity of the orders. 