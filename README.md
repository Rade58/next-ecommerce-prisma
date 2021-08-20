# DATBASE SETUP

GOING TO USE PostgreSQL INSTANCE FROM [SUPABASE](https://supabase.io/)

AND WE ARE GOING TO USE PRISMA ORM

# WHAT DO I NEED IN PRISMA SCHEMA

FIRST OF ALL [YOU NEED TO KNOW MORE AND UNDERSTAND DATA MODEL IN PRISMA](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model)

ALSO KNOW MORE ABOUT [RELATIONS](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

AND FOR OUR PROJECT ESPECCIALLY WE NEED THESE MODELS:

- `User` MODEL (KEEP IN MIND THAT YOU NEED ALL THE COLUMNS REQUIRED BY THE [NEXT-AUTH](https://next-auth.js.org/adapters/prisma#setup), SINCE WE WILL IMPLEMENT AUTHENTICATION WITH NEXT AUTH LATTER ON) (ALSO KEEP IN MIND THAT YOUR USER NEEDS A ROLE: "ADMIN" OR "USER" (BECAUSE LATTER ON WE WILL DEFINE THAT ONLY ADMIN CAN ADD PRODUCTS))

- `Product` MODEL (SHOULD HAVE REFERENCE TO ADMIN WHO CREATED THE PRODUCT) (**PRETTY MUCH LOOK INTO [THIS](dummy/products.ts) AND YOU CAN CONSTRUCT MODEL**) (OFCOURSE WE WILL ADD ADDITIONAL STUFF LIKE `createdBy` FIELD)

- `Transaction` MODEL (SHOULD HAVE REFERENCE OF THE Product AND REFERENCE FOR THE User WHO BOUGHT THE PRODUCT) (THIS RECORD SHOULD BE CREATED ONLY AFTER SUCCESSFUL PAYMENT WHCH WE WILL PROCESS WITH PAYPAL LATTER ON)

- `Profile` MODEL (FOR DEFINNING ADDITIONAL USER INFO AS PAYMENT INFO OR BIOGRAPHY OR SOMETHING ELSE)

YOU CAN GET WILD WITH THOSE MODELS BUT SINCE I NEED TO SAVE TIME, **I DECIDED NOT TO ADD `Category` TABLE** (BUT IF YOU ARE BUILDING BIGGER STORE I'M SURE THAT YOU CAN IMPLEMENT `Category` TABLE WHICH WOULD BE REFERENCED ON `Product` RECORD)

