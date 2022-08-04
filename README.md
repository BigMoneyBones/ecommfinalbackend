
# E-commerce Fullstack Final Project

Welcome to the Fakery!
Our e-commerce website features a variety of unique dessert selections! 


## Features

- User Registration/Login/Logout functionality:
    - User's password is encrypted via salt+hash algorithm.
    - A user ID Token is generated using JsonWebToken.
    - User is able to view all products.
    - User is able to Add/Remove/Order product with cart
    - User is able to view order history.
- Admin Registration/Login/Logout and create/edit/delete functionality:
    - Admin ID Token is generated and verified for access to Admin page
    - Admin is able to Create/Edit/Delete products
    - Admin is able to Create/Edit/Delete orders
- Front-End Client Navigation Bar:
    - Login/Logout (displays logged in status)
    - Registration
    - Products
    - Cart
    - User Account Page
- Products Page: 
    - Displays the list of products (title, image, description and price) to the user.
    - On-click functionality for each product listed to navigate user to a separate page displaying product details.
    - Each individual product page will display all components in product object (ID, title, price, image, description, category).
        - Button to add to cart.
        - Button to add to wishlist.
    - User is able to filter product list by category.
    - User is able to sort products.
- Cart
    - Stores products added to cart.
    - Calculates and displays total. 
    - Button to empty cart.
    - Button to allow user to checkout.
- User Page
    - Displays user's order history.
    - Link to user's wishlist with an option to share wishlist.



## Documentation

- [Front-end repository](https://github.com/jrkidman/ecommfinalfrontend)
- [Back-end repository](https://github.com/BigMoneyBones/ecommfinalbackend)


## Deployment

Project is deployed via Heroku.

- https://ecommfinalbackend.herokuapp.com/
- https://ecommfinalfrontend.herokuapp.com/


## Authors

- [@jrkidman](https://github.com/jrkidman)
- [@BigMoneyBones](https://github.com/BigMoneyBones)
- [@leah167](https://github.com/leah167)

