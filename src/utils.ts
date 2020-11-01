import { StringifyMetadataFn } from "./typings/metadata";

/**
 * Default function used to stringify metadata.
 * 
 * @param metadata    - The metadata to be stringified.
 * @param commandName - The name of the command that is being stringified.
 */
export const stringifyMetadataFn: StringifyMetadataFn = (metadata, commandName) => {
    const stringifiedCmd = '`' + [
        commandName,
        metadata.args
            ?.map(({ key }) => key && `<${key}>`)
            .filter(Boolean).join(' ')
    ].join(' ') + '`'

    return [
        stringifiedCmd,
        metadata.description && `| ${metadata.description}`,
    ].filter(Boolean).join(' ')
}