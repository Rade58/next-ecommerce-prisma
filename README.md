# ORDERS DUMMY RECORDS SEEDING; ORDERS TABLE ON ADMIN PAGE; LOGIC FOR MARKING ORDER AS "delivered"

**ALSO WE WILL CREATE ORDER PAGE** (FOR NOW JUST SKAFFOLD IT) (YES WE ARE GOING TO USE `getServerSideProps` FOR THIS PAGE TOO) (WE WILL BUILD MORE OF THIS PAGE WHEN WE START DEVELOPING CHECKOUT PROCESS)

## LET'S WRITE "TEMPORARRY" ROUTE (WE ARE GOING TO USE THAT ROUTE ONLY ONCE TO SEED SOME RECORDS), WHERE WE ARE GOING TO IMPLEMENT SEEDING OF A LOT OF Order RECORDS

```
cat pages/api/mock/seed-orders.ts
```

SEEDING ORDERS

```
http GET :3000/api/mock/seed-orders
```

CHECKING IF WE CREATED ORDERS:

```
yarn prisma:studio
```

LOOKS LIKE WE DID

# WE CAN THEN, BUILD A ORDERS TABLE

TWO FIELDS SHOULD BE EDITABLE: `delivered` AND `deliveredAt`

AND ALSO YOU SHOULD DISPLAY user EMAIL, DATE OF ORDER CREATION, TOTAL PRICE

**ALSO, WE SHOUD ADD LINK TO ORDER PAGE, BECAUSE ADMIN SHOULD HAVE ACCESS TO ORDER PAGE** (ORDER PAGE SHOULD ONLY BE POSSIBLE TO BE SEEN USER WHO IS MAKING AN ORDER AND ADMIN USER)

```
cat 
```