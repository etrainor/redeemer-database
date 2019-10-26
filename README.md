# Redeemer of Life Database

This application will be used as the database management user interface for the planned Redeemer of Life Ministries website.

Redeemer of Life Ministries is a non-profit religious organization in the Phillipines that funds schools and feeding programs in extremely poor and remote areas on the island of Negros Occidental. They have struggled to find donors to support their operations due to a lack of website and ability to easily edit content.

## The application is currently a work in progress.

## Current Features
- Can ADD, UPDATE, DELETE Churches, Pastors to a PostgreSQL database
- Can ADD and DELETE Meeting Minutes and Prayer Requests
- Can ADD and DELETE updates to an existing Prayer Request
- Can display a single record or a list of records that are currently stored in the database
- Can print a formatted meeting minutes report
- Meeting minutes form dynamically grows based on the size of the database

## Planned Features and Tasks
- Implement OAuth to prevent unauthorized database access
- Add the ability to update the meeting minutes and prayer request details
- Allow the user to dynamically choose which data is published to the (intended) React front end by checking a box or clicking a button.
- Modularize the current code base and DRY up repetitive functions.
- Additional CSS to improve site appearance
- Implement a SCSS compiler and refactor the current CSS into SCSS
- Add the ability to access the Imgur API to allow the user to access album photos to be used for promotional purposes.
- Refactor the CSS for tablet view.
