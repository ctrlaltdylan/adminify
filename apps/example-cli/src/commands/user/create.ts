import { Command, Flags } from '@oclif/core'

export default class UserCreate extends Command {
  static override description = 'Create a new user'

  static override examples = [
    '<%= config.bin %> <%= command.id %> --name "John Doe" --email john@example.com',
    '<%= config.bin %> <%= command.id %> --name "Jane Smith" --email jane@example.com --admin',
  ]

  static override flags = {
    name: Flags.string({
      char: 'n',
      description: 'User full name',
      required: true,
    }),
    email: Flags.string({
      char: 'e',
      description: 'User email address',
      required: true,
    }),
    admin: Flags.boolean({
      char: 'a',
      description: 'Grant admin privileges',
      default: false,
    }),
    department: Flags.string({
      char: 'd',
      description: 'User department',
      options: ['engineering', 'sales', 'marketing', 'hr', 'finance'],
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(UserCreate)

    this.log(`Creating user: ${flags.name}`)
    this.log(`Email: ${flags.email}`)
    this.log(`Admin: ${flags.admin}`)
    if (flags.department) {
      this.log(`Department: ${flags.department}`)
    }
  }
}