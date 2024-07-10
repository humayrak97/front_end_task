# Use Python runtime as base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy all files from the current directory to the container
COPY . .

# Expose port 5001 (assuming your Flask app runs on this port)
EXPOSE 5001

# Command to run the Flask application
CMD ["python", "app.py"]
