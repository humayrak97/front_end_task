
# Optimizely Take-Home Assignment


## Instructions:
This is a Flask-based chatbot application that uses OpenAI's GPT-3.5-turbo model to generate responses in rhyme to solve the tasks given by Optimizely.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Python 3.9](https://www.python.org/downloads/release/python-390/) installed on your machine (for local testing).

## Getting Started

Follow these instructions to build and run the application inside a Docker container.

### 1. Clone the Repository

Clone this repository to your local machine using the following command:

_git clone https://github.com/your-username/front_end_task.git_

_cd front_end_task_

### 2. Set Up Environment Variables
Create a .env file in the root directory of the project and add your OpenAI API key:

_OPENAI_API_KEY=your_openai_api_key_here_


### 3. Build the Docker Image
Build the Docker image using the provided Dockerfile:

_docker build -t optibot ._


### 4. Run the Docker Container
Run the Docker container using the following command:

_docker run -p 5001:5001 optibot_

This command maps port 5001 of your local machine to port 5001 inside the Docker container.

### 5. Access the Application
Open a web browser and go to:

http://localhost:5001

You should see the chatbot application interface. You can now interact with the chatbot by entering prompts and receiving responses in rhyme.

### Note: 

_Dependencies: The required dependencies are listed in the requirements.txt file. These are automatically installed when building the Docker image._

_Testing Locally: You can run the flask appliction by the following command:_

_python app.py_

_Python Script: The AI powered assistant Poet main\_poet.py is used for this application. The updated python script is app.py._
