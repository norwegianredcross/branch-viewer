#!/bin/bash
# file: .devcontainer/additions/core-install-extensions.sh
#
# Core functionality for managing VS Code extensions
# To be sourced by installation scripts, not executed directly.

set -e

# If this is a run command, treat it as an update
if [ "${RUN_MODE:-0}" -eq 1 ]; then
    UPDATE_MODE=1
fi

# Debug function
debug() {
    if [ "${DEBUG_MODE:-0}" -eq 1 ]; then
        echo "DEBUG: $*" >&2
    fi
}

# Simple logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

# Error logging function
error() {
    echo "ERROR: $*" >&2
}

# Find VS Code/Cursor server installation
find_vscode_server() {
    debug "=== Finding VS Code/Cursor server installation ==="
    
    local server_path

    # First, try to find Cursor server
    local cursor_base="/vscode/cursor-server/bin"
    if [ -d "$cursor_base" ]; then
        # Find the platform-specific directory (e.g., linux-arm64)
        for platform_dir in "$cursor_base"/*; do
            if [ -d "$platform_dir" ]; then
                # Find the version-specific directory
                version_dir=$(ls -t "$platform_dir" 2>/dev/null | head -n 1)
                if [ -n "$version_dir" ]; then
                    server_path="$platform_dir/$version_dir/bin/cursor-server"
                    if [ -x "$server_path" ]; then
                        debug "Found Cursor server at: $server_path"
                        echo "$server_path"
                        return 0
                    fi
                fi
            fi
        done
    fi

    # If Cursor server not found, try VS Code server locations
    for dir in "/home/vscode/.vscode-server/bin" "/vscode/vscode-server/bin"; do
        if [ -d "$dir" ]; then
            vscode_dir=$(ls -t "$dir" 2>/dev/null | head -n 1)
            if [ -n "$vscode_dir" ]; then
                server_path="$dir/$vscode_dir/bin/code-server"
                if [ -x "$server_path" ]; then
                    debug "Found VS Code server at: $server_path"
                    echo "$server_path"
                    return 0
                fi
            fi
        fi
    done
    
    error "Neither Cursor nor VS Code server binary found"
    return 1
}

# Get installed extension version
get_extension_version() {
    local ext_id="$1"
    local server="$2"
    
    if [[ "$server" == */cursor-server ]]; then
        "$server" --list-extensions --show-versions 2>/dev/null | grep "^${ext_id}@" | cut -d'@' -f2 || echo "Not installed"
    else
        "$server" --accept-server-license-terms --list-extensions --show-versions 2>/dev/null | grep "^${ext_id}@" | cut -d'@' -f2 || echo "Not installed"
    fi
}

# Check if extension is installed
is_extension_installed() {
    local ext_id="$1"
    local server="$2"
    
    if [[ "$server" == */cursor-server ]]; then
        "$server" --list-extensions 2>/dev/null | grep -q "^$ext_id$"
    else
        "$server" --accept-server-license-terms --list-extensions 2>/dev/null | grep -q "^$ext_id$"
    fi
}

