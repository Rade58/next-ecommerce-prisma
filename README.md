# MAKING CORRECTIONS TO OUR SCHEMA (UNDER ONE OF LAST HEADINGS PF THIS MD FILE, YOU CAN SEE WHAT I DID INSIDE SCHEMA)

IN LAST BRNCH I FORGOT TO THINK OF SOME MODELS I CAN ADD

ALSO WE NEED TO ALTER TYPES ON SOME FIELDS

WE NEED COUPLE OF MODELS:

WE NEED `Order` MODEL (**ONE ORDER CAN BE AN ORDER FOR MANY PRODUCTS (JUST THINK OF THAT)**)

**ALSO ORDER NEEDS TO HAVE: PENDING,  FULFILLED OR REJECTED `status`** (SO I'M ADDING NEW ENUM FOR THAT PURPOSE)

WE NEED `Review` MODEL

WE NEED `reviews` FIELD ON `Product`

# I AM NOT GOING TO USE `Transaction` MODEL (TABLE) AT ALL (I ADDED IT IN LAST BRANCH (DOING THIS BECAUSE AT THE END MY APP IS GOING TO BE A BIT MORE COMPLEX THAN I THOUGHT))

INSTEAD OF THIS I WILL CREATE Order MODEL AND COUPLE MORE

# I AM NOT EXPERIENCED WITH POSTGRESQL SO I HAD AN IDEA TO USE JSONB, BUT I ENDEND UP NOT USING IT

IT WOULD LOOK TEDIOUS

# I WAS DIGGING TO FIND SOME EXAMPLES OF SCHEMAS FOR ECOMMERCE SITES

[THIS LOOKS COOL](https://github.com/prisma/schema-collection-for-prisma-framework/issues/2) **I CAN LEARN COUPLE OF THINGS FROM THIS SCHEMA, ESPECIALLY FROM THESE MODELS: `CartElement` `OrderElement` `Order`**

FOR MY CURRENT APP I AM ESPECIALLY INTERESTED IN `Order` MODEL AND `OrderElement` MODEL

KEEP IN MIND THAT THESE MODELS ARE USING LEGACY SYTAX (I THINK)

```c#
generator photon {

  provider = "photonjs"
  output   = "../node_modules/@generated/photon"
}

datasource db {
  provider = "postgresql"
  url      = url
}

enum Permission {
  ADMIN
  USER
  ITEMCREATE
  ITEMUPDATE
  ITEMDELETE
  PERMISSIONDELETE
  PERMISSIONUPDATE
}

model User {
  id               String               @default(cuid()) @id
  email            String               @unique
  firstName        String?
  lastName         String?
  password         String
  resetToken       String?
  resetTokenExpiry Float?
  permissions      Permission[]
  cart             CartElement[]
  discount         Discount?
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt
  billingAddress   UserBillingAddress?
  shippingAddress  UserShippingAddress?
}

model Discount {
  id             String    @default(cuid()) @id
  percentage     Int?
  amount         Int?
  appliesTo      Product[]
  expires        Boolean
  expireDateTime DateTime?
}

model Product {
  id           String   @default(cuid()) @id
  code         String   @unique
  name         String
  description  String
  image        String?
  largeImage   String?
  price        Int
  category     String?
  emailForMore String?
  addonCode    String?
  addonText    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model CartElement {
  id        String   @default(cuid()) @id
  quantity  Int      @default(value: 1)
  product   Product
  user      User
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model OrderElement {
  id           String   @default(cuid()) @id
  code         String   @unique
  name         String
  description  String
  image        String?
  largeImage   String?
  price        Int
  category     String?
  emailForMore String?
  addonCode    String?
  addonText    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Order {
  id              String               @default(cuid()) @id
  elements        OrderElement[]
  total           Int
  user            User
  charge          String
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt
  billingAddress  OrderBillingAddress
  shippingAddress OrderShippingAddress
}

model Address {
  id         String @default(cuid()) @id
  street     String
  city       String
  province   String
  country    String
  postalCode String
}

model UserBillingAddress {
  id         String @default(cuid()) @id
  street     String
  city       String
  province   String
  country    String
  postalCode String
}

model UserShippingAddress {
  id         String @default(cuid()) @id
  street     String
  city       String
  province   String
  country    String
  postalCode String
}

model OrderBillingAddress {
  id         String @default(cuid()) @id
  street     String
  city       String
  province   String
  country    String
  postalCode String
}

model OrderShippingAddress {
  id         String @default(cuid()) @id
  street     String
  city       String
  province   String
  country    String
  postalCode String
}
```

**SOME OTHER THINGS THAT ARE INTERESTING ABOVE ARE `cart` COLUMN ON `User`, AND `CartElement`**

cart FIELD REPRESENTS ARRAY OF CartElements

**SO CREATOR OF SCHEMA ABOVE, DECIDED TO STORE CART ON DATBASE**

I AM NOT GOING TO STORE CART SERVER SIDE BUT IT SEEMS INTERESTING

## AND WE CAN MAKE MULTIPLE MUTATIONS TO THE DIFFERENT TABLES AT THE AME TIME, BY USING PRISMA CLIENT

[SEE THIS](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-writes)

HERE IS PRESENTED NESTED WRITE

```TS
// SEE THIS
const createUserAndPost = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa Prisma',
    posts: {
      create: [
        { title: 'How to make an omelette' },
        { title: 'How to eat an omelette' },
      ],
    },
  },
})


// OR HERE WHERE THE NESTED RECORDS ARE INCLUDED IN RESPONSE

const user = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa Prisma',
    posts: {
      create: [
        { title: 'How to make an omelette' },
        { title: 'How to eat an omelette' },
      ],
    },
  },
  include: {
    posts: true, // Include all posts in the returned object
  },
})

```

**I WOULD IMPLEMENT SOMETHING LIKE `createOrderAndOrderElements`**

# OK, THIS IS MY SCHEMA

BESIDES ALL THAT I MENTIONED I ADDED `Profile` MODEL WHICH HAS:

`address` `city`

I DID THAT BECAUSE I DONT WANT TO CHANGE `User` THAT MUCH

**THIS IS WHAT I CREATED SO FAR, IT END UP PRETTY EXTENSIVE**

```
cat prisma/schema.prisma
```

```groq
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

// THIS ONE IS FOR THE STATUS OF ORDER
enum OrderStatus {
  PENDING
  FULFILLED
  REJECTED
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
  id String @id @default(cuid())

  //
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?


  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  accounts  Account[]
  sessions  Session[]
  profiles  Profile[]
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

// ---- PRODUCTS, ORDERS, REVIEWS ... ----
// --------------------------------------------------

model Product {
  productId    String   @id @default(cuid())
  admin        Profile  @relation(fields: [adminId], references: [id])
  adminId      String
  name         String
  image        String
  description  String
  brand        String
  category     String?
  price        Float
  countInStock Int
  // AVERAGE OF ALL OF THE REVIEW RATING (JUST YOU KNOW)
  rating       Float    @default(0.0)
  numReviews   Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt


  //  Reviews
  reviews Review[]

  // OrderElements
  orderElements OrderElement[]

}

model Review {
  id        String   @id @default(cuid())
  product   Product  @relation(fields: [productId], references: [productId])
  productId String
  name      String
  rating    Float
  user      Profile  @relation(fields: [userId], references: [id])
  userId    String
  comment   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model OrderElement {
  id        String  @id @default(cuid())
  quantity  Int
  product   Product @relation(fields: [productId], references: [productId])
  productId String

  // ----------------------
  order   Order  @relation(fields: [orderId], references: [id])
  orderId String
}

// THIS IS A PAYPAL THING
model PaymentResult {
  // THIS IS THE ID THAT WILL BE GENERATED
  paymentId   String  @id @default(cuid())
  // THIS IS THE ID FROM PAYPAL
  id          String?
  //
  status      String?
  update_time String?
  email       String?

  orders Order[]
}

//

model Order {
  id              String         @id @default(cuid())
  buyer           Profile        @relation(fields: [buyerId], references: [id])
  buyerId         String
  items           OrderElement[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  // WE WILL UPDATE THIS
  // WHEN WE FIND OUT STATUS FROM paymentResult
  // OR MAYBE WE WILL REMOVE THIS IN THE FUTURE
  status          OrderStatus
  // PAYPAL RELATED
  paymentResult   PaymentResult? @relation(fields: [paymentResultId], references: [paymentId])
  //
  paymentResultId String?

  shippingPrice Float? @default(0.0)

  payedAt DateTime?

  isDelivered Boolean @default(false)

  deliveredAt DateTime?

}

model Profile {
  id     String @id @default(cuid())
  user   User   @relation(fields: [userId], references: [id])
  userId String

  role          Role    @default(USER)
  // FOR SHIPPING PURPOSES
  addrss        String?
  city          String?
  postalCode    String?
  country       String?
  paymentMethod String?
  taxPrice      Float?  @default(0.0)

  // --------------
  ordersHistory Order[]

  productCreationHistory Product[]
  reviewsHistory         Review[]

}

// I DON'T NEESD THIS
// model Transaction {
// transactionId String   @id @default(cuid())
// product       Product  @relation(fields: [productId], references: [productId])
// productId     String
// buyer         User     @relation(fields: [buyerId], references: [id])
// buyerId       String
// createdAt     DateTime @default(now())
// }

// --------------------------------------------------
// --------------------------------------------------

```

# WE CHANGED SO MANY THING, AND THEREFORE WE NEED TO DO A MIGRATION

```
yarn prisma:migrate:init
```

APEARS TO BE SUCCESFUL, ALSO PRISMA CLIENT IS GENERATED

# NOW WE WILL ADD SOME SAMPLE DATA TO PLAY WITH

WE ARE GOING TO USE PRISMA STUDIO

```
yarn prisma:studio
```

BEST THING FOR NOW IS TO PLAY AROUND WITH STUDIO, CREATE SOME RECORDS (JUST CHECK IF EVERYTHING IS WORKING AS EXPECTED)
