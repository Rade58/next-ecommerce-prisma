# CHECKOUT PROCESS, SETTING UP STUFF, SKAFFOLDING PAGES, MAKING REDIRECTS

WE WILL HAVE SHIPPING PAGE

```
touch pages/shipping.tsx
```

WE CREATED BUTTON ON OUR SHOPPING CART THAT NAVIGATES US TO SHIPPING PAGE (WHEN USER PRESSES TO `Go To Checkout` BUTTON)

**IF YOU ARE NOT SIGNIN AND YOU GO TO SHIPPING PAGE, YOU SHOULD BE REDIRETED TO SIGNIN PAGE**

ALSO DEPENDING ON SESSION WE NAVIGATE TO SHIPPING OR TO SIGNING PAGE, WHEN USER PRESSES "GO TO CHECKOUT" BUTTON

WE ARE GOING TO SETUP SOME REDIRECTS (OR BETTER TO CALL THEM: PROGRMMATIC NAVIGATION)

**BUT ALSO WHEN YOU LOG IN YOU SHOUD BE REDDIRECCTED T O SHIPPING**

SO WE NEED TO DEFINE THAT LOGIC

**WE CAN CHECK HISTORY AND DO SOME REDIRECTS BASED ON HISTORY**

**I THINK WE NEED TO USE ANOTHER MACHINE, THAT WILL HANDLE THAT REDIRECTING, OR BETTER TO SAY PROGRAMMATICAL NAVIGATION**

BEFORE MAKING MACHINE WE ALREADY DEFINED THAT NAVIGATION IF THERE IS NO SESSION ON /shipping PAGE

WE WILL START DDEFINING MACHINE THAT IS TIGHT 