# SEARCH FOR PRODUCTS

WE CAN IMPLEMENT THIS BY USING [THIS FROM MATERIAL UI](https://material-ui.com/components/autocomplete/#autocomplete)

BUT LETS CUSTOMIZE IT A LITTLE BIT

I DECIDED TO TRY OUT [react-select](https://react-select.com/home#getting-started)

## I DEVELOPED THIS FOR FRONTEND

```
cat components/Search.tsx
```

## AND THIS IS API ROUTE FOR GETTING PRODUCT NAMES, AND FOR GETTING SLUGS

```
cat pages/api/products/slugs.ts
```

WE ARE HITTING THIS ROUTE ONLY WHEN HEADER MOUNTS

I THINK RESOULT FROM THIS ROUTE NEEDS TO BE IN LOCAL STORAG OR SOMETHING (I DON'T HAVE TIME FOR THT NOW)

***

**AND I DID RAW SQL QUERY IN UPPER API ROUTE** (BIT I HAD PROBLEMS THERE TO)

I NEEDED TO REFERENCE products TABLE AS `"public"."Product"`

AND I NEEDED TO DO THAT ALSO FOR THE INDEX FIELD, LIKE THIS: `"public"."Product"."productId"`

THIS WAS MY RAW QUERY AT THE END

```ts
const slugs = await prismaClient.$queryRaw<
  { value: string; label: string }[]
>(/* sql */ `
  SELECT "public"."Product"."productId" AS value, name AS label FROM "public"."Product";
`);
```

***
