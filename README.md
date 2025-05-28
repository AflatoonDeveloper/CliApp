# NutriAI - AI-Powered Food Analysis Application

## Project Structure
```
CliApp/
├── src/                    # Source code directory
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/              # Utility libraries
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── public/               # Static files
├── supabase/            # Supabase configuration
├── tests/               # Test files
├── .vscode/            # VS Code configuration
├── .next/              # Next.js build output
├── node_modules/       # Dependencies
├── .gitignore         # Git ignore file
├── components.json    # UI components configuration
├── deploy.sh         # Deployment script
├── middleware.ts     # Next.js middleware
├── next.config.js    # Next.js configuration
├── package.json      # Project dependencies
├── postcss.config.js # PostCSS configuration
├── render.yaml       # Render deployment configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── tempo.config.json # Tempo configuration
├── tsconfig.json    # TypeScript configuration
└── vitest.config.ts # Vitest configuration
```

## Setup Instructions

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Variables**
Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

3. **Development**
```bash
npm run dev
```

4. **Testing**
```bash
npm run test
npm run test:coverage
```

5. **Build**
```bash
npm run build
```

6. **Start Production**
```bash
npm start
```

## Deployment

1. **Render Deployment**
```bash
# Deploy to Render
./deploy.sh
```

2. **Environment Setup**
- Set environment variables in Render dashboard
- Configure build and start commands
- Set up health check endpoint

## Key Features

- AI-powered food analysis
- Real-time nutrition tracking
- User authentication
- Meal history
- Nutrition insights
- Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- Google Gemini AI
- Vitest for testing
- Render for deployment

## Development Guidelines

1. **Code Structure**
   - Follow the established directory structure
   - Keep components modular and reusable
   - Use TypeScript for type safety
   - Follow Next.js best practices

2. **Testing**
   - Write tests for components
   - Maintain good test coverage
   - Run tests before deployment

3. **Styling**
   - Use Tailwind CSS for styling
   - Follow responsive design principles
   - Maintain consistent theming

4. **State Management**
   - Use React hooks for local state
   - Implement proper error handling
   - Follow data fetching patterns

5. **Security**
   - Keep environment variables secure
   - Implement proper authentication
   - Follow security best practices

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

MIT License
