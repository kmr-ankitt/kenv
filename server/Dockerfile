FROM python:3.13-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY pyproject.toml .

# Copy the uv binary from the specified image
COPY --from=ghcr.io/astral-sh/uv:0.6.14 /uv /uvx /bin/

# Install the required packages
RUN uv venv && . /app/.venv/bin/activate && uv pip install .

# Copy the project into the image
ADD . .

# Expose the port the app runs on
EXPOSE 8000

# Run the application
CMD [ "/bin/sh", "-c", ". /app/.venv/bin/activate &&  fastapi dev --host 0.0.0.0 --port 8000" ]
