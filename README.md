# SHOPPING CART

WE ARE GOING TO USE LOCAL STORAGE OR COOKIES, TO STORE INFO OF USERS SHOPPING CART (**WE CAN'T USE DATBASE, BECAUSE WE WILL ALLOW ANY USER TO ADD ITEMS TO CART AN TO INTERACT WITH OTHER LOGIC OF SHOPPING CART, `BUT IF USERS WANTS TO BUY THINGS HE WILL BE DIRECTED TO SIGN IN`**)

**WE ARE GOING TO MANGE STATE OF OUR SHOPPING CART BY USING [xstate](https://www.npmjs.com/package/xstate) AND [@xstate/react](https://www.npmjs.com/package/@xstate/react) LIBRARIES**

AND WE WILL USE [js-cookie](https://www.npmjs.com/package/js-cookie)

## SHOPPING CART DRAWER UI WILL BE DRAWER RENDERED ON EVERY PAGE

IT IS GOING TO BE COMPONENT THAT IS PART OF THE HEADER COMPONENT

## WE WON'T BE HAVING CART PAGE

I STILL NEED TO DECIDE ABOUT THIS (YES I DECIDED, **WE DON'T NEED CART PAGE, CART WILL BE DRAWER COMPONENT**)

## WHEN ITEM IS ADDED TO THE CART QUANTITY IN DATBASE SHOULD BE LOWERED (IT WOULD BE LIKE RESERVATION)

**THIS IS MAYBE TOO MUCH**

OFCOURSE I DIDN'T TACKLE ANY CONCURRENCY PROBLEMS (I SHOULDN'T (BECAUSE FOR THAT PURPOSE I SHOULD SEPARATE EVERYTHING IN MICROSERVICE AND USE MESSSAGE BROKER (OUT OF SCOPE OF THIS PROJECT)))

# COMPONENTS WE BUILT AROUND CART LOGIC

# MACHINE I BUILT AND HOOKED UP