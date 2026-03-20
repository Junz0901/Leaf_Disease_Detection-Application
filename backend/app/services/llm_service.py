import os
import requests

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("LLM_API_KEY")
        self.provider = "openai" # or "gemini", "huggingface"

    def _call_gemini(self, prompt: str):
        """
        Implementation for Gemini 1.5 Flash Text Generation
        """
        if not self.api_key or "your_llm_api_key" in self.api_key:
             return None

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.api_key}"
            headers = {"Content-Type": "application/json"}
            data = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.7}
            }
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            
            # Parse Gemini's standard response
            response_data = response.json()
            return response_data['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            print(f"Error calling Gemini provider: {e}")
            return None

    def get_disease_info(self, disease_name: str):
        prompt = f"Provide a brief 2-sentence explanation and 1 treatment for the plant disease: {disease_name}"
        
        # Try real call
        real_response = self._call_gemini(prompt)
        if real_response:
            return real_response
            
        # Fallback Mock Response
        return f"The disease '{disease_name}' typically manifests as lesions on leaves. Treatment often implies using copper-based fungicides and ensuring proper spacing between plants to reduce humidity."

    def chat(self, message: str):
        # Try real call
        real_response = self._call_gemini(message)
        if real_response:
            return real_response

        return f"I am a Leaf Disease AI Assistant. You asked: '{message}'. To get real answers, please add your API Key to the .env file."

llm_service = LLMService()
