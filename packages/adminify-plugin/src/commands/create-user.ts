import { Args, Command, Flags } from '@oclif/core'
import { AuthService } from '../lib/auth.js'

export default class CreateUser extends Command {
  static override description = 'Create a new user account for the Adminify web UI'

  static override examples = [
    '<%= config.bin %> <%= command.id %> admin@example.com --password mypassword123',
    '<%= config.bin %> <%= command.id %> user@company.com -p securepassword',
  ]

  static override args = {
    email: Args.string({
      description: 'User email address',
      required: true,
    }),
  }

  static override flags = {
    password: Flags.string({
      char: 'p',
      description: 'User password (minimum 6 characters)',
      required: true,
    }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(CreateUser)

    if (flags.password.length < 6) {
      this.error('Password must be at least 6 characters long')
    }

    try {
      const user = await AuthService.createUser(args.email, flags.password)
      this.log(`✅ User created successfully:`)
      this.log(`   Email: ${user.email}`)
      this.log(`   User ID: ${user.id}`)
      this.log(`   Created: ${user.createdAt.toISOString()}`)
      this.log('')
      this.log('The user can now log in to the Adminify web UI using these credentials.')
    } catch (error: any) {
      if (error.message === 'User already exists') {
        this.error(`User with email "${args.email}" already exists`)
      }
      
      this.error(`Failed to create user: ${error.message}`)
    }
  }
}