# 🌟 LumenAura - Daily Numerology Guide

> **Discover your daily numerology profile with personalized colors, gems, and affirmations based on Louise Hay's wisdom system.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://lumenaura.vercel.app)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## ✨ Features

- **🎯 Personalized Daily Profiles** - Get your unique numerology reading based on your birth date
- **🎨 Color & Gem Guidance** - Discover your daily colors and gemstones for optimal energy
- **📱 Mobile-First Design** - Seamlessly optimized for all devices
- **🗓️ Calendar Views** - Explore past and future numerology profiles
- **📊 Monthly Insights** - View your entire month's numerology patterns
- **🔐 Secure Authentication** - Google OAuth integration with Supabase
- **✨ Beautiful UI** - Crystal-themed design with smooth animations
- **📤 Profile Management** - Edit your personal information and preferences

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/jnystrom14/lumenaura.git

# Navigate to project directory
cd lumenaura

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080` to see your app in action! 🎉

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library

### **Backend & Auth**
- **Supabase** - Backend as a service
- **Google OAuth** - Secure authentication
- **PostgreSQL** - Robust database

### **Additional Libraries**
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Date-fns** - Date manipulation
- **Lucide React** - Beautiful icons
- **React Day Picker** - Calendar components

## 📱 Mobile Optimization

LumenAura is built mobile-first with:
- **Responsive design** that adapts to all screen sizes
- **Touch-friendly interactions** with proper spacing
- **PWA capabilities** for app-like experience
- **Optimized performance** for mobile devices

## 🎨 Design System

### **Color Palette**
- **Primary**: Lumenaura Purple (`#9b87f5`)
- **Secondary**: Crystal Lavender (`#e6dbff`) 
- **Accent**: Soft gradients and crystal-inspired effects

### **Typography**
- **Headers**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## 📂 Project Structure

```
lumenaura/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   └── calendar/       # Calendar view components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── data/               # Numerology data and calculations
│   ├── types/              # TypeScript type definitions
│   └── integrations/       # Third-party integrations
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🔧 Configuration

### **Environment Variables**

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Supabase Setup**

1. Create a new Supabase project
2. Set up authentication with Google OAuth
3. Configure your database schema
4. Add your domain to allowed origins

## 🚀 Deployment

### **Vercel (Recommended)**

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on every push

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**

- Follow TypeScript best practices
- Use meaningful component and variable names
- Add JSDoc comments for complex functions
- Ensure mobile responsiveness
- Test on multiple devices

## 📖 API Documentation

### **Core Functions**

```typescript
// Calculate daily numerology profile
getDailyProfile(userProfile: UserProfile, date: Date): DailyProfile

// Fetch user profile from database
fetchUserProfileFromServer(userId: string): Promise<UserProfile>

// Calculate personal year
calculatePersonalYear(birthDate: Date, year: number): number
```

### **Component Props**

See individual component files for detailed prop documentation.

## 🎯 Numerology System

LumenAura uses Louise Hay's numerology system featuring:

- **Personal Year, Month, Day calculations**
- **Color associations** for energy alignment
- **Gemstone recommendations** for daily focus
- **Affirmations and themes** for personal growth
- **Universal year influence** for global energy

## 📱 Browser Support

- **Chrome** 90+ ✅
- **Firefox** 88+ ✅
- **Safari** 14+ ✅
- **Edge** 90+ ✅
- **Mobile browsers** ✅

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Louise Hay** - For the foundational numerology system
- **shadcn** - For the beautiful UI components
- **Supabase** - For the robust backend infrastructure
- **Vercel** - For seamless deployment

## 📞 Support

Having issues? We're here to help!

- 📧 **Email**: [your-email@example.com]
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/jnystrom14/lumenaura/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/jnystrom14/lumenaura/discussions)

---

**Made with ❤️ by [Your Name]**

*Discover your daily magic with LumenAura* ✨
