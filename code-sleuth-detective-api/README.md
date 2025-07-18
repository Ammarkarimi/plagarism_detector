
# Code Plagiarism Detector

A modern web application for detecting code plagiarism using advanced analysis techniques including Abstract Syntax Tree (AST) comparison and hash-based similarity detection.

## Features

- **Dual Analysis Methods**: 
  - Hash similarity using token-based k-gram analysis
  - AST similarity for structural code comparison
- **Multi-Language Support**: Python, JavaScript, Java, C++, C, PHP, Ruby, Go, Rust
- **Modern UI**: Cyberpunk-inspired design with real-time progress tracking
- **Drag & Drop Interface**: Easy file uploads with visual feedback
- **Detailed Results**: Comprehensive breakdown of similarity metrics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** for icons
- **Recharts** for data visualization

### Backend (Required)
- FastAPI (Python web framework)
- AST parsing libraries
- Hash-based similarity algorithms

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+ (for backend)
- Git

### Frontend Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd code-plagiarism-detector
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

### Backend Setup

Create a FastAPI backend with the following structure:

```python
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import ast
import hashlib

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/check-plagiarism")
async def check_plagiarism(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    # Your plagiarism detection logic here
    return {
        "normalized_hash_similarity": 85.5,
        "ast_similarity": 78.3,
        "verdict": "Plagiarized"  # or "Original"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

Run the backend:
```bash
python backend/app.py
```

The backend API will be available at `http://localhost:8000`

## Usage

1. **Upload Files**: Drag and drop or click to upload two code files for comparison
2. **Analyze**: Click the "Analyze Code Similarity" button to start the detection process
3. **View Results**: Review the detailed analysis including:
   - Overall verdict (Plagiarized/Original)
   - Hash similarity percentage
   - AST similarity percentage
   - Detection threshold information

## Detection Thresholds

- **Plagiarism Detected**: Hash similarity > 60% OR AST similarity > 70%
- **Likely Original**: Hash similarity ≤ 60% AND AST similarity ≤ 70%

## Supported File Types

- Python (`.py`)
- JavaScript (`.js`)
- Java (`.java`)
- C++ (`.cpp`)
- C (`.c`)
- PHP (`.php`)
- Ruby (`.rb`)
- Go (`.go`)
- Rust (`.rs`)

## Project Structure

```
src/
├── components/ui/          # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── pages/
│   └── Index.tsx          # Main application component
└── main.tsx               # Application entry point
```

## API Endpoints

### POST `/check-plagiarism`

Analyzes two code files for plagiarism.

**Request:**
- `file1`: First code file (multipart/form-data)
- `file2`: Second code file (multipart/form-data)

**Response:**
```json
{
  "normalized_hash_similarity": 85.5,
  "ast_similarity": 78.3,
  "verdict": "Plagiarized"
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

This project uses:
- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling
- Prettier for code formatting

## Deployment

### Frontend Deployment

Build the application:
```bash
npm run build
```

Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, etc.).

### Backend Deployment

Deploy your FastAPI backend to platforms like:
- Heroku
- AWS Lambda
- Google Cloud Run
- DigitalOcean App Platform

## Environment Variables

Create a `.env` file for any environment-specific configurations:

```env
VITE_API_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure your FastAPI backend includes the CORS middleware:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### File Upload Issues

Ensure your backend accepts multipart/form-data and handles file uploads correctly using FastAPI's `UploadFile` and `File` imports.

## 👨‍💻 Developed By

**Mohammed Ammar Karimi**<br>
💼 [LinkedIn](https://www.linkedin.com/in/mohammed-ammar)<br>
🌐 [Website](https://ammarkarimi.vercel.app/)<br>
📫 [Email](ammarkarimi9898@gmail.com)<br>
