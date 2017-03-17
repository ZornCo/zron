if [ ! -d "src" ] || [ ! -d "spec" ]; then
    echo "Skipping prepublish script"
    exit 0
fi

npm run compile
