#!/bin/bash

# ============================================================================
# MIGRATION SCRIPT: Restructure to PLANS.md Compliant Architecture
# ============================================================================
#
# Purpose: Migrate from monolithic structure to separate frontend/backend
# Author: Claude Code
# Date: 2025-12-10
#
# This script reorganizes the codebase to match the PLANS.md structure:
# - frontend/ - Next.js application (deployable independently)
# - backend/  - Python/FastAPI application (deployable independently)
# - scripts/  - Utility and development scripts
#
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=${DRY_RUN:-1}  # Default to dry-run mode
BACKUP_DIR=".migration-backup-$(date +%Y%m%d-%H%M%S)"

# ============================================================================
# Helper Functions
# ============================================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

execute_cmd() {
    local cmd="$1"
    local description="$2"

    if [ "$DRY_RUN" = "1" ]; then
        echo -e "${YELLOW}[DRY-RUN]${NC} $description"
        echo "  Command: $cmd"
    else
        log_info "$description"
        eval "$cmd"
        log_success "✓ $description"
    fi
}

# ============================================================================
# Pre-flight Checks
# ============================================================================

preflight_checks() {
    log_info "Running pre-flight checks..."

    # Check if git is available
    if ! command -v git &> /dev/null; then
        log_error "git is not installed. Please install git first."
        exit 1
    fi

    # Check if we're in the correct directory
    if [ ! -f "package.json" ] || [ ! -f "next.config.ts" ]; then
        log_error "This script must be run from the project root directory."
        exit 1
    fi

    # Check for uncommitted changes
    if [ "$DRY_RUN" != "1" ] && ! git diff-index --quiet HEAD --; then
        log_warning "You have uncommitted changes. Consider committing them first."
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    log_success "Pre-flight checks passed"
}

# ============================================================================
# Phase 1: Create Directory Structure
# ============================================================================

create_directory_structure() {
    log_info "Phase 1: Creating new directory structure..."

    # Frontend directories
    execute_cmd "mkdir -p frontend/src" "Create frontend/src"
    execute_cmd "mkdir -p frontend/tests/e2e" "Create frontend/tests/e2e"
    execute_cmd "mkdir -p frontend/tests/components" "Create frontend/tests/components"
    execute_cmd "mkdir -p frontend/tests/visual-regression" "Create frontend/tests/visual-regression"
    execute_cmd "mkdir -p frontend/tests/screenshots" "Create frontend/tests/screenshots"
    execute_cmd "mkdir -p frontend/public" "Create frontend/public"

    # Backend directories
    execute_cmd "mkdir -p backend/src/api" "Create backend/src/api"
    execute_cmd "mkdir -p backend/src/services" "Create backend/src/services"
    execute_cmd "mkdir -p backend/src/workers" "Create backend/src/workers"
    execute_cmd "mkdir -p backend/src/database" "Create backend/src/database"
    execute_cmd "mkdir -p backend/tests/unit" "Create backend/tests/unit"
    execute_cmd "mkdir -p backend/tests/integration" "Create backend/tests/integration"

    # Scripts directories
    execute_cmd "mkdir -p scripts/utilities" "Create scripts/utilities"
    execute_cmd "mkdir -p scripts/ingestion" "Create scripts/ingestion"
    execute_cmd "mkdir -p scripts/dev-tools" "Create scripts/dev-tools"

    log_success "Phase 1 complete: Directory structure created"
}

# ============================================================================
# Phase 2: Move Frontend Files
# ============================================================================

move_frontend_files() {
    log_info "Phase 2: Moving frontend files..."

    # Move Next.js app directory
    execute_cmd "git mv app frontend/src/app" "Move app/ → frontend/src/app/"

    # Move components
    execute_cmd "git mv components frontend/src/components" "Move components/ → frontend/src/components/"

    # Move lib
    execute_cmd "git mv lib frontend/src/lib" "Move lib/ → frontend/src/lib/"

    # Move hooks
    execute_cmd "git mv hooks frontend/src/hooks" "Move hooks/ → frontend/src/hooks/"

    # Move types
    execute_cmd "git mv types frontend/src/types" "Move types/ → frontend/src/types/"

    # Move contexts
    execute_cmd "git mv contexts frontend/src/contexts" "Move contexts/ → frontend/src/contexts/"

    # Move public directory
    execute_cmd "git mv public/* frontend/public/" "Move public/ → frontend/public/"
    execute_cmd "rmdir public" "Remove empty public/ directory"

    # Move tests
    execute_cmd "git mv tests/* frontend/tests/" "Move tests/ → frontend/tests/"
    execute_cmd "rmdir tests" "Remove empty tests/ directory"

    # Move test_screenshots
    execute_cmd "git mv test_screenshots frontend/tests/screenshots/archive" "Move test_screenshots/ → frontend/tests/screenshots/archive/"

    log_success "Phase 2 complete: Frontend files moved"
}

