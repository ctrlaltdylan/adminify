# Adminify - oclif Plugin for Auto-Generated CLI UIs

Adminify is an oclif plugin that automatically generates web-based user interfaces for command-line interface (CLI) applications. It hooks into existing oclif commands and creates corresponding UI forms with appropriate input elements based on command parameters.

## Features

- 🔍 **Automatic Command Discovery**: Introspects all registered oclif commands
- 🎨 **Dynamic UI Generation**: Creates appropriate input fields based on command flags and arguments
- 🚀 **Real-time Development**: Hot-reload UI with Vite and React
- 📦 **Plugin Architecture**: Easy integration with existing oclif CLIs
- 🛠️ **TypeScript Support**: Full type safety throughout

## Project Structure

```
adminify/
├── packages/
│   ├── adminify-plugin/    # The oclif plugin
│   └── adminify-ui/         # React UI application
└── apps/
    └── example-cli/         # Example CLI for testing
```

## Installation

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Build all packages:

```bash
cd packages/adminify-plugin && pnpm build
cd ../adminify-ui && pnpm build
cd ../../apps/example-cli && pnpm build
```

## Usage

### As a Plugin in Your CLI

1. Add the plugin to your oclif CLI:

```bash
pnpm add adminify-plugin
```

2. Register it in your `package.json`:

```json
{
  "oclif": {
    "plugins": [
      "adminify-plugin"
    ]
  }
}
```

3. Run the development server:

```bash
your-cli dev
```

4. Open http://localhost:3001 in your browser

### Available Commands

The plugin provides two commands:

- `dev` - Start the development server with live UI
- `generate` - Generate a static JSON schema of all commands

### Development

To run the example:

```bash
# Terminal 1: Start the plugin server
cd apps/example-cli
./bin/dev.js dev

# The UI will start automatically on http://localhost:3001
```

## How It Works

1. **Command Introspection**: The plugin uses an `init` hook to discover all registered commands when the CLI starts
2. **API Server**: A Fastify server exposes command metadata via REST endpoints
3. **Dynamic Forms**: The React UI fetches command schemas and generates appropriate form fields
4. **Type Mapping**: Command flags and arguments are mapped to appropriate HTML input types:
   - Boolean flags → Checkboxes
   - String flags with options → Select dropdowns
   - Other flags → Text inputs

## API Endpoints

- `GET /api/commands` - List all available commands
- `GET /api/commands/:id` - Get details for a specific command
- `POST /api/execute` - Execute a command (placeholder for future implementation)

## Tech Stack

- **Backend**: oclif, Fastify, TypeScript
- **Frontend**: React, Vite, Tailwind CSS, React Hook Form
- **Monorepo**: pnpm workspaces

## Future Enhancements

- [ ] Command execution from UI
- [ ] Real-time output streaming
- [ ] Command history and favorites
- [ ] Custom UI themes
- [ ] Export/import command configurations
- [ ] Authentication and authorization
- [ ] WebSocket support for live updates

## License

MIT