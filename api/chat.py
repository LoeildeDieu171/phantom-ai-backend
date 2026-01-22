from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os
import openai

app = FastAPI()

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.get("/")
def health():
    return {"status": "ok", "name": "Phantom AI"}

@app.post("/chat")
async def chat(req: Request):
    data = await req.json()
    message = data.get("message", "").strip()

    if not message:
        return JSONResponse({"error": "Empty message"}, status_code=400)

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Tu es Phantom AI, une IA stylée, claire, utile."},
                {"role": "user", "content": message}
            ],
            temperature=0.8
        )

        return {
            "reply": response.choices[0].message.content
        }

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
