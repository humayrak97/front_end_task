import os
import glob
from flask import Flask, request, jsonify, send_from_directory, redirect, url_for, session, render_template
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import secrets
import openai
import requests

# Initialize Flask app
app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# OAuth 2.0 Client ID and Client Secret (replace with your values)
CLIENT_ID = "Your_Client_ID"
CLIENT_SECRET = "Your_Client_Secret"


#Serve index.html if user is authenticated, otherwise redirect to login page
@app.route('/')
def index():
    if 'user' in session:
        return send_from_directory('', 'index.html')
    return redirect(url_for('login'))
    
# Serve CSS file
@app.route('/style.css')
def style():
    return send_from_directory('', 'style.css')

# Serve JavaScript file
@app.route('/script.js')
def script():
    return send_from_directory('', 'script.js')

# Serve login.html
@app.route('/login')
def login():
    return send_from_directory('', 'login.html')

# Handle logout by clearing session
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"message": "Logged out successfully"}), 200

# Google OAuth callback endpoint
@app.route('/oauth2callback')
def oauth2callback():
    code = request.args.get('code')
    token_url = 'https://oauth2.googleapis.com/token'
    token_data = {
        'code': code,
        'client_id': 'Your_Client_ID',
        'client_secret': 'Your_Client_Secret',
        'redirect_uri': 'http://127.0.0.1:5003/oauth2callback',
        'grant_type': 'authorization_code'
    }
     # Exchange authorization code for access token
    token_response = requests.post(token_url, data=token_data)
    token_json = token_response.json()

    if 'id_token' in token_json:
        # Verify and store user information in session
        idinfo = id_token.verify_oauth2_token(token_json['id_token'], google_requests.Request(), CLIENT_ID)
        session['user'] = idinfo
        # Redirect to index page after successful authentication
        return redirect(url_for('index'))
    else:
        return jsonify({"error": "Failed to authenticate"}), 400


# Load environment variables from .env file (if exists)

env_file = glob.glob('*.env')
if env_file:
    with open(env_file[0]) as f:
        for line in f:
            if line.strip() and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                os.environ[key] = value


# Initialize OpenAI API key (replace with your OpenAI API key)
openai.api_key = "YOUR_OPENAI_API_KEY"

# Assistant configurations
assistants = {
    "poet": {
        "role": "You are an assistant that always answers with rhyme.",
        "messages": [{"role": "system", "content": "You are an assistant that always answers with rhyme."}]
    },
    "grumpy": {
        "role": "You clearly understand that you are a chatbot and people use you to ask \
stupid and irrelevant questions. You need to reply to all user prompts in \
        very grumpy and irretated manner. Newer reply directly to user message \
            clearly from the first time. Only if they persist answer to their question \
                but in very rood and grumpy manner.",
        "messages": [{"role": "system", "content": "You clearly understand that you are a chatbot and people use you to ask \
stupid and irrelevant questions. You need to reply to all user prompts in \
        very grumpy and irretated manner. Newer reply directly to user message \
            clearly from the first time. Only if they persist answer to their question \
                but in very rood and grumpy manner."}]
    }
}

current_assistant = "poet"  # Initial assistant to use

# Handle user interaction with OpenAI chatbot
@app.route('/chat', methods=['POST'])
def chat():
    global current_assistant

    try:
        user_input = request.json.get("prompt", "")
        print(f"Received prompt: {user_input}")  # Debug print
    
     # Append user message to assistant's message history
        assistants[current_assistant]["messages"].append({"role": "user", "content": user_input})
    
    # Get response from OpenAI chatbot
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=assistants[current_assistant]["messages"],
            temperature=1.0
        ).choices[0].message.content
    
    # Append chatbot response to assistant's message history
        assistants[current_assistant]["messages"].append({"role": "assistant", "content": response})
        print(f"Response: {response}")  # Debug print
    
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error: {e}")  # Debug print
        return jsonify({"response": "Sorry, something went wrong."}), 500
    
# Toggle route to switch between different assistants
@app.route('/toggle-assistant/<assistant_name>', methods=['GET'])
def toggle_assistant(assistant_name):
    global current_assistant

    if assistant_name in assistants:
        current_assistant = assistant_name
        return jsonify({"message": f"Switched to {assistant_name} assistant."})
    else:
        return jsonify({"error": f"Assistant '{assistant_name}' not found."}), 404


if __name__ == '__main__':
     #Run Flask app on host 0.0.0.0 and port 5003
    app.run(host='0.0.0.0', port=5003)
