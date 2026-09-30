from fastapi import FastAPI

app = FastAPI(title="Backend")

@app.get("/")
def read_root():
    return {"message": "Selamat datang di Backend FastAPI!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "query": q}