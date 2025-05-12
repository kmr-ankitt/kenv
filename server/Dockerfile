FROM python:3.13-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY pyproject.toml .

# Copy the uv binary from the specified image
COPY --from=ghcr.io/astral-sh/uv:0.6.14 /uv /uvx /bin/

# Copy the project into the image
ADD . .


# Install the required packages
# Create a virtual environment using uv
RUN uv venv 

# Update the PATH environment variable to include the virtual environment
ENV PATH="/app/.venv/bin:$PATH"

# Install the project in editable mode
RUN uv pip install -e .

# Expose the port the app runs on
EXPOSE 8000


# Run the application
CMD ["sh", "-c", "exec fastapi dev --host 0.0.0.0 --port 8000"]
