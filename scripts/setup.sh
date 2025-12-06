#!/bin/bash

echo "🚀 Setting up React Native Cross-Platform Template..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check npm version
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

# Success message
echo ""
echo "✨ Setup complete!"
echo ""
echo "To run the app:"
echo "  npm start       # Start development server"
echo "  npm run web     # Run in browser"
echo "  npm run ios     # Run on iOS (macOS only)"
echo "  npm run android # Run on Android"
echo ""
echo "Scan the QR code with Expo Go app on your mobile device to test"