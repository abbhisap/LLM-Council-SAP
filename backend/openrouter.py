"""Universal API client supporting Groq and Gemini."""
import httpx
from typing import List, Dict, Any, Optional
from .config import (
    GROQ_API_KEY,
    GEMINI_API_KEY,
    COUNCIL_MEMBERS,
    CHAIRMAN,
    OPENROUTER_API_KEY,
    OPENROUTER_API_URL
)

def get_model_config(model: str) -> Dict[str, str]:
    """Get API config for a given model name."""
    for member in COUNCIL_MEMBERS:
        if member["model"] == model:
            return {
                "api_key": member["api_key"],
                "base_url": member["base_url"].rstrip("/")
            }
    if CHAIRMAN["model"] == model:
        return {
            "api_key": CHAIRMAN["api_key"],
            "base_url": CHAIRMAN["base_url"].rstrip("/")
        }
    return {
        "api_key": OPENROUTER_API_KEY,
        "base_url": OPENROUTER_API_URL.rstrip("/")
    }


async def query_model(
    model: str,
    messages: List[Dict[str, str]],
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    """Query a single model via Groq or Gemini API."""

    config = get_model_config(model)
    url = f"{config['base_url']}/chat/completions"

    headers = {
        "Authorization": f"Bearer {config['api_key']}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": messages,
    }

    print(f"Querying model: {model} at {url}")

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                url,
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            data = response.json()
            message = data['choices'][0]['message']
            return {
                'content': message.get('content'),
                'reasoning_details': message.get('reasoning_details')
            }
    except Exception as e:
        print(f"Error querying model {model}: {e}")
        return None


async def query_models_parallel(
    models: List[str],
    messages: List[Dict[str, str]]
) -> Dict[str, Optional[Dict[str, Any]]]:
    """Query multiple models in parallel."""
    import asyncio

    tasks = [query_model(model, messages) for model in models]
    responses = await asyncio.gather(*tasks)

    return {
        model: response
        for model, response in zip(models, responses)
    }
