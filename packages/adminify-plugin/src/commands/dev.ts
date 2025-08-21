import { Command, Flags } from '@oclif/core'
import { startServer } from '../server/index.js'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default class Dev extends Command {
  static override description = 'Run the Adminify UI development server'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --port 4000',
  ]

  static override flags = {
    port: Flags.integer({
      char: 'p',
      description: 'Port to run the server on',
      default: 3000,
    }),
    'no-ui': Flags.boolean({
      description: 'Skip starting the UI development server',
      default: false,
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Dev)

    this.log(`Starting Adminify server on port ${flags.port}...`)
    
    await startServer(flags.port)

    if (!flags['no-ui']) {
      this.log('Starting UI development server...')
      
      const uiPath = path.join(__dirname, '..', '..', '..', 'adminify-ui')
      
      const uiProcess = spawn('pnpm', ['dev'], {
        cwd: uiPath,
        stdio: 'inherit',
        shell: true,
      })

      uiProcess.on('error', (error) => {
        this.error(`Failed to start UI server: ${error.message}`)
      })

      process.on('SIGINT', () => {
        uiProcess.kill()
        process.exit()
      })
    }
  }
}