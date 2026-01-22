import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from ai.openai_client import stream_chat
from security.validation import validate_message

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {
        "name": "Phantom AI",
        "status": "online",
        "message": "Backend is running"
    }

@app.post("/api/chat")
async def chat(request: Request):
    body = await request.json()
    message = body.get("message", "")

    validate_message(message)

    def generator():
        for chunk in stream_chat(message):
            yield chunk

    return StreamingResponse(generator(), media_type="text/plain")
