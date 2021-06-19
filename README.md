# Automated tests for Buggy Cars Rating

### Setup
`git clone https://github.com/nanw94/buggy-rating.git`   # clone

`cd buggy-rating`  # go to project folder

`npm install`   # install dependencies

### Run the tests in cypress runner
`npx cypress open`  # then click Tests.js in the runner
### Or run the tests in command-line
`npx cypress run` 

## Critical bugs found

#### Bug-1 Unable to load model detail page in Safari or Firefox due to vertical line in the link

>  Steps:

1.  Open Safari or Firefox and navigate to home page - [https://buggy.justtestit.org](https://buggy.justtestit.org)
2.  Click the card in the middle for the most Popular Model to open the model detail page

> Expected:

Model detail page is loaded

> Actual:

Unable to load the details of the page due to vertical line in the URL 

> Note:

In Chrome the vertical line in the URL can be converted to “%7C” automatically so the request can be successfully sent, however not all the browser or device can do the same so need to avoid using | divider in the url


#### Bug-2 Sorting by rank doesn’t work right in overall rating page

> Steps:

1.  Go to overall rating page - [https://buggy.justtestit.org/overall](https://buggy.justtestit.org/overall)    
2.  Click Rank to sort the list by rank   

> Expected:

Rank gets sorted as 1,2,3,4..

> Actual:

Rank gets sorted as 1,10,11,12...19, 2, 20, 21…
#### Bug-3 Author is missing for the model which has more than 100 comments in the response payload
> Steps:

1. View this model https://buggy.justtestit.org/model/c0bm09jgagshpkqbsuq0%7Cc0bm09jgagshpkqbsuqg and view the comment section
> Expected:

Author of each commet is listed

> Actual:

Auther is missing for every comment 

> Note

This occurs for every model detail page which contains a large number of comments and the response has to divide the comment into [0-99], [100-199]...and then all the user in it will be `user: ""`


## Other bugs found
#### Sorting
In Make detial page 
`e.g. https://buggy.justtestit.org/make/c0bm09bgagshpkqbsuag`, 
Mode or Rand doesn't call any function to sort it in any way, and Votes will call `c0bm09bgagshpkqbsuag?modelsPage=1&modelsOrderBy=random`which will sort it by vote count in random order.

#### Navigating
Logout button doesn't work when it's on the overall rating page `https://buggy.justtestit.org/overall`
Unable to get back to home page by clicking "Buggy Rating" in the upper left from any of the Make detial page 
`e.g. https://buggy.justtestit.org/make/c0bm09bgagshpkqbsuag`
as it's `href="/broken"`

The link for twitter in the lower right conner of overall rating page is broken as `href="https://www.twitter-broken.com/">`

#### Validation
Profile page, it doesn't validate if age input is not an integer e.g. `35.5` or `30+5`
It validate the length of comment, address and phone but doesn't tell the limit
Error message for password validation is not user friendly `e.g. InvalidParameter: 1 validation error(s) found. - minimum field size of 6, ChangePasswordInput.PreviousPassword.`

#### Pagination

No pagination or "load more" for the comments
Next page button doesn't get disabled even if it's alreay page 6 of 5.

#### Content
The Max Speed for a Lamborghini shouldn't be 25km/h
