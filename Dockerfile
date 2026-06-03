FROM python:3.11-slim

WORKDIR /app

# Install basic system requirements
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files (including the model)
COPY main.py .
COPY RiceLeaf_MobileNetV2.keras .

# Hugging Face Spaces runs on port 7860 by default, but we default to environment PORT
ENV PORT=7860
EXPOSE 7860

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