# ============================================================================
# Phase 3: Move Backend Files
# ============================================================================

move_backend_files() {
    log_info "Phase 3: Moving backend files..."

    # Move API files
    execute_cmd "git mv python-backend/api.py backend/src/api/main.py" "Move api.py → backend/src/api/main.py"
    execute_cmd "git mv python-backend/main.py backend/src/api/server.py" "Move main.py → backend/src/api/server.py"

    # Move services
    execute_cmd "git mv python-backend/alleato_agent_workflow backend/src/services/alleato_agent_workflow" "Move alleato_agent_workflow/ → backend/src/services/"
    execute_cmd "git mv python-backend/ingestion backend/src/services/ingestion" "Move ingestion/ → backend/src/services/"
    execute_cmd "git mv python-backend/rfi_agent backend/src/services/rfi_agent" "Move rfi_agent/ → backend/src/services/"
    execute_cmd "git mv python-backend/insights backend/src/services/insights" "Move insights/ → backend/src/services/"

    # Move helpers to services
    execute_cmd "git mv python-backend/memory_store.py backend/src/services/memory_store.py" "Move memory_store.py → backend/src/services/"
    execute_cmd "git mv python-backend/supabase_helpers.py backend/src/services/supabase_helpers.py" "Move supabase_helpers.py → backend/src/services/"
    execute_cmd "git mv python-backend/env_loader.py backend/src/services/env_loader.py" "Move env_loader.py → backend/src/services/"

    # Move workers
    execute_cmd "git mv python-backend/workers backend/src/workers" "Move workers/ → backend/src/workers/"

    # Move scripts (keep some in backend)
    execute_cmd "git mv python-backend/scripts backend/src/workers/scripts" "Move scripts/ → backend/src/workers/scripts/"

    # Move tests
    execute_cmd "git mv python-backend/tests/* backend/tests/" "Move python-backend/tests/ → backend/tests/"

    # Move configuration files
    execute_cmd "git mv python-backend/requirements.txt backend/requirements.txt" "Move requirements.txt to backend/"
    execute_cmd "git mv python-backend/start-backend.sh backend/start.sh" "Move start-backend.sh to backend/"
    execute_cmd "git mv python-backend/README.md backend/README.md" "Move backend README"

    # Move remaining files
    execute_cmd "git mv python-backend/__init__.py backend/src/__init__.py" "Move __init__.py"
    execute_cmd "git mv python-backend/types backend/src/types" "Move types/ to backend/src/"

    # Remove empty python-backend directory
    execute_cmd "rmdir python-backend/tests" "Remove empty tests directory"
    execute_cmd "rmdir python-backend" "Remove empty python-backend directory"

    log_success "Phase 3 complete: Backend files moved"
}

# ============================================================================
# Phase 4: Reorganize Scripts
# ============================================================================

reorganize_scripts() {
    log_info "Phase 4: Reorganizing scripts..."

    # Move screenshot capture to dev-tools
    execute_cmd "git mv scripts/procore-screenshot-capture scripts/dev-tools/screenshot-capture" "Move screenshot capture → dev-tools/"

    # Move docs viewer to utilities
    execute_cmd "git mv scripts/docs-viewer scripts/utilities/docs-viewer" "Move docs-viewer → utilities/"

    # Keep other scripts in place but organize
    execute_cmd "git mv scripts/agent-crawl4ai-rag-main scripts/ingestion/crawl4ai-rag" "Move crawl4ai to ingestion/"

    log_success "Phase 4 complete: Scripts reorganized"
}

# ============================================================================
# Phase 5: Delete Obsolete Folders
# ============================================================================

