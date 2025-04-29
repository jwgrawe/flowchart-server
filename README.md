# Simple Local Mermaid Flowchart Generator

This application is a simple web interface that allows users to generate Mermaid flowcharts using a local Ollama instance. It provides a basic login and a text area to input natural language descriptions which are then converted into Mermaid syntax by the Ollama model.

## Prerequisites

To run this application, you need the following installed and running on your system:

*   **Docker:** Used to build and run the application container.
*   **Ollama:** A running instance of Ollama with a suitable model (e.g., `llama2`, `mistral`) pulled and available. The application will attempt to connect to Ollama on `host.docker.internal`.

## Setting Credentials

The application now uses a `.env` file to manage credentials for the default `guest` user.

1.  Edit the `.env` file in the project root directory.
2.  Set the `APP_USERNAME` and `APP_PASSWORD` variables to your desired username and password.
    ```dotenv
    APP_USERNAME=your_username
    APP_PASSWORD=your_password
    ```
3.  If the `.env` file is not present or these variables are not set, the application will default to `APP_USERNAME=guest` and `APP_PASSWORD=your_password`.

## Environment Variables

* **DISABLE_AUTH**: Set to `True` to bypass authentication checks (useful for testing). Example:
  ```dotenv
  DISABLE_AUTH=True
  ```

## Building and Running with Docker Compose

Docker Compose simplifies the process of building and running the application. Navigate to the root directory of the project in your terminal (where the `docker-compose.yml` file is located).

Run the following command:

```bash
docker compose up --build
```

This command will:
1. Build the Docker image for the application if it hasn't been built yet or if you've made changes to the `Dockerfile` or application code.
2. Start the application service defined in `docker-compose.yml`.

## Accessing the Application

After running the Docker container, open your web browser and navigate to:

```
http://localhost:5000
```

You will be presented with a login page.

*   **Username:** The value of `APP_USERNAME` from your `.env` file (defaults to `guest`).
*   **Password:** The value of `APP_PASSWORD` from your `.env` file (defaults to `your_password`).

Log in to access the flowchart generator interface.