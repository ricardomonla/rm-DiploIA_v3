#!/bin/bash

# Script to run the Python HTTP server for the web application
# Start the server on port 8000 in the current directory

# Check if port 8000 is already in use
PID=$(lsof -t -i :8000 2>/dev/null)
if [ -n "$PID" ]; then
    echo "Port 8000 is already in use by process $PID."
    read -p "Do you want to kill the existing process and use port 8000? (y/n): " answer
    if [[ $answer =~ ^[Yy]$ ]]; then
        echo "Killing process $PID..."
        kill $PID
        sleep 2
        # Verify the process was killed
        if lsof -t -i :8000 >/dev/null; then
            echo "Could not kill process $PID, falling back to server.py auto-mapping..."
            python3 server.py 8000
            exit 0
        fi
    else
        echo "Letting server.py find an available port..."
        python3 server.py 8000
        exit 0
    fi
fi

echo "Starting Dynamic DiploIA Server logic via server.py..."
python3 server.py 8000