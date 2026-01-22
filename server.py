from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
import openai
import os
import time
import json

# ==============================
# CONFIG
# ==============================

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY missing")

openai.api_key = OPENAI_API_KEY

app = FastAPI()

# ==============================
# CORS (frontend web / mobile)
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# UTIL
# ==============================

def stream_text(text: str, delay: float = 0.02):
    for char in text:
        yield char
        time.sleep(delay)

# ==============================
# ROUTES
# ==============================

@app.get("/")
def home():
    return {
        "name": "Phantom AI",
        "status": "online",
        "message": "Backend is running"
    }

@app.post("/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        user_message = data.get("message", "").strip()

        if not user_message:
            return JSONResponse(
                status_code=400,
                content={"error": "Message vide"}
            )

        # ==============================
        # OPENAI REQUEST
        # ==============================

        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Tu es Phantom AI, une vraie IA intelligente, "
                        "naturelle, variée, jamais répétitive, "
                        "tu réponds comme ChatGPT."
                    )
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            temperature=0.9,
            max_tokens=500
        )

        ai_text = completion.choices[0].message.content

        return StreamingResponse(
            stream_text(ai_text),
            media_type="text/plain"
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Erreur serveur",
                "details": str(e)
            }
        )
