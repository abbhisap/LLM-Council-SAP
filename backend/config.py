import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

print(f"DEBUG - GROQ KEY LOADED: {os.getenv('GROQ_API_KEY')[:15] if os.getenv('GROQ_API_KEY') else 'NOT FOUND'}")
print(f"DEBUG - GEMINI KEY LOADED: {os.getenv('GEMINI_API_KEY')[:15] if os.getenv('GEMINI_API_KEY') else 'NOT FOUND'}")

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ── Text Council Members ────────────────────────────
COUNCIL_MEMBERS = [
    {
        "model": "llama-3.3-70b-versatile",
        "api_key": GROQ_API_KEY,
        "base_url": "https://api.groq.com/openai/v1",
        "name": "Llama 3.3 70B"
    },
    {
        "model": "llama-3.1-8b-instant",
        "api_key": GROQ_API_KEY,
        "base_url": "https://api.groq.com/openai/v1",
        "name": "Llama 3.1 8B"
    },
    {
        "model": "gemma2-9b-it",
        "api_key": GROQ_API_KEY,
        "base_url": "https://api.groq.com/openai/v1",
        "name": "Gemma 2 9B"
    },
    {
        "model": "mixtral-8x7b-32768",
        "api_key": GROQ_API_KEY,
        "base_url": "https://api.groq.com/openai/v1",
        "name": "Mixtral 8x7B"
    },
    {
        "model": "llama-3.2-11b-vision-preview",
        "api_key": GROQ_API_KEY,
        "base_url": "https://api.groq.com/openai/v1",
        "name": "Llama 3.2 11B"
    }
]

# ── Chairman ─────────────────────────────────────────
CHAIRMAN = {
    "model": "llama-3.3-70b-versatile",
    "api_key": GROQ_API_KEY,
    "base_url": "https://api.groq.com/openai/v1",
    "name": "Llama 3.3 70B Chairman"
}

# ── Vision Model (for images) ─────────────────────
VISION_MODEL = {
    "model": "meta-llama/llama-4-scout-17b-16e-instruct",
    "api_key": GROQ_API_KEY,
    "base_url": "https://api.groq.com/openai/v1",
    "name": "Llama 4 Scout Vision"
}

# ── Audio Model (for voice) ───────────────────────
AUDIO_MODEL = {
    "model": "whisper-large-v3",
    "api_key": GROQ_API_KEY,
    "base_url": "https://api.groq.com/openai/v1",
    "name": "Whisper Large V3"
}

COUNCIL_MODELS = [m["model"] for m in COUNCIL_MEMBERS]
CHAIRMAN_MODEL = CHAIRMAN["model"]

MAX_TOKENS = 1000
TEMPERATURE = 0.7

OPENROUTER_API_KEY = GROQ_API_KEY
OPENROUTER_API_URL = "https://api.groq.com/openai/v1"