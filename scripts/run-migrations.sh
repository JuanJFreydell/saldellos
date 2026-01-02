#!/bin/bash
# Run Supabase migrations
# Usage: ./scripts/run-migrations.sh

set -e  # Exit on error

echo "🚀 Running Supabase migrations..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first."
    echo "   Install with: brew install supabase/tap/supabase"
    exit 1
fi

# Check if we're in the project root
if [ ! -d "supabase/migrations" ]; then
    echo "❌ Error: supabase/migrations directory not found."
    echo "   Please run this script from the project root."
    exit 1
fi

# Check if user is logged in to Supabase
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "🔐 Checking Supabase authentication..."
    if ! supabase projects list &>/dev/null; then
        echo "❌ Not authenticated with Supabase."
        echo "   Please run: supabase login"
        echo "   This will open your browser to authenticate."
        echo ""
        read -p "Would you like to login now? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            supabase login
        else
            echo "❌ Authentication required. Exiting."
            exit 1
        fi
    fi
fi

# Check if project is linked
if [ ! -f ".supabase/config.toml" ] && [ ! -f "supabase/.temp/project-ref" ]; then
    echo "📎 Project not linked. Linking to Supabase..."
    echo "   You'll need to provide your project reference."
    echo "   Find it in: Supabase Dashboard → Settings → General → Reference ID"
    echo ""
    read -p "Enter your Supabase project reference: " PROJECT_REF
    if [ -z "$PROJECT_REF" ]; then
        echo "❌ Project reference is required."
        exit 1
    fi
    supabase link --project-ref "$PROJECT_REF"
fi

# Push migrations to remote database
echo "📤 Pushing migrations to database..."
supabase db push

echo ""
echo "✅ Migrations completed successfully!"

