# Code-Driven Narrative Portfolio

An interactive terminal-style portfolio that presents your development journey as a debugging experience. Visitors explore your projects through terminal commands, creating an engaging and memorable experience.

## 🚀 Features

- **Interactive Terminal**: Full terminal experience with command processing
- **Typewriter Effects**: Realistic typing animations for enhanced storytelling  
- **Modular Project System**: Easy to add new projects without touching UI code
- **Multiple Project States**: 
  - ✅ **Completed**: Fully showcased projects with code samples
  - 📋 **Planned**: Coming soon projects with progress indicators
  - 🔒 **Encrypted**: Mysterious projects to build intrigue
- **Tab Completion**: Professional terminal experience with autocomplete
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Full type safety and better developer experience

## 📋 Available Commands

Try these commands in the terminal:

```bash
debug --help          # Show all available commands
debug --about         # Personal information and bio
debug --skills        # Technical skills showcase
debug --contact       # Contact information
debug --project-alpha # View your first project
debug --project-beta  # Planned project preview
debug --project-gamma # Another upcoming project  
debug --project-delta # Encrypted/mysterious project
debug --clear         # Clear terminal screen
debug --history       # View command history
```

## 🛠️ Technology Stack

- **Frontend**: React 19, Next.js 15, TypeScript
- **Styling**: Tailwind CSS 4
- **Font**: Geist (Sans & Mono)
- **Development**: Turbopack, ESLint
- **Deployment**: Ready for Vercel, Netlify, or any hosting platform

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page (renders Terminal)
├── components/
│   └── Terminal.tsx         # Main terminal component
└── data/
    └── projects.ts          # Project data and configuration
```

## 🔧 Customization Guide

### Adding Your Projects

Edit `src/data/projects.ts` to customize:

1. **Personal Information**:
```typescript
export const personalInfo = {
  name: 'Your Name Here',
  title: 'Your Title Here', 
  bio: 'Your bio here...',
  skills: ['Your', 'Skills', 'Here'],
  contact: {
    email: 'your.email@example.com',
    // ... other contact info
  }
};
```

2. **Adding New Projects**:
```typescript
{
  id: 'project-epsilon',
  name: 'My New Project',
  status: 'completed', // or 'planned', 'in-progress', 'encrypted'
  description: 'What this project does...',
  technologies: ['React', 'Node.js', 'etc'],
  debugCommand: 'debug --project-epsilon',
  codeSnippet: `// Your code sample here`,
  liveUrl: 'https://your-project.com',
  githubUrl: 'https://github.com/you/project'
}
```

## 🚀 Getting Started

1. **Install Dependencies**:
```bash
npm install
```

2. **Start Development Server**:
```bash
npm run dev
```

3. **Open in Browser**: Visit `http://localhost:3000`

4. **Customize**: Edit `src/data/projects.ts` with your information

## 📈 Development Workflow

1. **Add New Project**: Update `src/data/projects.ts`
2. **Test Commands**: Try in terminal interface  
3. **Verify Styling**: Check responsive design
4. **Deploy**: Ready for production

---

**Built with ❤️ and lots of ☕**

*Happy debugging! 🐛➡️✨*
