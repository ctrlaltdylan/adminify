import { Hook } from '@oclif/core'

export const hook: Hook<'init'> = async function (options) {
  const commands = Array.from(options.config.commands.values())
  
  const commandRegistry = commands.map((cmd) => ({
    id: cmd.id,
    description: cmd.description,
    aliases: cmd.aliases,
    examples: cmd.examples,
    flags: cmd.flags,
    args: cmd.args,
    hidden: cmd.hidden,
    strict: cmd.strict,
    plugin: cmd.pluginName,
    pluginType: cmd.pluginType,
  }))

  // Store both commands and config for later use
  ;(global as any).adminifyCommands = commandRegistry
  ;(global as any).adminifyConfig = options.config
}