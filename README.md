# WE ARE GOING TO BUILD FORM ON SHIPPING PAGE

FORM IS INTENDED FOR USER TO UPDATE HIS SHIPPMENT DATA, LIKE ADRESS, AND OTHER STUFF

# THIS IS ROUTE FOR UPDATING USERS INFO (SHIPPMENT INFO)

```
touch pages/api/shipping/[profileId].ts
```

## WE ARE GETTING THE PROFILE DATA, BUT JUST SHIPPMENT DATA FROM `getServerSideProps`, AS A INITIAL DATA

WE WANT EVERYTHING FILL INSIDE FORM WHEN USER WANTS TO BUY SOMETHING NEXT TIME

## WHAT WE BUILT

```
cat components/5_shipping_page/ShippingForm.tsx
```

```
cat pages/shipping.tsx
```

## WE ARE, ALSO SETTING SHIPPING DATA TO COOKIE

AND AFTER WE SAVE DATA, BOTH IN DATBASE AND IN THE COOKIE, WE ARE NAVIGATING TO THE /payment

# WE WILL BUILD `/payment` PAGE

```
cat pages/payment.tsx
```

ALSO PROTECT PAYMENT PAGE

## ACROSS DIFFERENT PAGES WE WILL HAVE BREDCRUMS TO DESCRIBE WHERE IS USER IN CHECKOUT STEPS