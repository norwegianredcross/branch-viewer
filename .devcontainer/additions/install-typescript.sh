#!/bin/bash
# file: .devcontainer/additions/install-typescript.sh
#
# Usage: ./install-typescript.sh [options]
# 
# Options:
#   --debug     : Enable debug output for troubleshooting
#   --uninstall : Remove installed components instead of installing them
#   --force     : Force installation/uninstallation even if there are dependencies
#
#------------------------------------------------------------------------------
# CONFIGURATION - Modify this section for each new script
#------------------------------------------------------------------------------

# Script metadata - must be at the very top of the configuration section
SCRIPT_NAME="TypeScript Development Tools"
SCRIPT_DESCRIPTION="Installs TypeScript development environment including linting, formatting, and debugging tools"

# Before running installation, we need to add any required repositories
pre_installation_setup() {
    if [ "${UNINSTALL_MODE}" -eq 1 ]; then
        echo "🔧 Preparing for uninstallation..."
    else
        echo "🔧 Performing pre-installation setup..."
        echo "No additional setup required for this script"
    fi
}

# Define Node.js packages
declare -A NODE_PACKAGES
NODE_PACKAGES=(
    ["typescript"]="TypeScript compiler and language service"
    ["ts-node"]="TypeScript execution and REPL environment"
    ["@types/node"]="TypeScript definitions for Node.js"
    ["eslint"]="JavaScript and TypeScript linter"
    ["@typescript-eslint/parser"]="TypeScript parser for ESLint"
    ["@typescript-eslint/eslint-plugin"]="TypeScript ESLint rules"
    ["prettier"]="Code formatter"
)

# Define VS Code extensions
declare -A EXTENSIONS
EXTENSIONS["ms-vscode.vscode-typescript-next"]="TypeScript|TypeScript and JavaScript Language Features"
EXTENSIONS["dbaeumer.vscode-eslint"]="ESLint|Integrates ESLint into VS Code"
EXTENSIONS["esbenp.prettier-vscode"]="Prettier|Code formatter using prettier"
EXTENSIONS["rvest.vs-code-prettier-eslint"]="Prettier ESLint|Format JavaScript and TypeScript code using prettier-eslint"

# Define verification commands to run after installation
VERIFY_COMMANDS=(
    "command -v tsc >/dev/null && tsc --version || echo '❌ TypeScript compiler not found'"
    "command -v ts-node >/dev/null && ts-node --version || echo '❌ ts-node not found'"
    "command -v eslint >/dev/null && eslint --version || echo '❌ ESLint not found'"
    "command -v prettier >/dev/null && prettier --version || echo '❌ Prettier not found'"
    "code --list-extensions | grep -q ms-vscode.vscode-typescript-next && echo '✅ TypeScript extension is installed' || echo '❌ TypeScript extension is not installed'"
)

# Post-installation notes
post_installation_message() {
    echo
    echo "🎉 Installation process complete for: $SCRIPT_NAME!"
    echo "Purpose: $SCRIPT_DESCRIPTION"
    echo
    echo "Important Notes:"
    echo "1. TypeScript compiler (tsc) and ts-node are now available globally"
    echo "2. ESLint and Prettier are configured for TypeScript"
    echo "3. VS Code extensions for TypeScript development are installed"
    echo
    echo "Next Steps:"
    echo "1. Create a tsconfig.json file in your project:"
    echo "   tsc --init"
    echo
    echo "2. Create an ESLint configuration:"
    echo "   npm init @eslint/config"
    echo
    echo "3. Create a Prettier configuration:"
    echo "   echo {} > .prettierrc.json"
    echo
    echo "Documentation Links:"
    echo "- TypeScript: https://www.typescriptlang.org/docs/"
    echo "- ESLint: https://eslint.org/docs/user-guide/"
    echo "- Prettier: https://prettier.io/docs/en/"
}

# Post-uninstallation notes
post_uninstallation_message() {
    echo
    echo "🧹 Uninstallation process complete for: $SCRIPT_NAME"
    echo
    echo "The following components have been removed:"
    echo "- TypeScript compiler and development tools"
    echo "- ESLint and related plugins"
    echo "- Prettier formatter"
    echo "- Related VS Code extensions"
    echo
    echo "Note: Project-specific configurations (tsconfig.json, .eslintrc, etc.)"
    echo "      have not been removed. Delete these manually if needed."
}

#------------------------------------------------------------------------------
# MAIN SCRIPT LOGIC - DO NOT MODIFY BELOW THIS LINE
#------------------------------------------------------------------------------

# Initialize mode flags
DEBUG_MODE=0
UNINSTALL_MODE=0
FORCE_MODE=0

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --debug)
            DEBUG_MODE=1
            shift
            ;;
        --uninstall)
            UNINSTALL_MODE=1
            shift
            ;;
        --force)
            FORCE_MODE=1
            shift
            ;;
        *)
            echo "ERROR: Unknown option: $1" >&2
            echo "Usage: $0 [--debug] [--uninstall] [--force]" >&2
            echo "Description: $SCRIPT_DESCRIPTION"
            exit 1
            ;;
    esac
done

# Export mode flags for core scripts
export DEBUG_MODE
export UNINSTALL_MODE
export FORCE_MODE

# Source all core installation scripts
source "$(dirname "$0")/core-install-apt.sh"
source "$(dirname "$0")/core-install-node.sh"
source "$(dirname "$0")/core-install-extensions.sh"

# Function to process installations
process_installations() {
    # Process each type of package if array is not empty
    if [ ${#NODE_PACKAGES[@]} -gt 0 ]; then
        process_node_packages "NODE_PACKAGES"
    fi

    if [ ${#EXTENSIONS[@]} -gt 0 ]; then
        process_extensions "EXTENSIONS"
    fi
}

# Function to verify installations
verify_installations() {
    if [ ${#VERIFY_COMMANDS[@]} -gt 0 ]; then
        echo
        echo "🔍 Verifying installations..."
        for cmd in "${VERIFY_COMMANDS[@]}"; do
            echo "Running: $cmd"
            if ! eval "$cmd"; then
                echo "❌ Verification failed for: $cmd"
            fi
        done
    fi
}

# Main execution
if [ "${UNINSTALL_MODE}" -eq 1 ]; then
    echo "🔄 Starting uninstallation process for: $SCRIPT_NAME"
    echo "Purpose: $SCRIPT_DESCRIPTION"
    pre_installation_setup
    process_installations
    if [ ${#EXTENSIONS[@]} -gt 0 ]; then
        for ext_id in "${!EXTENSIONS[@]}"; do
            IFS='|' read -r name description _ <<< "${EXTENSIONS[$ext_id]}"
            check_extension_state "$ext_id" "uninstall" "$name"
        done
    fi
    post_uninstallation_message
else
    echo "🔄 Starting installation process for: $SCRIPT_NAME"
    echo "Purpose: $SCRIPT_DESCRIPTION"
    pre_installation_setup
    process_installations
    verify_installations
    if [ ${#EXTENSIONS[@]} -gt 0 ]; then
        for ext_id in "${!EXTENSIONS[@]}"; do
            IFS='|' read -r name description _ <<< "${EXTENSIONS[$ext_id]}"
            check_extension_state "$ext_id" "install" "$name"
        done
    fi
    post_installation_message
fi