import { Command, Flags } from '@oclif/core'
import { CommandParser } from '../lib/command-parser.js'
import fs from 'fs/promises'
import path from 'path'

export default class Generate extends Command {
  static override description = 'Generate UI schema from CLI commands'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --output ./ui-schema.json',
  ]

  static override flags = {
    output: Flags.string({
      char: 'o',
      description: 'Output file path',
      default: './adminify-schema.json',
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Generate)

    this.log('Generating UI schema from CLI commands...')

    const schemas = CommandParser.getAllUISchemas()
    
    const output = {
      version: '1.0.0',
      generated: new Date().toISOString(),
      commands: schemas,
    }

    const outputPath = path.resolve(flags.output)
    
    try {
      await fs.writeFile(outputPath, JSON.stringify(output, null, 2))
      this.log(`✅ Schema generated successfully at: ${outputPath}`)
      this.log(`📊 Total commands: ${schemas.length}`)
    } catch (error: any) {
      this.error(`Failed to write schema file: ${error.message}`)
    }
  }
}