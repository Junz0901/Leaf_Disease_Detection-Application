# Leaf Disease Detection Backend

This is the FastAPI backend for the Leaf Disease Detection project.

## Quick Start

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Run the Server**:
    ```bash
    uvicorn app.main:app --reload
    ```

3.  **Open API Docs**:
    Go to [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) to test the endpoints.

## Configuration

-   **Database**: Currently configured to use **SQLite** (`leaf_disease.db`) for easy development.
    -   To switch to PostgreSQL, uncomment the line in `.env` and add your credentials.
-   **ML Model**: Currently uses a **mock predictor** (random disease) but performs **real image processing** (resize/normalize).
    -   To use a real model, place your `.h5` file in `app/` and uncomment the loading code in `app/services/ml_service.py`.
-   **LLM**: Currently uses a **mock response**.
    -   To use OpenAI/Gemini, add your `LLM_API_KEY` to `.env` and uncomment the code in `app/services/llm_service.py`.
