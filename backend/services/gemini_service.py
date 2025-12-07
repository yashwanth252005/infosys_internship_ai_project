# backend/services/gemini_service.py
import os
import json
import google.generativeai as genai
from fastapi import HTTPException

# Load and configure Gemini API key at import time
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if not GEMINI_API_KEY:
    raise EnvironmentError("GEMINI_API_KEY not set in environment (.env)")

genai.configure(api_key=GEMINI_API_KEY)

def _build_prompt(question: str, breed_info: dict = None, diet_info: dict = None, sample_questions: list | None = None) -> str:
    system_msg = (
        "You are a helpful and factual DOG assistant.\n"
        "Your job is to answer questions about dogs, dog breeds, dog diet, dog behaviour, training, health, grooming, etc.\n\n"
    
        "RULES:\n"
        "1. FIRST check if any provided JSON data (BREED_DATA or DIET_DATA) contains the answer.\n"
        "   - If yes → STRICTLY answer ONLY using the JSON data.\n\n"
    
        "2. If the JSON data does NOT contain the answer:\n"
        "   - You MAY use general dog-related knowledge.\n"
        "   - Keep answers short, clear, and easy to understand.\n"
        "   - Do NOT give long paragraphs.\n\n"
    
        "3. If the user asks ANYTHING not related to dogs:\n"
        "   - Do NOT answer the question.\n"
        "   - Politely respond: 'I can only help with dog-related questions.'\n\n"
    
        "4. NEVER hallucinate.\n"
        "5. NEVER invent new facts when JSON data already provides information.\n"
        "6. If the user asks for very specific information that you cannot confirm:\n"
        "   - Respond: 'Information not available in the provided data.'\n\n"
    )

    parts = [system_msg]

    if breed_info:
        # pretty-print small JSON (avoid huge dumps)
        try:
            parts.append("BREED_DATA:\n" + json.dumps(breed_info, ensure_ascii=False, indent=2))
        except Exception:
            parts.append("BREED_DATA:\n" + str(breed_info))

    if diet_info:
        try:
            parts.append("DIET_DATA:\n" + json.dumps(diet_info, ensure_ascii=False, indent=2))
        except Exception:
            parts.append("DIET_DATA:\n" + str(diet_info))

    if sample_questions:
        try:
            # join sample questions into a short list
            parts.append("SUGGESTED_QUESTIONS:\n" + "\n".join(sample_questions[:40]))
        except Exception:
            parts.append("SUGGESTED_QUESTIONS:\n" + str(sample_questions))

    parts.append("\nUSER_QUESTION:\n" + question.strip())

    # final prompt string
    return "\n\n".join(parts)


def _parse_response(resp) -> str:
    """
    Extract plain text from the Gemini response (ALL SDK versions supported).
    """
    try:
        # NEW SDK (2024+)
        if hasattr(resp, "candidates") and resp.candidates:
            cand = resp.candidates[0]

            # Newer: cand.content.parts[i].text
            if hasattr(cand, "content") and cand.content:
                try:
                    parts = cand.content.parts
                    text_blocks = []
                    for p in parts:
                        if hasattr(p, "text") and p.text:
                            text_blocks.append(p.text)
                        elif isinstance(p, dict) and "text" in p:
                            text_blocks.append(p["text"])
                    if text_blocks:
                        return "\n".join(text_blocks).strip()
                except:
                    pass

            # Older (fallback)
            if hasattr(cand, "output") and cand.output:
                return str(cand.output)

        # Older SDK: resp.text
        if hasattr(resp, "text") and resp.text:
            return str(resp.text)

        # Last fallback
        return str(resp)

    except Exception as e:
        raise RuntimeError(f"Failed to parse Gemini response: {e}")


def ask_gemini(
    question: str,
    breed_info: dict = None,
    diet_info: dict = None,
    sample_questions: list | None = None,
    model_name: str = "gemini-2.5-flash",
    max_output_tokens: int = 300
) -> str:

    prompt = _build_prompt(question, breed_info=breed_info, diet_info=diet_info, sample_questions=sample_questions)

    try:
        model = genai.GenerativeModel(model_name)

        resp = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.0,
                "max_output_tokens": max_output_tokens
            }
        )

        answer = _parse_response(resp)
        if not answer.strip():
            return "Information not available in the provided data."

        return answer

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini call failed: {e}")