from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from transformers import pipeline
from pydantic import BaseModel, HttpUrl
import requests
from PIL import Image
from io import BytesIO
from mistralai import Mistral
import os
from dotenv import load_dotenv
import uuid
import torch
import logging
from gtts import gTTS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()
mistral_client = Mistral(api_key=os.getenv('MISTRAL_API_KEY'))
MODEL = "mistral-large-latest"

image_pipe = None

def initialize_models():
    global image_pipe
    try:
        image_pipe = pipeline(
            "image-to-text",
            model="Salesforce/blip-image-captioning-base",
            device="cuda" if torch.cuda.is_available() else "cpu"
        )
        return True
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")
        return False

if not initialize_models():
    logger.error("Failed to initialize models")

class ImageInput(BaseModel):
    image_url: HttpUrl

async def get_mistral_analysis(caption: str) -> str:
    try:
        response = mistral_client.chat.complete(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI assistant that provides insightful analysis of images based on their captions."
                },
                {
                    "role": "user",
                    "content": f"Analyze this image and write a story on the basis of the analysis: {caption}"
                }
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Mistral API error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Mistral API error: {str(e)}")

def generate_audio(text: str) -> str:
    try:
        os.makedirs("audio_outputs", exist_ok=True)
        
        filename = f"audio_outputs/analysis_{uuid.uuid4()}.mp3"
        
        tts = gTTS(text=text, lang='en')
        tts.save(filename)
        
        return filename
    except Exception as e:
        logger.error(f"Text-to-speech error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Text-to-speech error: {str(e)}")

@app.post("/analyze-image")
async def analyze_image(input_data: ImageInput):
    if image_pipe is None:
        if not initialize_models():
            raise HTTPException(
                status_code=500,
                detail="Image captioning model not loaded. Please ensure you have the required dependencies installed and enough memory."
            )
    
    try:
        logger.info(f"Fetching image from URL: {input_data.image_url}")
        response = requests.get(str(input_data.image_url))
        response.raise_for_status()
        image = Image.open(BytesIO(response.content))
        
        logger.info("Generating image caption...")
        caption_result = image_pipe(image)
        caption = caption_result[0]['generated_text'] if isinstance(caption_result, list) else caption_result
        logger.info(f"Generated caption: {caption}")
        
        logger.info("Generating Mistral analysis...")
        analysis = await get_mistral_analysis(caption)
        logger.info("Analysis generated successfully")
        
        logger.info("Generating audio file...")
        audio_file = generate_audio(analysis)
        logger.info(f"Audio file generated: {audio_file}")
        
        return {
            "caption": caption,
            "analysis": analysis,
            "audio_file": audio_file,
            "success": True
        }
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error fetching image: {str(e)}")
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Image analysis failed: {str(e)}"
        )

@app.get("/audio/{filename}")
async def get_audio(filename: str):
    file_path = f"audio_outputs/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(file_path, media_type="audio/mpeg")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)