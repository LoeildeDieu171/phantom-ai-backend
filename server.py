import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai

# ---------- CONFIG ----------
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- MODELS ----------
class ChatRequest(BaseModel):
    message: str

# ---------- ROUTES ----------
@app.get("/api/health")
def health():
    return {
        "name": "Phantom AI",
        "status": "online",
        "message": "Backend is running"
    }

@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Tu es Phantom AI, une IA intelligente, concise et naturelle."
                },
                {
                    "role": "user",
                    "content": req.message
                }
            ],
            temperature=0.8,
            max_tokens=300
        )

        return {
            "response": response.choices[0].message.content
        }

    except Exception as e:
        return {
            "error": "Erreur serveur",
            "details": str(e)
        }
