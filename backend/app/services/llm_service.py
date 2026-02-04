import os
import requests

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("LLM_API_KEY")
        self.provider = "openai" # or "gemini", "huggingface"

    def _call_openai(self, prompt: str):
        """
        Actual implementation for OpenAI
        """
        # Check if key is just a placeholder or empty
        if not self.api_key or "your_llm_api_key" in self.api_key:
             return None

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            data = {
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": prompt}]
            }
            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data)
            response.raise_for_status() # Raise error for bad responses
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Error calling LLM provider: {e}")
            return None

    def get_disease_info(self, disease_name: str):
        prompt = f"Provide a brief 2-sentence explanation and 1 treatment for the plant disease: {disease_name}"
        
        # Try real call
        real_response = self._call_openai(prompt)
        if real_response:
            return real_response
            
        # Fallback Mock Response
        return f"The disease '{disease_name}' typically manifests as lesions on leaves. Treatment often implies using copper-based fungicides and ensuring proper spacing between plants to reduce humidity."

    def chat(self, message: str):
        # Try real call
        real_response = self._call_openai(message)
        if real_response:
            return real_response

        return f"I am a Leaf Disease AI Assistant. You asked: '{message}'. To get real answers, please add your API Key to the .env file."

llm_service = LLMService()
