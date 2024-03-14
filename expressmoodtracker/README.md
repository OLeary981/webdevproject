# Moodtracker

Moodtracker is a web application that allows users to log their emotions over time, along with additional notes and triggers, to gain insight into what may be causing them to feel a certain way.

## Features

- **Logging Emotions**: Users can log their emotions with timestamps to track their mood over time.
- **Notes**: Users can add notes to their logged emotions, providing context or additional information.
- **Triggers**: Users can identify triggers associated with their emotions, helping them understand what influences their mood.
- **Insights**: The app provides visualizations and insights based on the logged data, helping users identify patterns and correlations.

## Installation

To run Moodtracker locally, follow these steps:

1. Clone the repository: `git clone https://github.com/OLeary981/webdevproject/moodtracker.git`
2. Navigate to the project directory: `cd moodtracker`
3. Install dependencies: `npm install`
4. Set up environment variables by creating a `.env` file and adding necessary configurations (e.g., database connection).
5. Start the server: `npm start`

## Technologies Used

- **Express**: Web framework for Node.js used to build the backend server.
- **MySQL**: Relational database management system used to store user data.
- **EJS**: Templating engine for generating dynamic HTML content.
- **bcrypt**: Library for hashing passwords securely.
- **Axios**: Promise-based HTTP client for making API requests.
- **Express Validator**: Middleware for validating user input data.
- **Helmet**: Middleware for securing Express apps with various HTTP headers.
- **Morgan**: HTTP request logger middleware.
- **dotenv**: Module for loading environment variables from a `.env` file.
- **nodemon**: Utility for automatically restarting the server during development.


