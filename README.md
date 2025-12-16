# Asynchronous Video Processing System

A full-stack application demonstrating **asynchronous processing patterns** for long-running video encoding tasks. Built for a hackathon to showcase proper task lifecycle management, failure handling, and state persistence.

## 🎯 Key Design Principles

- **Non-blocking Architecture**: API requests return immediately; processing happens asynchronously
- **Explicit Task States**: QUEUED → PROCESSING → COMPLETED/FAILED with database persistence
- **Failure Resilience**: Multi-layer error handling with graceful degradation
- **State Durability**: All task state survives page refreshes and server restarts
- **Independent Tasks**: Each output variant is a separate, isolated task

## 📋 Features

- 📹 Upload videos (MP4, MOV, WebM) up to 200MB
- 🎬 Generate multiple variants per video (resolution + format combinations)
- 📊 Real-time task progress monitoring (3-second polling)
- ⚡ Asynchronous background processing
- 💾 Persistent state in PostgreSQL (Supabase)
- ⬇️ Download completed outputs
- ❌ Clear error reporting with context

## 🏗️ Architecture Overview

```
React Frontend (Polling) ←→ Express API ←→ PostgreSQL (Supabase)
                                  ↓
                          Worker Process (setImmediate)
                                  ↓
                              FFmpeg
```

**Separation of Concerns**:
- **Frontend**: Pure presentation layer, polls backend for state
- **API Layer**: Request validation, immediate responses
- **Service Layer**: Business logic, database operations  
- **Worker Process**: Asynchronous video encoding (non-blocking)
- **Database**: Single source of truth for task state

**Key Insight**: Upload and processing are **separate operations**. Upload is fast (file I/O), processing is slow (CPU-bound). Each variant becomes an independent task.

## 🛠️ Tech Stack

### Backend (Node.js)
- **Express**: REST API framework
- **Supabase**: PostgreSQL database with real-time features
- **FFmpeg**: Video encoding engine
- **Multer**: Multipart file upload handling
- **In-memory queue**: Simplified async processing (no Redis for hackathon simplicity)

### Frontend (React)
- **React 18**: UI framework
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client
- **Custom polling hook**: Time-aware state updates (3-second interval)

### Video Processing
- **H.264 + AAC**: MP4/MOV output (V1 variant)
- **VP9 + Opus**: WebM output (V2 variant)
- **Bitrate profiles**: 480p (~1Mbps), 720p (~2.5Mbps), 1080p (~5Mbps)

## Prerequisites

- Node.js 18+ and npm
- FFmpeg installed on your system
- Supabase account and project

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Configure your `.env` file with:
   - Supabase URL and API key
   - Port configuration
   - Upload directory paths

4. Initialize database:
```bash
# Run the SQL migration in your Supabase SQL editor
# See migrations/init.sql
```

5. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Configure your `.env` file with the backend API URL

4. Start the development server:
```bash
npm run dev
```

## 🚀 Usage

1. **Open** http://localhost:5173 in your browser
2. **Upload** a video file (MP4, MOV, or WebM, max 200MB)
3. **Select** the uploaded video from the list
4. **Create tasks** by choosing resolution (480p/720p/1080p) and format (MP4/WebM)
5. **Watch** task status change: QUEUED → PROCESSING → COMPLETED
6. **Download** completed videos using the download button

### Task Lifecycle Example

```
POST /api/videos/upload        → Returns video metadata immediately
POST /api/tasks                → Creates task (status: QUEUED), returns immediately
                               → Worker picks up task asynchronously
                               → Status changes to PROCESSING
                               → FFmpeg encodes video (10s - 2min)
                               → Status changes to COMPLETED or FAILED
GET /api/tasks (polling)       → Frontend updates UI automatically
```

## 🎯 Design Highlights

### Asynchronous Processing
- API endpoints **never block** on video processing
- Tasks are processed by a **background worker**
- Uses `setImmediate()` for non-blocking execution
- Multiple tasks can be queued instantly

### State Management
- Task state stored in **PostgreSQL** (durable, ACID)
- Frontend polls every **3 seconds** (no WebSockets needed)
- Page refresh **doesn't lose progress**
- Tasks survive server restarts

### Failure Handling
- **4-layer error handling**: API → Worker → Status Update → Queue
- Failed tasks marked explicitly with error message
- One task failure **doesn't affect others**
- Server stays stable even with FFmpeg crashes

### Data Model
```sql
videos: id, original_name, filename, file_path, uploaded_at
tasks:  id, video_id (FK), resolution, format, status, 
        output_filename, error_message, created_at, completed_at
```

## 📊 API Endpoints

### Videos
- `POST /api/videos/upload` - Upload video (returns immediately)
- `GET /api/videos` - List all videos
- `GET /api/videos/:id` - Get video details
- `GET /api/videos/download/:filename` - Download processed video
- `DELETE /api/videos/:id` - Delete video and all tasks

### Tasks
- `POST /api/tasks` - Create processing task (returns immediately)
- `GET /api/tasks?videoId=<id>` - List tasks for video
- `GET /api/tasks/:id` - Get task status
- `DELETE /api/tasks/:id` - Delete task

## Project Structure

- `backend/` - Express API server
  - `config/` - Configuration files
  - `routes/` - API route definitions
  - `controllers/` - Request handlers
  - `services/` - Business logic
  - `workers/` - Background job processors
  - `middlewares/` - Express middlewares
  - `uploads/` - Uploaded and processed videos
  - `migrations/` - Database migrations

- `frontend/` - React application
  - `src/components/` - React components
  - `src/pages/` - Page components
  - `src/api/` - API client
  - `src/hooks/` - Custom React hooks

- `test-data/` - Sample videos for testing
- `demo/` - Demo materials and screenshots

## API Endpoints

### Videos
- `POST /api/videos/upload` - Upload a video
- `GET /api/videos` - List all videos
- `GET /api/videos/:id` - Get video details
- `DELETE /api/videos/:id` - Delete a video

### Tasks
- `POST /api/tasks` - Create processing task
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get task status
- `DELETE /api/tasks/:id` - Delete a task

## 📖 Documentation

- **[DESIGN_NOTES.md](DESIGN_NOTES.md)** - Comprehensive system design documentation
  - Architecture decisions and rationale
  - Failure handling strategies
  - Scalability considerations
  - Trade-offs and limitations
  - Future improvements

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Asynchronous processing patterns (non-blocking APIs)
- ✅ Task lifecycle management (state machines)
- ✅ Failure resilience (multi-layer error handling)
- ✅ State persistence (database-driven UI)
- ✅ Real-time updates (polling strategy)
- ✅ Clean architecture (separation of concerns)

## 🚧 Known Limitations

1. **Single Server**: No horizontal scaling (could use Redis + worker pool)
2. **Sequential Processing**: One task at a time (could parallelize)
3. **No Job Persistence**: Tasks in memory (lost on restart if QUEUED)
4. **Local Storage**: Videos on disk (should use S3/GCS for production)
5. **Polling**: HTTP polling instead of WebSockets (acceptable trade-off)

See [DESIGN_NOTES.md](DESIGN_NOTES.md) for detailed analysis.

## 🔮 Future Enhancements

- Redis/Bull queue for distributed processing
- Parallel worker processes
- Object storage (S3) integration
- Progress bars (granular FFmpeg progress)
- Task retry with exponential backoff
- Admin dashboard with metrics
- User authentication and quotas

## 📝 License

MIT

---

**Built for**: Hackathon - Asynchronous Video Processing Challenge
**Focus**: System design, async patterns, failure handling, explainability
