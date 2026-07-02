# SentiAware: Multimodal Social Media Moderation Platform

## 🚀 Live Demo

Try the live version of the project here:

👉 [SentiAware Live Application](https://senti-aware-social-media-app.vercel.app/)

## Overview

SentiAware is a full-stack, AI-powered social media platform designed to detect, analyze, and moderate user-generated content in real time. The system combines modern web technologies with advanced machine learning models to ensure a safe and positive online environment.

It supports both **text and image-based content moderation**, using sentiment analysis, toxicity detection, and multimodal AI pipelines to automatically identify harmful content and transform it into safe, neutral expressions when possible.

---

## Key Features

- Social media platform with posts, comments, likes, and user feeds  
- AI-powered text moderation using transformer-based NLP models  
- Toxic content detection and automatic neutral rewriting of offensive text  
- Image moderation using OCR and vision-based analysis for detecting harmful content  
- Automatic blurring of inappropriate images with user notifications  
- Real-time moderation pipeline for posts and comments  
- User reporting and moderation logging system  
- Clean and responsive UI for seamless user experience  

---

## AI & ML Components
 
- **Text Toxic Detection/Rewriting Model**: Sequence-to-sequence model ( Flan T5 ) to convert toxic text into neutral form  
- **Image Moderation**: OCR + vision-based ( Efficent Net B3 ) classification to detect offensive or sensitive content  
- **Multimodal Pipeline**: Combines text + image signals for improved moderation accuracy  

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS 

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB

### AI Microservice
- Python
- PyTorch 
- Hugging Face Transformers
- T5 / Efficent Net
- OpenCV / Tesseract OCR

### Other Tools
- Cloud storage: Cloudinary 
- Socket.io 

---

## System Architecture

1. User creates a post (text or image)
2. Content is sent to backend (Node.js + Express)
3. AI moderation microservice processes content:
   - Text → sentiment + toxicity classification
   - Image → OCR + visual analysis
4. Decision engine:
   - Safe → publish directly
   - Unsafe text → rewritten to neutral form
   - Unsafe image → blurred + flagged
5. Moderated content stored in MongoDB and shown in feed

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sentiaware.git
cd sentiaware