# Function to process extensions
process_extensions() {
    debug "=== Starting process_extensions ==="
    
    # Get array reference
    declare -n arr=$1
    
    debug "Array contents:"
    debug "Array size: ${#arr[@]}"
    debug "Array keys: '${!arr[@]}'"
    
    # Find VS Code server
    local CODE_SERVER
    CODE_SERVER=$(find_vscode_server) || return 1
    export CODE_SERVER
    
    # Print header based on mode
    if [ "${UNINSTALL_MODE:-0}" -eq 1 ]; then
        if [ "${FORCE_MODE:-0}" -eq 1 ]; then
            log "Force uninstalling ${#arr[@]} extensions..."
        else
            log "Uninstalling ${#arr[@]} extensions..."
        fi
    elif [ "${UPDATE_MODE:-0}" -eq 1 ]; then
        log "Updating ${#arr[@]} extensions..."
    else
        log "Installing ${#arr[@]} extensions..."
    fi
    
    echo
    printf "%-25s %-35s %-30s %s\n" "Extension" "Description" "ID" "Status"
    printf "%s\n" "----------------------------------------------------------------------------------------------------"
    
    # Track results
    local installed=0
    local uninstalled=0
    local updated=0
    local failed=0
    local skipped=0
    
    # Arrays to store successful operations for summary
    declare -A successful_ops
    declare -A version_changes
    
    # Determine if we're using Cursor server
    local is_cursor=false
    [[ "$CODE_SERVER" == */cursor-server ]] && is_cursor=true
    
    # Process each extension
    for ext_id in ${!arr[@]}; do
        IFS='|' read -r name description _ <<< "${arr[$ext_id]}"
        printf "%-25s %-35s %-30s " "$name" "$description" "$ext_id"
        
        if [ "${UNINSTALL_MODE:-0}" -eq 1 ]; then
            if is_extension_installed "$ext_id" "$CODE_SERVER"; then
                version=$(get_extension_version "$ext_id" "$CODE_SERVER")
                cmd_options="${FORCE_MODE:-0}" -eq 1 && echo "--force" || echo ""
                
                if $is_cursor; then
                    "$CODE_SERVER" $cmd_options --uninstall-extension "$ext_id" >/dev/null 2>&1
                else
                    "$CODE_SERVER" --accept-server-license-terms $cmd_options --uninstall-extension "$ext_id" >/dev/null 2>&1
                fi

                if [ $? -eq 0 ]; then
                    printf "Uninstalled (was v%s)\n" "$version"
                    uninstalled=$((uninstalled + 1))
                    successful_ops["$name"]=$version
                else
                    printf "Failed to uninstall v%s\n" "$version"
                    failed=$((failed + 1))
                fi
            else
                printf "Not installed\n"
                skipped=$((skipped + 1))
            fi
        elif [ "${UPDATE_MODE:-0}" -eq 1 ]; then
            if is_extension_installed "$ext_id" "$CODE_SERVER"; then
                old_version=$(get_extension_version "$ext_id" "$CODE_SERVER")
                
                if $is_cursor; then
                    "$CODE_SERVER" --force --install-extension "$ext_id" >/dev/null 2>&1
                else
                    "$CODE_SERVER" --accept-server-license-terms --force --install-extension "$ext_id" >/dev/null 2>&1
                fi

                if [ $? -eq 0 ]; then
                    new_version=$(get_extension_version "$ext_id" "$CODE_SERVER")
                    if [ "$old_version" != "$new_version" ]; then
                        printf "Updated (v%s → v%s)\n" "$old_version" "$new_version"
                        updated=$((updated + 1))
                        successful_ops["$name"]=$new_version
                        version_changes["$name"]="$old_version → $new_version"
                    else
                        printf "Already up to date (v%s)\n" "$old_version"
                        skipped=$((skipped + 1))
                        successful_ops["$name"]=$old_version
                    fi
                else
                    printf "Update failed (v%s)\n" "$old_version"
                    failed=$((failed + 1))
                fi
            else
                printf "Not installed\n"
                skipped=$((skipped + 1))
            fi
        else
            if is_extension_installed "$ext_id" "$CODE_SERVER"; then
                version=$(get_extension_version "$ext_id" "$CODE_SERVER")
                printf "v%s\n" "$version"
                skipped=$((skipped + 1))
                successful_ops["$name"]=$version
            else
                if $is_cursor; then
                    "$CODE_SERVER" --install-extension "$ext_id" >/dev/null 2>&1
                else
                    "$CODE_SERVER" --accept-server-license-terms --install-extension "$ext_id" >/dev/null 2>&1
                fi

                if [ $? -eq 0 ]; then
                    version=$(get_extension_version "$ext_id" "$CODE_SERVER")
                    printf "Installed v%s\n" "$version"
                    installed=$((installed + 1))
                    successful_ops["$name"]=$version
                else
                    printf "Installation failed\n"
                    failed=$((failed + 1))
                fi
            fi
        fi
    done
    
    echo
    echo "Current Status:"
    if [ ${#successful_ops[@]} -gt 0 ]; then
        while IFS= read -r name; do
            if [ "${UNINSTALL_MODE:-0}" -eq 1 ]; then
                printf "* 🗑️  %s (was v%s)\n" "$name" "${successful_ops[$name]}"
            elif [ "${UPDATE_MODE:-0}" -eq 1 ]; then
                if [ -n "${version_changes[$name]}" ]; then
                    printf "* 🔄 %s (%s)\n" "$name" "${version_changes[$name]}"
                else
                    printf "* ✓ %s (v%s)\n" "$name" "${successful_ops[$name]}"
                fi
            else
                printf "* ✅ %s (v%s)\n" "$name" "${successful_ops[$name]}"
            fi
        done < <(printf '%s\n' "${!successful_ops[@]}" | sort)
    else
        echo "No operations completed successfully"
    fi
    
    echo
    echo "----------------------------------------"
    log "Extension Status Summary"
    echo "Total extensions: ${#arr[@]}"
    if [ "${UNINSTALL_MODE:-0}" -eq 1 ]; then
        echo "  Successfully uninstalled: $uninstalled"
        echo "  Not installed: $skipped"
        echo "  Failed to uninstall: $failed"
    elif [ "${UPDATE_MODE:-0}" -eq 1 ]; then
        echo "  Updated: $updated"
        echo "  Already up to date/Not installed: $skipped"
        echo "  Failed to update: $failed"
    else
        echo "  Already installed: $skipped"
        echo "  Newly installed: $installed"
        echo "  Failed to install: $failed"
    fi
}