# MOCKS FOR User RECORDS; USERS TABLE; READ, UPDATE, DELETE FOR USERS

## SEEDING ROUTE FOR USERS (AND PROFILES)

`pages/api/mock/seed-users.ts`

SEEDING WITH HTTPIE

```
http GET :3000/api/mock/seed-users
```
# USERS TABLE

SO BASICALLY ADMIN SHOULD ONLY HAVE ABILITY TO CHANGE ROLE FOR THE USER, NOTHING MORE

WE CALLED IT USERS TBLE BUT THIS SHOULD BE PROFILES TABLE

MAYBE ADD

`components/4_admin_page/UsersTable.tsx`

# I ALSO MANGED TO FIX INDIVIDUAL PRODUCT PAGE AND ADD LAZY LOADING FOR PRODUCTS ON MAIN PAGE

AND I AM LOADING DATAFROM DATBASE IN THESE PAGES

# ALSO ADDED ENDPOINT THAT LOAD PRODUCTS

I AM USING CURSOR BASED PAGINATION

`pages/api/products.ts`