#!/usr/bin/env python3
"""
Script to start the chatbot backend server
"""
import subprocess
import sys
import os

def main():
    # Change to the backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    os.chdir(backend_dir)

    # Start the uvicorn server
    cmd = [sys.executable, '-m', 'uvicorn', 'main:app', '--reload', '--port', '8001']

    print("Starting Chatbot Backend Server on port 8001...")
    print("Visit http://localhost:8001/docs for API documentation")
    print("Press Ctrl+C to stop the server")

    try:
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == "__main__":
    main()