from fastapi import FastAPI
from pydantic import BaseModel
import os
import openai

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.get("/api/chat")
def test():
    return {"ok": True, "message": "API OK"}

@app.post("/api/chat")
def chat(req: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        return {"error": "OPENAI_API_KEY missing"}

    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")

        res = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Tu es Phantom AI."},
                {"role": "user", "content": req.message}
            ]
        )

        return {
            "reply": res.choices[0].message.content
        }

    except Exception as e:
        return {"error": str(e)}
