# Kenv Backend

## Prerequisites

Before building and running the Kenv backend, ensure the following prerequisites are met:

- Python 3.13
- Install `uv` by running the following command:

  ```bash
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```

## Building Instructions

To build and run the Kenv backend, follow these steps:

### Using Docker

1. Build the Docker image:

  ```bash
  docker build -t kenv-backend .
  ```

2. Run the container:

  ```bash
  docker run -p --rm --it 8000:8000 kenv-backend
  ```

The application will be accessible at `http://localhost:8000`.

### Manual Installation

1. Ensure you have Python 3.13 and `pip` installed on your system.

2. Clone the repository and navigate to the project directory:

  ```bash
  git clone https://github.com/kmr-ankitt/kenv.git
  cd kenv/server
  ```

3. Create a virtual environment and activate it:

  ```bash
  uv venv
  source .venv/bin/activate
  ```

4. Install the required dependencies:

  ```bash
  uv pip install .
  ```

5. Run the application:

  ```bash
  fastapi dev
  ```

The application will be accessible at `http://localhost:8000`.
