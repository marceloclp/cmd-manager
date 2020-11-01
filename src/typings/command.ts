import { Metadata } from "./metadata";

export interface Command {
    /**
     * The actual command identifier, including the prefix, if desired.
     * A message should always start with the command in order to be valid.
     * 
     * Examples are `!help` or `!rolldice`.
     */
    readonly command: string

    /**
     * An optional function that decomposes a message into its arguments.
     */
    readonly decompose?: (message: string) => Record<string, any>

    /**
     * A command may only be accessible for certain user groups, like
     * administrators, moderators, etc.
     * 
     * A user is only allowed to use a command if it contains at least one
     * allowed group and none of the blocked groups.
     */
    readonly groups?: {
        readonly allow?: string[]
        readonly block?: string[]
    }

    /** Additional information about the command that does not affect usage. */
    readonly metadata?: Metadata
}