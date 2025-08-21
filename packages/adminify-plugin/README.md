adminify-plugin
=================

**Transform any CLI into a beautiful web interface in seconds.**

Adminify is an oclif plugin that automatically generates modern web UIs for your command-line tools. No manual form building, no configuration files – just install, run, and get a fully functional web interface for all your CLI commands.

## ✨ Features

- 🚀 **Zero Configuration** - Automatically discovers and generates UIs for all your CLI commands
- 🎨 **Modern Interface** - Clean, responsive web UI built with React and Tailwind CSS
- 🔐 **Built-in Authentication** - Secure user management with JWT tokens
- ⚡ **Real-time Execution** - Run commands and see output instantly in the browser
- 🔧 **Smart Form Generation** - Automatically maps CLI flags and arguments to appropriate form fields
- 📱 **Mobile Friendly** - Works perfectly on desktop, tablet, and mobile devices

## 🚀 5-Minute Quickstart

### 1. Install the Plugin

Add adminify-plugin to your existing oclif CLI:

```bash
# For oclif CLIs
npm install adminify-plugin
# or
yarn add adminify-plugin
# or
pnpm add adminify-plugin

# Then add to your CLI's package.json under "oclif.plugins"
```

Or install globally to use with any CLI:

```bash
npm install -g adminify-plugin
```

### 2. Create Your First User

```bash
# Create an admin user account
your-cli create-user admin@yourcompany.com --password secure123
```

### 3. Start the Web Server

```bash
# Start the development server
your-cli dev
```

The web interface will be available at `http://localhost:3000`

### 4. Access Your Commands

1. Open your browser to `http://localhost:3000`
2. Sign in with the credentials you created
3. See all your CLI commands as beautiful web forms
4. Run commands directly from the browser!

## 🛠 Installation

### For Existing oclif CLIs

Add adminify-plugin to your CLI project:

```bash
npm install adminify-plugin
```

Then add it to your `package.json`:

```json
{
  "oclif": {
    "plugins": [
      "adminify-plugin"
    ]
  }
}
```

### Global Installation

Install globally to use with any oclif-based CLI:

```bash
npm install -g adminify-plugin
```

## 📖 Commands

### `create-user EMAIL`

Create a new user account for the web interface.

```bash
USAGE
  $ your-cli create-user EMAIL -p <password>

ARGUMENTS
  EMAIL  User email address

FLAGS
  -p, --password=<value>  User password (minimum 6 characters)

EXAMPLES
  $ your-cli create-user admin@example.com --password mypassword123
  $ your-cli create-user user@company.com -p securepassword
```

### `dev`

Start the development web server.

```bash
USAGE
  $ your-cli dev [--port <value>]

FLAGS
  --port=<value>  [default: 3000] Port to run the server on

DESCRIPTION
  Starts a web server that provides a UI for all your CLI commands

EXAMPLES
  $ your-cli dev
  $ your-cli dev --port 8080
```

### `generate`

Generate UI schemas for your commands (development utility).

```bash
USAGE
  $ your-cli generate

DESCRIPTION
  Outputs JSON schemas for all discovered commands
```

## 🚀 Production Deployment

### Environment Setup

1. **Set JWT Secret**
   ```bash
   export JWT_SECRET="your-super-secret-jwt-key-here"
   ```

2. **Configure API URL** (if frontend is served separately)
   ```bash
   export VITE_API_URL="https://your-api-domain.com"
   ```

### Deployment Options

#### Option 1: Single Server (Recommended)

Deploy both API and frontend on the same server:

```bash
# Build the frontend
cd packages/adminify-ui
npm run build

# Start your CLI with the dev command
your-cli dev --port 3000
```

#### Option 2: Separate Frontend/Backend

Deploy the API and frontend separately:

1. **Backend (API Server)**
   ```bash
   your-cli dev --port 3000
   ```

2. **Frontend (Static Files)**
   ```bash
   cd packages/adminify-ui
   npm run build
   # Serve the dist/ folder with your preferred static file server
   ```

#### Option 3: Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["your-cli", "dev", "--port", "3000"]
```

### Reverse Proxy Setup (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔐 Security Best Practices

1. **JWT Secret**: Always set a strong `JWT_SECRET` environment variable in production
2. **HTTPS**: Use HTTPS in production environments
3. **User Management**: Only create user accounts for trusted administrators
4. **Network Security**: Consider restricting access to internal networks only
5. **Regular Updates**: Keep the plugin and dependencies updated

## 🛠 Development

### Project Structure

```
packages/adminify-plugin/
├── src/
│   ├── commands/          # Plugin commands
│   ├── hooks/             # oclif hooks for command discovery
│   ├── lib/               # Core libraries (auth, command parsing)
│   └── server/            # Fastify web server
└── README.md

packages/adminify-ui/      # React frontend
└── src/
    ├── components/        # React components
    ├── contexts/          # React contexts (auth)
    └── pages/             # Application pages
```

### Local Development

```bash
# Clone and install dependencies
git clone <your-repo>
cd your-repo
pnpm install

# Start development
cd packages/adminify-plugin
pnpm dev
```

## 🐛 Troubleshooting

### Commands Not Appearing

**Problem**: Your custom commands don't show up in the web interface.

**Solution**: 
- Ensure your commands are properly registered with oclif
- Check that commands are not marked as `hidden: true`
- Restart the dev server after adding new commands

### Authentication Issues

**Problem**: "Invalid token" errors or login failures.

**Solutions**:
- Check that `JWT_SECRET` is set consistently
- Clear browser localStorage and try logging in again
- Verify user was created successfully with `create-user`

### Port Already in Use

**Problem**: "Port 3000 is already in use" error.

**Solution**:
```bash
# Use a different port
your-cli dev --port 8080

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Errors

**Problem**: Frontend build fails or styling issues.

**Solutions**:
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires Node 16+)
- Ensure all peer dependencies are installed

## 📚 API Reference

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Command Endpoints

- `GET /api/commands` - List all available commands
- `POST /api/commands/execute` - Execute a command

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/adminify/issues)
- **Documentation**: [Full Documentation](https://github.com/your-org/adminify)
- **Community**: [Discussions](https://github.com/your-org/adminify/discussions)

---

Made with ❤️ for the CLI community. Transform your command-line tools into beautiful web experiences with zero effort.