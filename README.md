<div align="center">
  <h1>🌾 Rice Leaf Disease Detection System</h1>
  <p><strong>Next-Level AI-Powered Smart Farming & Crop Analysis</strong></p>
  
  <p>
    <a href="https://github.com/raghuvaranlokati/RiceLeaf_Disease_Dectection/stargazers"><img src="https://img.shields.io/github/stars/raghuvaranlokati/RiceLeaf_Disease_Dectection?style=for-the-badge&color=yellow" alt="Stars Badge"/></a>
    <a href="https://github.com/raghuvaranlokati/RiceLeaf_Disease_Dectection/network/members"><img src="https://img.shields.io/github/forks/raghuvaranlokati/RiceLeaf_Disease_Dectection?style=for-the-badge&color=green" alt="Forks Badge"/></a>
    <a href="https://github.com/raghuvaranlokati/RiceLeaf_Disease_Dectection/issues"><img src="https://img.shields.io/github/issues/raghuvaranlokati/RiceLeaf_Disease_Dectection?style=for-the-badge&color=red" alt="Issues Badge"/></a>
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License"/>
  </p>
</div>

<br />

## 🌟 Overview

The **Rice Leaf Disease Detection** project is a state-of-the-art Deep Learning application designed to help farmers, agricultural researchers, and botanists instantly identify diseases in rice plants. By simply uploading an image of a rice leaf, this highly accurate model can detect prevalent conditions such as **Bacterial Leaf Blight**, **Brown Spot**, and **Leaf Smut**, allowing for rapid intervention and crop yield protection.

Built with a robust **Next.js 14** glassmorphism frontend and a lightning-fast **FastAPI** + **PyTorch** machine learning backend, this project represents the pinnacle of modern AI web applications.

---

## 🚀 Key Features

- **⚡ Instant AI Prediction:** Utilizes a custom-trained Convolutional Neural Network (CNN) architecture built on PyTorch for high-confidence predictions in milliseconds.
- **📱 Next-Level UI/UX:** A stunning, responsive, glassmorphism-inspired interface crafted with modern CSS and Next.js App Router.
- **🔒 Secure Admin Dashboard:** Built-in contact functionality powered by Firebase, complete with a password-protected admin message inbox.
- **📊 Confidence Breakdown:** Visually breaks down the model's confidence percentages for each potential disease to provide maximum transparency.
- **🌐 RESTful API Backend:** A heavily optimized Python FastAPI server capable of handling massive volumes of image tensors simultaneously.

---

## 🛠️ Technology Stack

### Frontend (Client-Side)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Backend (Server-Side)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)

---

## 📸 Sneak Peek

*The application features a sleek, glowing glassmorphic interface that users love.*

- **Smart Predictor:** Drag and drop any rice leaf image for real-time analysis.
- **Admin Dashboard:** Review user messages and queries sent via the contact form.

---

## ⚙️ Installation & Setup

To run this project locally, follow these simple steps:

### 1. Clone the repository
```bash
git clone https://github.com/raghuvaranlokati/RiceLeaf_Disease_Dectection.git
cd RiceLeaf_Disease_Dectection
```

### 2. Setup the Backend (FastAPI + PyTorch)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
*The backend API will now be running on `http://localhost:8000`.*

### 3. Setup the Frontend (Next.js)
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend application will now be running on `http://localhost:3000`.*

---

## 🔬 Dataset & Model Training

The CNN model was rigorously trained on a carefully curated dataset containing high-resolution images of various rice leaf diseases. 
- **Preprocessing:** Images are resized, augmented, and normalized to ensure the model generalizes perfectly across different lighting conditions and camera qualities.
- **Performance:** Achieved industry-leading accuracy on validation datasets, minimizing false positives for critical agricultural decisions.

---

## 🤝 Contributing

Contributions make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <h3>Made with ❤️ by <a href="https://github.com/raghuvaranlokati">Raghuvaran</a></h3>
  <p>If you found this repository helpful, please consider leaving a ⭐!</p>
</div>
