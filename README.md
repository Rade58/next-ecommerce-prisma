# REVIEWS LOGIC

JUST SO YOU KNOW, USERS SHOULD ONLY BE ALLOWES TO LEAVE REVIEW TO A PRODUCT HE BOUGHT ,AND ONLY ONE REVIEW SHOULD BE ALLOWED OFCOURSE

BUT WE DON'T WANT TO OVER COMPLICATE OUR EDUCATIONAL APPLICATIOS, SO WE WILL ALLOW OUR USER TO LEAVE A REVIEW OF THE PRODUCT THAT IS MARKED AS DELIVERED (IF THE ADMIN MARKED PRODUCT AS DELIVERED WE WILL ALLOW REVIEWS)

REVIEWS (RATING PORTION (WHICH WE CALCULATE) IS IMPORTANT FOR MAIN PAGE), AND WE NEE TO ADD UI FOR INDIVIDUAL PRODUCT PAGE WHERE WE ARE GOING TO DISPLAY REVIEW COMMENT AND RATING AND MAYBE SOME OTHER STUFF

## FIRST LET'S MAKE SEEDING ROUTE FOR REVIEWS

WE CAN USE [MOCKAROO](https://www.mockaroo.com/) TO GENERATE SOME JSON WE CAN SEED

WE DON'T NEED MORE THAN 80 REVIEWS

`pages/api/mock/seed-reviews.ts`

NOW LETS SEED

```
http GET :3000/api/mock/seed-reviews
```

I HAVE AROUND 80 REVIEWS IN MY DATBASE

## LETS NOW EXTEND PRODUCT PAGE, WHERE, FOR THE START, WE GOING TO QUERY FOR Review RECORD INSIDE `getServerSideProps` AND PASS THEM AS ADDITIONAL TO OTHER STUFF

WE ARE QUERYING Review RECORDS TIED TO SINGLE PRODUCT, OFCOURSE (WE ALREADY DID THAT AT SOM POINT EARLIER, I FORGOT)

```
cat pages/products/[prodId].tsx
```

BUT WE NEED TO FIX PASSING DATES AS PROPS (BECAUSE OF SERIALIZATION)

AND WE NEED TO EXTEND A BITI REVIEWS PART OF QUERY, TO INCLUDE PROFILE DATA OF THE PERSON WHO LEFT REVIEW

## NOW, WE WILL CREATE LOGIC FOR REVIEWS INSIDE Product COMPONENT ON P
INDIVIDAL PRODUCT PAGE

```
cat components/2_product_page/Product.tsx
```

# AND WE WILL CRETE ROUTE

```
cat pages/api/review/[prodId].ts
```

## I HAVE TRIED IT OUT

AND EVERYTHING SEEMS TO WORK CORRECTLY