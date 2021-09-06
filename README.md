# SEARCH FOR PRODUCTS

WE WILL BE DOING AUTOCOMPLETE

**BUT WE WON'T USE MATERIAL UI SOLUTIION** WHICH WE CAN IMPLEMENT BY USING [THIS FROM MATERIAL UI](https://material-ui.com/components/autocomplete/#autocomplete), OR WE CAN DO IT COMPLETELY BY OURSELF (IF YOU WANT TO TRY ON YOUR OWN, CHECK THIS OUT <https://www.digitalocean.com/community/tutorials/react-react-autocomplete>) ([code sndbox](https://codesandbox.io/s/8lyp733pj0?file=/src/Autocomplete.jsx))

FOR AUTOCOMPLETE COMPONENT WE WILL USE [react-select](https://react-select.com/)

## I DEVELOPED THIS FOR FRONTEND

```
cat components/Search.tsx
```

## THIS IS API ROUTE FOR SEARCHING WE DEVELOPED

```
mkdir pages/api/products/search && touch "pages/api/products/search/[text].ts"
```

AS YOU CAN SEE FROM THE ROUTE, WE ARE `NOT USING FULL TEXT SEARCH`, WE ARE USING FILTERING (WE ARE QUERYING AND USING `contains` METHOD TO FILTER OUT RESULT)

## I TRIED IT AND IT LOOKS THAT IS WORKING

YOU CAN SEARCH FOR PRODUCTS, AND YOU HAVE SUGGESTIONS YOU CAN SELECT, AND WHEN YOU DO YOU ARE NAVIGATED TO THE PAGE OF SINGLE PRODUCT YOU SELECTED
