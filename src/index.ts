import { StringifyMetadataFn, Command } from './typings'
import { stringifyMetadataFn } from './utils'
export * from './typings'

interface ManagerOptions {
    readonly stringifyMetadataFn?: StringifyMetadataFn
}

export class CommandManager {
    private readonly _cmds: Record<string, Command> = {}
    private _stringifyMetadataFn?: StringifyMetadataFn

    constructor(commands: Command[], options: ManagerOptions = {}) {
        for (const cmd of commands) this.register(cmd)
        this._stringifyMetadataFn = options.stringifyMetadataFn
    }

    /**
     * Returns an array containing all registered commands.
     */
    get cmds() {
        return Object.values(this._cmds)
    }

    /**
     * Registers a new command if no command with the same name already exists.
     * 
     * @param cmd - An object describing the command.
     * @throws when a command with the same name has already been registered.
     */
    register(cmd: Command) {
        if (cmd.command in this._cmds)
            throw new Error(`Duplicated command ${cmd.command}`)
        this._cmds[cmd.command] = cmd
    }

    /**
     * Unregisters a command.
     * 
     * @param commandName - The name of the command to be unregistered.
     */
    unregister(commandName: string) {
        delete this._cmds[commandName]
    }

    /**
     * Returns whether or not a command with the specified name exists.
     * 
     * @param commandName - The name of the command to search for.
     */
    has(commandName: string) {
        return commandName in this._cmds
    }

    /**
     * Returns the underlying command object.
     * 
     * @param commandName - The name of the command to be returned.
     */
    get(commandName: string): Command | undefined {
        return this._cmds[commandName]
    }

    /**
     * Checks if a message contains a specific command.
     * @param commandName - The name of the command to check.
     * @param message     - The message to check.
     */
    isCmdIn(commandName: string, message: string) {
        return this.has(commandName) && message.split(' ', 1)[0] === commandName
    }

    /**
     * Returns the command that is contained in a message, if it exists.
     * @param message - The message to be searched for a command.
     */
    getCmdIn(message: string) {
        return Object
            .values(this._cmds)
            .find(cmd => this.isCmdIn(cmd.command, message))
    }

    /**
     * If a message contains a command, returns the output of the `decompose`
     * function of that command.
     * @param message - The message to be decomposed into arguments.
     * @param commandName - An optional command name to restrict decomposition.
     */
    decompose(message: string, commandName?: string) {
        if (commandName && !this.isCmdIn(commandName, message))
            return null
        const cmd = commandName
            ? this.get(commandName)
            : this.getCmdIn(message)
        if (!cmd) return null
        const strippedMessage = message.substr(cmd.command.length + 1)
        return cmd.decompose?.(strippedMessage) || strippedMessage
    }

    /**
     * Checks if a user is allowed to run a command based on an array of groups
     * and the command's own groups.
     * 
     * If a user has at least one of the blocked groups, he will not be allowed
     * to use the command, even if he belongs to an allowed group.
     * 
     * @param commandName - The name of the command to check.
     * @param userGroups  - Array of strings containing the user groups.
     */
    isAllowed(commandName: string, userGroups: string[]) {
        if (!this.has(commandName))
            return false
        const { groups } = this.get(commandName) as Command

        const hash = userGroups.reduce((obj, group) => {
            return { ...obj, [group]: true }
        }, {} as Record<string, boolean>)

        if ((groups?.block || []).some(g => g in hash))
            return false

        return (
            !groups?.allow ||
            groups.allow.length === 0 ||
            groups.allow.some(g => g in hash)
        )
    }

    /**
     * Stringifies a command metadata to be displayed to a user.
     * 
     * If no stringify function has been specified on initialization, or as a
     * second argument, it will fallback to a markdown stringify function.
     * 
     * @param commandName - The name of the command to be stringified.
     * @param stringifyFn - An optional stringify function.
     */
    stringifyMetadata(commandName: string, stringifyFn?: StringifyMetadataFn) {
        const cmd = this.get(commandName)
        if (!cmd || !cmd.metadata)
            return undefined
        return (
            stringifyFn ||
            this._stringifyMetadataFn ||
            stringifyMetadataFn
        )(cmd.metadata, commandName)
    }
}