import os
import requests
from flask import Flask, request, jsonify, session, redirect, url_for
from dotenv import load_dotenv

load_dotenv()

# Initialize the Flask app
app = Flask(__name__)
# Set a secret key for session management
# In a real application, this should be a strong, randomly generated key
app.secret_key = 'your_simple_placeholder_secret_key'

# Disable authentication flag
DISABLE_AUTH = os.getenv('DISABLE_AUTH', 'False').lower() == 'true'

# Hardcoded credentials (for demonstration purposes)
USERNAME = os.getenv('APP_USERNAME', 'guest')
PASSWORD = os.getenv('APP_PASSWORD', 'your_password')

@app.route('/')
def index():
    # Require authentication for the main route
    if not DISABLE_AUTH and not session.get('logged_in'):
        return redirect(url_for('login'))
    # Render the static index.html file
    # Assuming index.html is in a 'static' folder relative to app.py
    return app.send_static_file('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if username == USERNAME and password == PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('index'))
        else:
            error = 'Invalid Credentials. Please try again.'
    # For GET requests or failed POST requests, render the login template
    # Assuming login.html is in a 'templates' folder relative to app.py
    # You would typically pass the 'error' variable to the template here
    # For simplicity, we'll just return a basic message or render logic in a real template
    from flask import render_template
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    # Clear the session and redirect to login
    session.clear()
    return redirect(url_for('login'))

@app.route('/generate_mermaid', methods=['POST'])
def generate_mermaid():
    # Require authentication for the API endpoint
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
    # Ensure the static and templates directories exist (optional, but good practice)
    os.makedirs('static', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    app.run(debug=True) # Set debug=False in production