# Use a base image with Python and Node.js installed
FROM mcr.microsoft.com/vscode/devcontainers/python:3.8

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Set the working directory in the container
WORKDIR /workspaces/ItemNumber-Extractor

# Install Python dependencies
COPY pdf-backend-python/requirements.txt /workspaces/ItemNumber-Extractor/pdf-backend-python/requirements.txt
RUN pip install -r pdf-backend-python/requirements.txt

# Install Node.js dependencies for the React frontend
RUN npm install --prefix pdf-frontend
