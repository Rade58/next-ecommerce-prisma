# MAKING CORRECTIONS TO OUR SCHEMA (AT THE UNDER LST HEADING, YOU CAN SEE WHAT I DECIDED TO DO)

IN LAST BRNCH I FORGOT TO THINK OF SOME MODELS I CAN ADD

ALSO WE NEED TO ALTER TYPES ON SOME FIELDS

WE NEED COUPLE OF MODELS:

WE NEED `Order` MODEL (**ONE ORDER CAN BE AN ORDER FOR MANY PRODUCTS (JUST THINK OF THAT)**)

**ALSO ORDER NEEDS TO HAVE: PENDING,  FULFILLED OR REJECTED `status`** (SO I'M ADDING NEW ENUM FOR THAT PURPOSE)

WE NEED `Review` MODEL

WE NEED `reviews` FIELD ON `Product`

# I AM NOT GOING TO USE `Transaction` MODEL (TABLE) AT ALL

I ALSO HAVE A MISTKE IN IT SINCE IT IS USED AS A TRNSACTION FOR ONLY ONE PRODUCT

AND THAT WONT BE THE CASE IN MY APP

**WE WON'T NEED Transaction MODEL BECAUSE WITH Order MODEL WE WILL HAVE INFO WHAT IS BOUGHT AND WHAT NOT, SINCE ON ORDER WE WILL HAVE STATUS (PENDING, REJECTED , FULFILLED) AND AMOUNT OF MMONEY**

# I AM NOT EXPERIENCED WITH POSTGRESQL SO I HAD AN IDEA TO USE JSONB

ONE EXAMPLE IS ARRAY OF PRODUCTS ON ORDER RECORD

**WE WILL USE PRODUCT ID'S FOR THAT PURPOSE**

SO THAT'S TWO QUERIES (1. OBTAINING Order 2. TAKING IDs AND QUERY FOR PRODUCTS)

**BUT SINCE EVERY PRODUCT NEEDS QUANTITY, WE NEED TO STORE OBJECT INSODE OF THE ARRY**

WE NEED THIS FORMAT `{productId: String, quantity: Integer, priceSuma: FloatingPoint}[]` (AND WE NEED SOME FIELDS )

**BUT THIS WOULD LOOK TO TEDIOUS**

# I WAS DIGGING TO FIND SOME EXAMPLES OF SCHEMAS FOR ECOMMERCE SITES

[THIS LOOKS COOL](https://github.com/prisma/schema-collection-for-prisma-framework/issues/2) **I CAN LEARN COUPLE OF THINGS FROM THIS SCHEMA, ESPECIALLY FROM MODELS: `CartElement` `OrderElement` `Order`**

FOR MY CURRENT APP I AM ESPECIALLY INTERESTED IN `Order` MODEL AND `OrderElement` MODEL

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

**THINK THAT ARE INTERESTING ABOVE ARE `cart` COLUMN ON `User`, AND `CartElement`**

cart FIELD REPRESENTS ARRAY OF CartElements

**SO CREATOR OF SCHEMA ABOVE, DECIDED TO STORE CART ON DATBASE**

I AM NOT GOING TO STORE CART SERVER SIDE BUT IT SEEMS INTERESTING

## AND WE CAN MAKE MULTIPLE MUTATIONS TO THE DIFFERENT TABLES AT THE AME TIME, BY USING PRISMA

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

YOU CAN SE WHAT I ADDED