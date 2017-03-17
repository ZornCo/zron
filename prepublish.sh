get_json_val() {
    python -c "import json,sys;sys.stdout.write(json.dumps(json.load(sys.stdin)$1))";
}
get_npm_command() {
    local temp=$(echo $npm_config_argv | get_json_val "['original'][0]")
    echo "$temp" | tr -dc "[:alnum:]"
}
if [ $(get_npm_command) != "publish" ]; then
    echo "Skipping prepublish script"
    exit 0
fi

npm run compile
