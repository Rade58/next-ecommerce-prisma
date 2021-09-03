# IMAGE UPLOAD WITH MULTER

I'M GOING TO ALTER MY PRODUCT CREATION, ON ADMIN PAGE 

AND I'M GOING TO USE [multer](https://www.npmjs.com/package/multer)

THIS CAN BE HELPFUL TUTORIAL:

<https://betterprogramming.pub/upload-files-to-next-js-with-api-routes-839ce9f28430>

LETS GET STARTED

# INSTALL MULTER


```
yarn add multer
```

```
yarn add @types/multer
```

# WE NEED TO CREATE UPLOAD FOLDER, BUT THAT FOLDER NEEDS TO BE STATIC FOLDER

THAT MEANS **IT NEEDS TO PE PLACED IN `public` FOLDER**

```
mkdir public/uploads && echo "# this is upload folder" >> public/uploads/note.md
```

I ADDED DUMMY FILE JUST SO IF I COMMIT TO GITHUB THAT EMPTY FOLDER IS VISIBLE

# CREATING ROUTE

```
touch pages/api/admin/upload.ts
```

```ts

```

##  LETS TEST THIS BY CREATING SMOME TRYOUT PAGE AND WE WILL ADD INPUT TYPE FILE


# LETS CREATE FRONT END PORTION



