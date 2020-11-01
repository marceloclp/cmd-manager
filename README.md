# Commands Manager for Bots

`cmd-manager` is a platform agnostic commands manager for bots, be it Discord, Slack, or any other platform.

Using `cmd-manager` is as simple as calling the `CommandManager` constructor and passing an array describing your commands.
```ts
const manager = new CommandsManager([{
    command: '!rolldice',
    decompose: (message: string) => {
        return { numOfSides: Number(message) }
    },
    groups: {
        allow: ['admin'],
        block: ['visitor']
    },
}])

// Checking if a message contains a command.
manager.isCmdIn('!rolldice', '!rolldice 20')   // => true
manager.isCmdIn('!rolldice', 'random message') // => false

// Getting the underlying command object in a message.
manager.getCmdIn('!rolldice 20')   // => { command: '!rolldice', ... }
manager.getCmdIn('random message') // => undefined

// Decomposing a message into its arguments.
manager.decompose('!rolldice 20') // => { numOfSides: 20 }

// Checking if a user has permissions to access a command.
manager.isAllowed('!rolldice', ['admin'])   // => true
manager.isAllowed('!rolldice', ['visitor']) // => false
```

## Installation
```bash
npm i cmd-manager
```

## Usage
* `cmds`: returns an array containing all registered commands.
* `register(cmd)`: registers a new command.
* `unregister(cmdName)`: unregisters the command that matches the name.
* `has(cmdName)`: checks if a command with the given name exists.
* `get(cmdName)`: returns the underlying object for the matching command.
* `isCmdIn(cmdName, message)`: checks if the specified command is being used.
* `getCmdIn(message)`: return the command being used in the message.
* `decompose(message, cmdName)`: decomposes the message into its arguments.
* `isAllowed(cmdName, userGroups)`: checks if a user has permission to use the command.
* `stringifyMetadata(cmdName)`: stringifies the metadata of a command in a user-friendly and readable way.