from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # Add this import
import ast
import difflib
import hashlib
import uvicorn

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... rest of your existing code stays the same


# === Utility Functions ===
def normalize_code(code_str):
    """Removes comments, normalizes formatting."""
    lines = code_str.split('\n')
    normalized = []
    for line in lines:
        stripped = line.strip()
        if stripped and not stripped.startswith("#"):
            normalized.append(stripped)
    return '\n'.join(normalized)

def get_ast_structure(code_str):
    try:
        tree = ast.parse(code_str)
        return ast.dump(tree)
    except Exception as e:
        return f"Error parsing AST: {e}"

def rolling_hash(s, base=257, mod=10**9 + 7):
    """Compute hash of a string."""
    h = 0
    for c in s:
        h = (h * base + ord(c)) % mod
    return h

def get_code_hashes(code_str, k=5):
    """Return a list of rolling hashes of k-grams."""
    tokens = code_str.split()
    if len(tokens) < k:
        return []
    hashes = []
    for i in range(len(tokens) - k + 1):
        k_gram = ' '.join(tokens[i:i + k])
        h = rolling_hash(k_gram)
        hashes.append(h)
    return hashes

def compute_similarity_score(hashes1, hashes2):
    set1 = set(hashes1)
    set2 = set(hashes2)
    intersection = set1 & set2
    union = set1 | set2
    if not union:
        return 0.0
    return round((len(intersection) / len(union)) * 100, 2)

def ast_similarity(ast1, ast2):
    matcher = difflib.SequenceMatcher(None, ast1, ast2)
    return round(matcher.ratio() * 100, 2)

# === API Endpoint ===
@app.post("/check-plagiarism")
async def check_plagiarism(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    try:
        code1 = (await file1.read()).decode("utf-8")
        code2 = (await file2.read()).decode("utf-8")

        norm1 = normalize_code(code1)
        norm2 = normalize_code(code2)

        hashes1 = get_code_hashes(norm1)
        hashes2 = get_code_hashes(norm2)
        hash_similarity = compute_similarity_score(hashes1, hashes2)

        ast1 = get_ast_structure(code1)
        ast2 = get_ast_structure(code2)
        ast_sim = ast_similarity(ast1, ast2)

        return {
            "normalized_hash_similarity": hash_similarity,
            "ast_similarity": ast_sim,
            "verdict": "Plagiarized" if hash_similarity > 60 or ast_sim > 70 else "Likely Original"
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# To run this server:
# uvicorn code_plagiarism_api:app --reload
