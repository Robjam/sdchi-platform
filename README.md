# SDCHI Platform

## Prerequesites

This makes heavy usage of https in local development, and for the convenient `scripts/setup-https.sh` script to work, the following dependencies must be installed (by brew):

```zsh
brew install mkcert nss
```

next run the script from the root directory (same directory as this README.md):
```zsh
sudo ./scripts/setup-https.sh
```

### git worktrees

In order to move very quickly, this repository makes use of `git worktrees`.

- **Concurrent development**: Work on multiple branches simultaneously without switching contexts
- **Linked gitignored files**: Share `.env`, `node_modules`, and other ignored files across worktrees
- **Faster iteration**: No need to stash/unstash or rebuild dependencies when switching features

#### Initial Setup

```zsh
# Clone the repository as a bare repo
git clone --bare https://github.com/robjam/sdchi-platform.git
cd sdchi-platform

# Create your main worktree
git worktree add main main

# Enable shared hooks for automatic config linking
git config core.hooksPath .githooks

# Install dependencies in main
cd main
pnpm install
```

#### checking out branches

creating branches requires the below (from the same directory as `.git` directory):
```zsh
#                   ↓ branch name    ↓ folder name
git worktree add -b feature/new-auth new-auth
```

#### changing branches
once a branch is created, changing branches is `cd ../new-auth`!