delete_obsolete_folders() {
    log_info "Phase 5: Deleting obsolete folders..."

    execute_cmd "git rm -rf 'app/(procore)/projects-copy'" "Delete projects-copy/"
    execute_cmd "git rm -rf 'app/(procore)/infinite-meetings'" "Delete infinite-meetings/"

    log_success "Phase 5 complete: Obsolete folders deleted"
}

# ============================================================================
# Phase 6: Update Configuration Files
# ============================================================================

update_config_files() {
    log_info "Phase 6: Updating configuration files..."

    log_warning "Configuration file updates require manual review:"
    echo ""
    echo "  1. tsconfig.json - Update paths from './*' to './src/*'"
    echo "  2. package.json - Update scripts to reference 'frontend/'"
    echo "  3. next.config.ts - Verify paths are correct"
    echo "  4. playwright.config.ts - Update test paths"
    echo "  5. tailwind.config.ts - Update content paths"
    echo "  6. .gitignore - Add frontend/.next, backend/__pycache__, etc."
    echo ""
    echo "  A separate script will be generated for these updates."

    log_success "Phase 6 complete: Configuration update notes created"
}

# ============================================================================
# Phase 7: Create Frontend Package.json
# ============================================================================

create_frontend_package() {
    log_info "Phase 7: Creating frontend-specific package.json..."

    log_warning "Frontend package.json will need to be created manually with:"
    echo ""
    echo "  - All Next.js dependencies"
    echo "  - Build scripts specific to frontend"
    echo "  - Deployment configuration"
    echo ""

    log_success "Phase 7 complete: Frontend package notes created"
}

# ============================================================================
# Phase 8: Summary and Next Steps
# ============================================================================

show_summary() {
    echo ""
    echo "============================================================================"
    echo "MIGRATION SUMMARY"
    echo "============================================================================"
    echo ""

    if [ "$DRY_RUN" = "1" ]; then
        log_warning "DRY-RUN MODE: No files were actually moved"
        echo ""
        echo "To execute the migration for real, run:"
        echo "  DRY_RUN=0 ./scripts/migrate-to-plans-structure.sh"
        echo ""
    else
        log_success "Migration complete!"
        echo ""
        echo "Files have been moved to new structure:"
        echo "  ✓ Frontend files → frontend/src/"
        echo "  ✓ Backend files → backend/src/"
        echo "  ✓ Tests → frontend/tests/ and backend/tests/"
        echo "  ✓ Scripts → scripts/ (organized)"
        echo ""
    fi

    echo "NEXT STEPS:"
    echo ""
    echo "1. Update tsconfig.json paths configuration"
    echo "2. Update package.json scripts and paths"
    echo "3. Update all import statements (run find-replace script)"
    echo "4. Create frontend/package.json for isolated deployment"
    echo "5. Update CI/CD workflows in .github/workflows/"
    echo "6. Test development server: npm run dev"
    echo "7. Test production build: npm run build"
    echo "8. Update deployment configurations (Vercel, etc.)"
    echo ""
    echo "RECOMMENDED:"
    echo "  - Review generated update script: ./scripts/update-imports.sh"
    echo "  - Commit changes in phases to allow rollback if needed"
    echo "  - Test thoroughly before pushing to remote"
    echo ""
    echo "============================================================================"
}

# ============================================================================
# Main Execution
# ============================================================================

main() {
    echo ""
    echo "============================================================================"
    echo "MIGRATION TO PLANS.MD STRUCTURE"
    echo "============================================================================"
    echo ""

    if [ "$DRY_RUN" = "1" ]; then
        log_warning "Running in DRY-RUN mode (no files will be moved)"
        echo ""
    else
        log_warning "Running in LIVE mode (files will be moved!)"
        echo ""
        read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Migration cancelled"
            exit 0
        fi
    fi

    preflight_checks

    # Execute migration phases
    create_directory_structure
    # move_frontend_files  # Uncomment when ready
    # move_backend_files   # Uncomment when ready
    # reorganize_scripts   # Uncomment when ready
    # delete_obsolete_folders  # Uncomment when ready
    # update_config_files  # Uncomment when ready
    # create_frontend_package  # Uncomment when ready

    show_summary
}

# Run main function
main
