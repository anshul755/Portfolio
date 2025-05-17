# 🚀 Anshul Patel's Developer Portfolio

Welcome to my personal portfolio website — built with **React** and **Tailwind CSS**!  
🌍 Live here: [Anshul Patel](https://anshulpatel.vercel.app)

---

## 🧑‍💻 Features

- 🌐 Fully responsive design
- 💬 Contact form with real-time email submission via EmailJS
- 🔗 Integrated social and competitive programming profiles
- 🎨 Stylish UI built using Tailwind CSS
- ⚡ Smooth animations and user-friendly layout

---

## ✉️ Contact Form Configuration

This project uses [EmailJS](https://www.emailjs.com/) to send emails directly from the frontend.

To configure:

1. Go to [emailjs.com](https://www.emailjs.com/)
2. Create a new service and email template
3. Add your Public Key in your EmailJS dashboard
4. Replace the following in `Contact.jsx`:

```js
emailjs.sendForm(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  formRef.current,
  'YOUR_PUBLIC_KEY'
)
```

---

## 🔗 Social & CP Profiles

- [GitHub](https://github.com/anshul755)
- [LinkedIn](https://www.linkedin.com/in/anshul-patel-2b7241313/)
- [LeetCode](https://leetcode.com/anshul755)
- [Codeforces](https://codeforces.com/profile/anshul755)

---

## 🛠️ Built With

- ⚛️ React
- 🎨 Tailwind CSS
- ✉️ EmailJS
- 🧱 Lucide React Icons

---

## 🚀 Getting Started

### Prerequisites

- Node.js v14+
- npm or yarn

### Installation

```bash
git clone https://github.com/anshul755/portfolio.git
cd portfolio
npm install
npm run dev
```