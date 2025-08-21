# Adminify - CLI to Web UI Plugin

## Project Overview

Adminify is an oclif plugin that automatically generates web-based user interfaces for command-line interface (CLI) applications. It hooks into existing oclif commands and creates corresponding UI forms with appropriate input elements based on command parameters.

## Goals

### Primary Goals
- **Auto-generate Web UIs**: Transform CLI commands into intuitive web forms
- **Zero Configuration**: Works out-of-the-box with existing oclif CLIs
- **Type-Safe Integration**: Leverage TypeScript for robust command introspection
- **Authentication & Security**: Secure command execution with user authentication
- **Plugin Architecture**: Easy integration as an oclif plugin

### Technical Goals
- Parse oclif command definitions automatically
- Generate appropriate UI input elements (text, select, checkbox) based on flag types
- Provide real-time command execution with output display
- Support both development and production deployment modes
- Maintain security through JWT-based authentication

## Architecture

### Backend (Fastify Server)
- **Command Introspection**: Uses oclif hooks to discover and parse all registered commands
- **REST API**: Provides endpoints for command metadata and execution
- **Authentication**: JWT-based auth with Argon2 password hashing
- **Command Execution**: Secure execution of CLI commands via oclif's native methods

### Frontend (React + Vite)
- **Dynamic Form Generation**: Creates forms based on command schemas
- **Real-time Output**: Displays command execution results
- **Authentication UI**: Login interface with session management
- **Responsive Design**: Tailwind CSS for modern, mobile-friendly interface

## Directory Structure

```
adminify/
├── CLAUDE.md                    # This file - project documentation
├── README.md                    # User-facing documentation
├── package.json                 # Root workspace configuration
├── pnpm-workspace.yaml         # pnpm monorepo configuration
├── pnpm-lock.yaml              # Dependency lock file
│
├── packages/                    # Shared packages
│   ├── adminify-plugin/         # Main oclif plugin package
│   │   ├── src/
│   │   │   ├── commands/        # Plugin CLI commands
│   │   │   │   ├── dev.ts       # Start development server
│   │   │   │   ├── generate.ts  # Generate static UI schemas
│   │   │   │   └── create-user.ts # Create user accounts
│   │   │   ├── hooks/
│   │   │   │   └── init.ts      # Command discovery hook
│   │   │   ├── lib/
│   │   │   │   ├── auth.ts      # Authentication service
│   │   │   │   └── command-parser.ts # Command schema parser
│   │   │   ├── server/
│   │   │   │   └── index.ts     # Fastify server setup
│   │   │   └── db/
│   │   │       └── simple.ts    # Simple file-based user storage
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── adminify-ui/             # React frontend application
│       ├── src/
│       │   ├── components/      # React components
│       │   │   ├── CommandForm.tsx    # Dynamic command form
│       │   │   ├── CommandList.tsx    # Available commands list
│       │   │   ├── InputField.tsx     # Form input components
│       │   │   ├── LoginForm.tsx      # Authentication form
│       │   │   └── Header.tsx         # App header with user info
│       │   ├── contexts/
│       │   │   └── AuthContext.tsx    # Authentication state management
│       │   ├── hooks/
│       │   │   └── useCommands.ts     # API hooks for commands
│       │   ├── types/
│       │   │   └── index.ts           # TypeScript type definitions
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── package.json
│       ├── vite.config.ts
│       └── tailwind.config.js
│
└── apps/                        # Example applications
    └── example-cli/             # Sample CLI for testing
        ├── src/
        │   └── commands/        # Example CLI commands
        │       ├── hello/       # Basic hello commands
        │       ├── user/
        │       │   └── create.ts # User creation example
        │       └── deploy.ts    # Deployment example
        ├── package.json
        └── tsconfig.json
```

## Key Components

### Plugin Commands
- **`dev`**: Starts the Fastify server and React development server
- **`generate`**: Generates static JSON schemas of all CLI commands
- **`create-user`**: Creates user accounts for web UI access (admin only)

### Authentication System
- **User Management**: File-based user storage with Argon2 password hashing
- **JWT Tokens**: Stateless authentication for API requests
- **Protected Routes**: Command execution requires valid authentication
- **Admin-Only Registration**: Users must be created via CLI command

### Command Processing
1. **Discovery**: Init hook scans all registered oclif commands
2. **Parsing**: Extracts command metadata (flags, args, descriptions)
3. **Filtering**: Excludes built-in oclif commands from UI
4. **Schema Generation**: Transforms command definitions into UI-friendly schemas
5. **Execution**: Securely executes commands using oclif's native methods

## Development Workflow

### Setup
```bash
pnpm install                    # Install all dependencies
cd packages/adminify-plugin && pnpm build  # Build the plugin
cd ../..
```

### Running the Demo
```bash
cd apps/example-cli
./bin/dev.js create-user admin@example.com --password password123
./bin/dev.js dev               # Starts server + UI on http://localhost:3001
```

### Adding to Existing CLI
1. Install the plugin: `pnpm add adminify-plugin`
2. Add to oclif plugins in package.json
3. Run `your-cli dev` to start the UI server

## Technology Stack

### Backend
- **oclif**: CLI framework and command introspection
- **Fastify**: High-performance web server
- **Argon2**: Password hashing (OWASP 2024 recommended)
- **@fastify/jwt**: JWT token management
- **@fastify/auth**: Authentication middleware

### Frontend
- **React 19**: UI framework
- **Vite**: Build tool and development server
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling framework
- **React Hook Form**: Form management
- **@tanstack/react-query**: API state management
- **Axios**: HTTP client

### Development Tools
- **pnpm**: Package manager and monorepo support
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Security Features

- **Argon2 Password Hashing**: Industry-standard password security
- **JWT Authentication**: Stateless, secure token-based auth
- **Protected Command Execution**: All commands require authentication
- **Admin-Only User Creation**: Prevents unauthorized account creation
- **Input Validation**: Both client and server-side validation
- **CORS Protection**: Configured for secure cross-origin requests

## Future Enhancements

- [ ] Role-based permissions for command access
- [ ] Audit logging for command executions
- [ ] WebSocket support for real-time command output
- [ ] Command history and favorites
- [ ] Custom UI themes and branding
- [ ] Database migration from file-based to proper DB
- [ ] Multi-tenant support
- [ ] Command scheduling and automation
- [ ] Integration with CI/CD pipelines

## Contributing

This project uses:
- **Conventional Commits**: For consistent commit messages
- **TypeScript**: Strict type checking enabled
- **ESLint + Prettier**: Automated code formatting
- **pnpm**: For dependency management and workspace support

When adding new features:
1. Follow existing patterns for command parsing and UI generation
2. Add proper TypeScript types
3. Include error handling and validation
4. Update this CLAUDE.md file with significant changes
5. Test with the example CLI before submitting changes