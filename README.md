<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/16T6i_RDsWToDlpEwpdErDDY3aLCRPNlU

🌌 EmotiSpace – AI-Powered Emotional Room Recommender

EmotiSpace is an AI-driven project that designs personalized room layouts based on a user’s emotions, personality, and needs. It combines emotion analysis, design logic, and AI-generated visuals to create spaces that don’t just look good – they feel right.

✨ Features

Insight Report – A short professional analysis of the user’s mood, personality, and space needs.

Emotional Design Story – A sensory-rich narrative that helps the user feel their future space.

AI-Generated Visuals – Beautifully rendered room layouts with professional details: lighting, furniture, textures, and atmosphere.

Adaptive Recommendations – Suggestions for layout, colors, and furniture to boost productivity, relaxation, or creativity.

Interactive UI (Planned) – Users can input their mood/preferences and instantly receive personalized room designs.

🚀 Tech Stack

Frontend: React + TailwindCSS (clean, minimal UI)

Backend: Node.js + Express (handles user data & API requests)

AI & ML: Google AI Studio (Gemini API for personality/insight analysis), Stable Diffusion / Imagen 2 (for visuals)

Database: MongoDB / Firebase (for storing user preferences & reports)

Visualization: AI-generated renders (non-360° for now, 3D/AR integration planned)

🛠️ How It Works

User inputs emotion & preferences (e.g., calm, energetic, creative).

AI generates an Insight Report analyzing needs.

AI creates an Emotional Design Story to describe the space.

AI generates a visual render (image) of the recommended room layout.

User receives a personalized design package combining all three outputs.

📂 Project Structure
EmotiSpace/
│── frontend/        # React UI  
│── backend/         # Node.js + Express server  
│── ai-models/       # Prompt templates for Gemini + Stable Diffusion  
│── assets/          # Generated images & design samples  
│── README.md        # Project documentation  

🧑‍💻 Setup Instructions

Clone the repo:

git clone https://github.com/yourusername/EmotiSpace.git
cd EmotiSpace


Install dependencies:

npm install


Add your API keys (Google AI Studio + Stable Diffusion) in a .env file:

GEMINI_API_KEY=your_key_here
IMAGE_GEN_API_KEY=your_key_here


Run the backend server:

npm run server


Run the frontend:

npm run dev


Open http://localhost:3000 to explore.

📖 Example Output

Insight Report:

You’re seeking focus and calm. A space with muted tones, soft lighting, and minimal distractions will support productivity.

Emotional Design Story:

Soft golden light reflects on warm wooden textures, creating a space where stillness meets creativity. A single green plant adds life without overwhelming the mind.

Visual Render (AI-generated):
(Sample room image would go here)

🎯 Future Roadmap

 Add interactive drag-and-drop design editor

 Implement 3D/AR room previews

 Multi-emotion blending (e.g., calm + creativity)

 Mobile app version

🤝 Contributing

We welcome contributions! Feel free to fork the repo, submit issues, and open PRs.

📜 License

MIT License – Free to use and modify.

🌟 Acknowledgments

Google AI Studio (Gemini API)

Stable Diffusion / Imagen 2

Inspiration from emotional design and interior psychology research

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
