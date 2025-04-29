import os
import requests
from flask import Flask, request, jsonify, session, redirect, url_for
from dotenv import load_dotenv

load_dotenv()

# Initialize the Flask app, serving static files from the React build directory
app = Flask(__name__, static_folder='frontend/build', static_url_path='/')

# Disable authentication flag
DISABLE_AUTH = os.getenv('DISABLE_AUTH', 'False').lower() == 'true'

@app.route('/')
def index():
    # Serve the index.html file from the React build output
    return app.send_static_file('index.html')

@app.route('/generate_mermaid', methods=['POST'])
def generate_mermaid():
    # Authentication check based on DISABLE_AUTH flag
    if not DISABLE_AUTH and not session.get('logged_in'):
        return jsonify({"error": "Unauthorized"}), 401

    try:
        data = request.get_json()
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400

        # Construct the payload for the Ollama API request
        ollama_payload = {
            "model": "llama3", # Or your preferred model
            "prompt": prompt,
            "system": "You are a helpful assistant that generates raw Mermaid code based on user prompts. Only return the raw Mermaid code, nothing else.",
            "stream": False
        }

        # Send the POST request to the Ollama API
        ollama_url = "http://host.docker.internal:11434/api/generate"
        response = requests.post(ollama_url, json=ollama_payload)
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)

        ollama_response = response.json()
        generated_text = ollama_response.get('response', '').strip()

        # Return the generated Mermaid code
        return jsonify({"mermaid_code": generated_text})

    except requests.exceptions.RequestException as e:
        # Handle connection errors or other request issues
        return jsonify({"error": f"Failed to connect to Ollama API: {e}"}), 500
    except Exception as e:
        # Handle other potential errors
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500

# Standard Flask run block
if __name__ == '__main__':
    # The static directory is now frontend/build, no need to create 'static' or 'templates'
    app.run(debug=True) # Set debug=False in production