from fastapi import FastAPI

app = FastAPI(title="Backend")

@app.get("/")
def read_root():
    return {"message": "Selamat datang di Backend FastAPI!"}