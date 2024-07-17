import os
import glob
from flask import Flask, request, jsonify, send_from_directory
import openai

app = Flask(__name__)


# Serve HTML and static files
@app.route('/')
def index():
    return send_from_directory('', 'index.html')

@app.route('/style.css')
def style():
    return send_from_directory('', 'style.css')

@app.route('/script.js')
def script():
    return send_from_directory('', 'script.js')
#%% Support functions

env_file = glob.glob('*.env')
if env_file:
    with open(env_file[0]) as f:
        for line in f:
            if line.strip() and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                os.environ[key] = value

#%% General setting
#client = openai()

openai.api_key = "your_api_key"

role = "You are an assistant that always answers with rhyme."

messages = []
messages.append({"role": "system", "content": role})

@app.route('/chat', methods=['POST'])
def chat():
    global messages

    try:
        user_input = request.json.get("prompt", "")
        print(f"Received prompt: {user_input}")  # Debug print
    
    # Append user message to inputs
        messages.append({"role": "user", "content": user_input})
    
    # Get model response
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=1.0
        ).choices[0].message.content
    
    # Append model response to messages
        messages.append({"role": "assistant", "content": response})
        print(f"Response: {response}")  # Debug print
    
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error: {e}")  # Debug print
        return jsonify({"response": "Sorry, something went wrong."}), 500
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
