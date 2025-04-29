# Simple Local Mermaid Flowchart Generator

This application is a web interface that allows users to generate and iteratively refine Mermaid flowcharts using natural language input processed by a local Ollama instance. It provides a chat-based interface for interaction and a preview window for the generated flowchart.

## Technical Stack

This project utilizes the following technical components:

*   **Backend:** Developed with Flask (Python), serving as the API server for generating Mermaid code (`/generate_mermaid`) and hosting the static frontend files.
*   **Frontend:** Built using React with TypeScript, bootstrapped with Create React App. It incorporates the `assistant-ui` library for the chat interface and a Mermaid renderer for flowchart visualization.
*   **Containerization:** Leverages Docker and Docker Compose to containerize the application and its dependencies, including the local Ollama instance.
*   **AI Model Interaction:** The Flask backend communicates with a local Ollama instance to process natural language input and generate the corresponding Mermaid flowchart syntax.

## Intended Functionality Flow

The intended final functionality of the application follows this flow:

1.  User accesses the application (authentication may be required or bypassed via environment variable).
2.  A chat session is initialized, potentially with an initial welcome or instruction message.
3.  The user inputs a description in natural language (intended to be primarily in Norwegian) of the desired flowchart.
4.  The application sends a structured request to the backend API. This request includes the user's prompt and potentially the existing current session's Mermaid code for iterative refinement.
5.  The backend processes the request, communicating with a configured Ollama server and a language model suited for generating Mermaid syntax.
6.  The backend returns a structured response to the frontend, which includes the generated or updated 'mermaid-code' and possibly a 'message' component.
7.  The frontend updates the chat interface and the Mermaid code preview component with the received content.
8.  The user can view the generated flowchart in the preview window, with the ability to zoom and pan for evaluation.
9.  The user can provide further instructions in the chat to modify or adjust the flowchart, repeating steps 3-8.
10. When satisfied with the result, the user can choose to download the flowchart as an SVG or PNG image.

## Prerequisites

To run this application, you need the following installed and running on your system:

*   **Docker:** Used to build and run the application container.
*   **Ollama:** A running instance of Ollama with a suitable model (e.g., `llama2`, `mistral`) pulled and available. The application will attempt to connect to Ollama on `host.docker.internal`.

## Environment Variables

*   **DISABLE_AUTH**: Set to `True` to bypass authentication checks in the Flask backend (useful for testing and development). Example:
    ```dotenv
    DISABLE_AUTH=True
    ```

## Building and Running with Docker Compose

Docker Compose simplifies the process of building and running the application. Navigate to the root directory of the project in your terminal (where the `docker-compose.yml` file is located).

1.  **Build the React frontend:**
    Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
    Run the build command:
    ```bash
    npm run build
    ```
    This creates the static files in `frontend/build`.

2.  **Build and run the Docker containers:**
    Navigate back to the project root directory:
    ```bash
    cd ..
    ```
    Run the Docker Compose command:
    ```bash
    docker compose up --build
    ```

## Accessing the Application

After running the Docker containers, open your web browser and navigate to:

```
http://localhost:5000
```

The chat-based flowchart generator interface should now be accessible.