
# Optimizely Take-Home Assignment


## Instructions:
This is a Flask-based chatbot application that uses OpenAI's GPT-3.5-turbo model to generate responses in rhyme and grumpily to solve the tasks given by Optimizely.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Python 3.9](https://www.python.org/downloads/release/python-390/) installed on your machine (for local testing).
- [OpenAI API key](https://platform.openai.com/api-keys) for AI assistant integration.
- [Google OAuth Credential](https://console.cloud.google.com/): Ensure you have set up OAuth credentials in the Google Cloud Console. You will need a client ID and client secret to enable Google authentication in the application.

## Getting Started

Follow these instructions to build and run the application inside a Docker container.

### 1. Clone the Repository

Clone this repository to your local machine using the following command:

_git clone https://github.com/your-username/front_end_task.git_

_cd front_end_task_

-cd op_extra_tasks

### 2. Set Up Environment Variables
Create a .env file in the root directory of the project and add your OpenAI API key:

_OPENAI_API_KEY=your_openai_api_key_here_


### 3. Build the Docker Image
Build the Docker image using the provided Dockerfile:

_docker build -t optibot ._


### 4. Run the Docker Container
Run the Docker container using the following command:

_docker run -p 5003:5003 optibot_

This command maps port 5003 of your local machine to port 5003 inside the Docker container.

### 5. Access the Application
Open a web browser and go to:

http://127.0.0.1:5003

You should see the chatbot application interface. You can now interact with the chatbot by entering prompts and receiving responses in rhyme and grumpy upon toggle feature.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (Vanilla JS), Tailwind CSS
- **Backend**: Python (Flask), REST API
- **Database**: LocalStorage (used for storing chat history in the browser)
- **Authentication**: Google OAuth
- **Containerization**: Docker

## Features

- **Google Authentication**: Users can sign up and log in using their Google accounts.
- **Customizable Interface**: Supports light and dark themes with dynamic theme switching.
- **Persistent Chat History**: Stores chat history locally using LocalStorage.
- **Responsive Design**: Ensures optimal user experience across devices.
### Note: 

_Dependencies: The required dependencies are listed in the requirements.txt file. These are automatically installed when building the Docker image._

_Testing Locally: You can run the flask application by the following command:_

_python app.py_

_Python Script: The AI powered assistant Poet main\_poet.py and Grumpy main\_grumpy.py is used for this application. The updated python script is app.py._ 

_Folder: The inistial tasks are done in the folder "op\_initial\_tasks" and the final tasks along with the extra tasks are in the folder "op\_run\_tasks". Follow the above instructions to run the application._
