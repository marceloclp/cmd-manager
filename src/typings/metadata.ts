export interface Metadata {
    /** A readable name for the command. */
    readonly name?: string

    /** A short description of what the command does or how it works. */
    readonly description?: string

    /** Examples of how to use the command. */
    readonly examples?: string[]

    /** An array containing relevant information about the arguments.  */
    readonly args?: {
        readonly key?: string
        readonly name?: string
        readonly type?: string
        readonly required?: boolean
    }[]

    /**
     * Similar to CLI commands, a command may also accept additional flags that
     * change the way the command is processed.
     * 
     * An example is the `-help` flag, which could return detailed instructions
     * on how to use the command.
     */
    readonly flags?: {
        readonly key?: string
        readonly name?: string
        readonly description?: string
    }[]
}

export type StringifyMetadataFn = (
    metadata: Metadata,
    commandName: string
) => string