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


YOU CAN GET WILD WITH THOSE MODELS BUT SINCE I NEED TO SAVE TIME, **I DECIDED NOT TO ADD `Category` TABLE** (BUT IF YOU ARE BUILDING BIGGER STORE I'M SURE THAT YOU CAN IMPLEMENT `Category` TABLE WHICH WOULD BE REFERENCED ON `Product` RECORD`)

`Profile` MODEL (I DON'T THINK I'LL ADD THIS) (FOR DEFINNING ADDITIONAL USER INFO AS PAYMENT INFO OR BIOGRAPHY OR SOMETHING ELSE YOU WOULD ADD THIS)

# SO FAR, THIS IS MY PRISMA CHEMA

```
cat prisma/schema.prisma
```

```c#
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ROLE
enum Role {
  USER
  ADMIN
}

//                    NEXT-AUTH
// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------

model Account {
  id                 String    @id @default(cuid())
  userId             String
  providerType       String
  providerId         String
  providerAccountId  String
  refreshToken       String?
  accessToken        String?
  accessTokenExpires DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  user               User      @relation(fields: [userId], references: [id])

  @@unique([providerId, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  expires      DateTime
  sessionToken String   @unique
  accessToken  String   @unique
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  user         User     @relation(fields: [userId], references: [id])
}

model User {
  id            String        @id @default(cuid())
  // ADDING ROLE AND DEFULT VALUE
  role          Role          @default(USER)
  //
  name          String?
  email         String?       @unique
  emailVerified DateTime?
  image         String?
  // ADDING RELATIONS FOR ADMIN USER (THAT'S WHY THIS FIELD IS OPTIONAL)
  products      Product[]
  // AND FOR TRANSACTIONS
  transactions  Transaction[]
  //
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  accounts      Account[]
  sessions      Session[]
}

model VerificationRequest {
  id         String   @id @default(cuid())
  identifier String
  token      String   @unique
  expires    DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([identifier, token])
}

// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------
// --------------------------------------------------

// ----------- PRODUCTS AND TRANSACTIONS ------------
// --------------------------------------------------

model Product {
  id           String   @id @default(cuid())
  admin        User     @relation(fields: [adminId], references: [id])
  adminId      String
  name         String
  image        String
  description  String
  brand        String
  category     String?
  price        Float
  countInStock Int
  rating       Float
  numReviews   Int
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // WE NEED THIS BECAUSE OF RELATIONS
  transactions Transaction[]
}

model Transaction {
  transactionId String   @id @default(cuid())
  product       Product  @relation(fields: [productId], references: [id])
  productId     String
  buyer         User     @relation(fields: [buyerId], references: [id])
  buyerId       String
  createdAt     DateTime @default(now())
}

// --------------------------------------------------
// --------------------------------------------------

```

## THING ABOUT CONCURRENCY

WE ARE NOT USING MICROSERVICES INFRASTRUCTURE AND THAT IS OBVIOUS

PROBLEMS WITH CONCURRENCY MAY OCCUR IF THERE IS ONLY ONE PRODUCT IN STOCK AND TWO BUYERS SENT A REQUESTS AT THE SAME TIME

ONLY THING YOU CAN FIX THIS IS TO DECREMENT countInStock WHEN USER ADDS PRODUCT TO THE CART

SO WHEN USERS ADDS PRODUCT TO THE CART WE SHOULD IMPLEMENT TIMER OF MAYBE 20 MINUTES (SO IF USER DOESN'T CHECKOUT IT, AFTER 20 MINUTES WE SHOUD INCREMENT countInStock)

ALSO ON UNSECCSSFULL PAYMNT WE SHOULD INCREMENT BACK

