import Fastify from 'fastify'
import cors from '@fastify/cors'
import staticPlugin from '@fastify/static'
import jwt from '@fastify/jwt'
import auth from '@fastify/auth'
import path from 'path'
import { fileURLToPath } from 'url'
import { CommandParser } from '../lib/command-parser.js'
import { AuthService } from '../lib/auth.js'

// Type declaration for authenticate decorator
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function executeCommand(commandId: string, args: Record<string, any>, flags: Record<string, any>): Promise<string> {
  const config = (global as any).adminifyConfig
  
  if (!config) {
    throw new Error('CLI config not available')
  }

  // Build argv array for oclif
  const argv = [commandId]
  
  // Add positional arguments
  Object.entries(args).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      argv.push(value)
    }
  })
  
  // Add flags
  Object.entries(flags).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      if (typeof value === 'boolean') {
        if (value) {
          argv.push(`--${key}`)
        }
      } else {
        argv.push(`--${key}`)
        argv.push(value)
      }
    }
  })

  console.log('Executing oclif command:', argv.join(' '))

  // Capture stdout by temporarily replacing process.stdout.write
  let output = ''
  const originalWrite = process.stdout.write
  const originalLog = console.log
  
  // Override stdout to capture output
  const captureWrite = function(this: any, chunk: any) {
    if (typeof chunk === 'string') {
      output += chunk
    }
    return true
  }
  
  const captureLog = (...args: any[]) => {
    output += args.join(' ') + '\n'
  }

  try {
    // Replace output functions
    process.stdout.write = captureWrite as any
    console.log = captureLog

    // Execute the command using oclif's runCommand
    await config.runCommand(commandId, argv.slice(1))
    
    return output.trim() || 'Command executed successfully'
  } catch (error: any) {
    throw new Error(`Command failed: ${error.message}`)
  } finally {
    // Restore original functions
    process.stdout.write = originalWrite
    console.log = originalLog
  }
}

export async function createServer(port = 3000) {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
  })

  // Register JWT
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  })

  // Register auth plugin
  await fastify.register(auth)

  // JWT verification decorator
  fastify.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  // Auth routes

  fastify.post('/api/auth/login', async (request, reply) => {
    const { email, password } = request.body as any

    if (!email || !password) {
      reply.code(400)
      return { error: 'Email and password are required' }
    }

    try {
      const user = await AuthService.authenticateUser(email, password)
      
      if (!user) {
        reply.code(401)
        return { error: 'Invalid credentials' }
      }

      const token = fastify.jwt.sign({ userId: user.id, email: user.email })
      
      return { 
        user: { id: user.id, email: user.email },
        token 
      }
    } catch (error) {
      reply.code(500)
      return { error: 'Login failed' }
    }
  })

  fastify.get('/api/auth/me', {
    preHandler: fastify.auth([fastify.authenticate])
  }, async (request: any, reply) => {
    const user = await AuthService.getUserById(request.user.userId)
    
    if (!user) {
      reply.code(404)
      return { error: 'User not found' }
    }

    return { user: { id: user.id, email: user.email } }
  })

  fastify.get('/api/commands', async (request, reply) => {
    const commands = CommandParser.getAllUISchemas()
    return { commands }
  })

  fastify.get('/api/commands/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const command = CommandParser.getCommandById(id)
    
    if (!command) {
      reply.code(404)
      return { error: 'Command not found' }
    }

    const uiSchema = CommandParser.transformToUISchema(command)
    return { command: uiSchema }
  })

  fastify.post('/api/execute', {
    preHandler: fastify.auth([fastify.authenticate])
  }, async (request: any, reply) => {
    const { commandId, args, flags } = request.body as any
    
    try {
      const output = await executeCommand(commandId, args, flags)
      return {
        success: true,
        output,
        commandId,
        executedBy: request.user.email,
      }
    } catch (error: any) {
      reply.code(500)
      return {
        success: false,
        error: error.message,
        commandId,
      }
    }
  })

  const uiPath = path.join(__dirname, '..', '..', '..', 'adminify-ui', 'dist')
  
  try {
    await fastify.register(staticPlugin, {
      root: uiPath,
      prefix: '/',
    })
  } catch (error) {
    console.log('UI dist not found, skipping static file serving')
  }

  return fastify
}

export async function startServer(port = 3000) {
  const server = await createServer(port)
  
  try {
    await server.listen({ port, host: '0.0.0.0' })
    console.log(`Server listening on http://localhost:${port}`)
    console.log(`API available at http://localhost:${port}/api/commands`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }

  return server
}