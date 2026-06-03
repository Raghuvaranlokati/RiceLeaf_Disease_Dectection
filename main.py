from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import numpy as np
from PIL import Image
import io
import os

# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf

app = FastAPI(title="Rice Leaf Disease Detection API")

# Add CORS middleware to allow Next.js frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "RiceLeaf_MobileNetV2.keras")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Define Classes matching the dataset
CLASS_NAMES = ["Bacterial Leaf Blight", "Brown Spot", "Leaf Smut"]

@app.get("/")
def read_root():
    return {"message": "Welcome to Rice Leaf Disease Detection API"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded on server.")

    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    try:
        # Read image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        # Convert to RGB if it has alpha channel
        if image.mode != "RGB":
            image = image.convert("RGB")

        # Resize image to match model's expected input shape (224x224 for MobileNetV2)
        image = image.resize((224, 224))
        
        # Convert image to numpy array
        img_array = np.array(image)
        
        # Normalize pixel values
        img_array = img_array / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)

        # Run prediction
        predictions = model.predict(img_array)
        confidence_scores = predictions[0]
        
        # Get the predicted class index
        predicted_class_idx = np.argmax(confidence_scores)
        predicted_class = CLASS_NAMES[predicted_class_idx]
        confidence = float(confidence_scores[predicted_class_idx]) * 100

        # Full predictions mapping
        breakdown = {CLASS_NAMES[i]: round(float(confidence_scores[i]) * 100, 2) for i in range(len(CLASS_NAMES))}

        return JSONResponse({
            "disease": predicted_class,
            "confidence": round(confidence, 2),
            "breakdown": breakdown
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
