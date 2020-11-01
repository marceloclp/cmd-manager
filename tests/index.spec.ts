import { CommandManager } from '../src'
import { stringifyMetadataFn } from '../src/utils'

const commandSample = {
    command: '!rolldice',
    decompose: (message: string) => {
        return { numOfSides: Number(message) }
    },
    groups: {
        allow: ['admin'],
        block: ['visitor'],
    },
    metadata: {
        description: 'Returns a random number between 1 and numOfSides.',
        args: [{ key: 'numOfSides' }]
    },
}

describe('CommangsManager', () => {
    let manager: CommandManager

    test('Is an instance of CommandsManager', () => {
        manager = new CommandManager([commandSample])
        expect(manager).toBeInstanceOf(CommandManager)
    })

    describe('Getters', () => {
        beforeAll(() => {
            manager = new CommandManager([commandSample])
        })

        test('cmds() should be an array', () => {
            expect(
                Array.isArray(manager.cmds)
            ).toBeTruthy()
        })
        
        test('cmds() should have a length of 1', () => {
            expect(
                manager.cmds.length
            ).toBe(1)
        })

        test('cmds() should have one command named !rolldice', () => {
            expect(
                manager.cmds.findIndex(cmd => cmd.command === '!rolldice')
            ).toBeGreaterThan(-1)
        })
    })

    describe('Base Methods', () => {
        beforeAll(() => {
            manager = new CommandManager([commandSample])
        })

        test('has() should return true for existing command', () => {
            expect(
                manager.has(commandSample.command)
            ).toBeTruthy()
        })

        test('has() should return false if command is not valid', () => {
            expect(
                manager.has('!invalid')
            ).toBeFalsy()
        })

        test('get() should return the underlying command object', () => {
            expect(
                manager.get(commandSample.command)
            ).toBe(commandSample)
        })

        test('get() should return undefined if command is not valid', () => {
            expect(
                manager.get('!invalid')
            ).toBeUndefined()
        })
    })

    describe('Managing commands', () => {
        beforeAll(() => {
            manager = new CommandManager([commandSample])
        })

        const COMMAND_NAME = '!random'

        test('register()', () => {
            manager.register({ command: COMMAND_NAME })
            expect(
                manager.has(COMMAND_NAME)
            ).toBeTruthy()
        })

        test('unregister()', () => {
            manager.unregister(COMMAND_NAME)
            expect(
                manager.has(COMMAND_NAME)
            ).toBeFalsy()
        })
    })

    describe('Interacting with messages', () => {
        beforeAll(() => {
            manager = new CommandManager([commandSample])
        })
        const CMD_NAME = commandSample.command
        const VALID_MESSAGE = '!rolldice 20'
        const INVALID_MESSAGE = 'random message body'

        test('isCmdIn() should return true if the specified command is in message', () => {
            expect(
                manager.isCmdIn(CMD_NAME, VALID_MESSAGE)
            ).toBeTruthy()
        })

        test('isCmdIn() should return false if the specified command is not in the message', () => {
            expect(
                manager.isCmdIn(CMD_NAME, INVALID_MESSAGE)
            ).toBeFalsy()
        })

        test('getCmdIn() should return the command being used in the message', () => {
            expect(
                manager.getCmdIn(VALID_MESSAGE)
            ).toBe(commandSample)
        })

        test('getCmdIn() should return undefined if no command exists in the message', () => {
            expect(
                manager.getCmdIn(INVALID_MESSAGE)
            ).toBeUndefined()
        })

        test('decompose() should run the decompose the message into its arguments', () => {
            expect(
                manager.decompose(VALID_MESSAGE)
            ).toEqual({ numOfSides: 20 })
        })

        test('decompose() should return null if a commandName is provided but doesnt match message', () => {
            expect(
                manager.decompose(INVALID_MESSAGE, CMD_NAME)
            ).toBeNull()
        })
    })

    describe('Guards', () => {
        beforeAll(() => {
            manager = new CommandManager([commandSample])
        })
        const CMD_NAME = commandSample.command

        test('isAllowed() should return true if user has 1 allowed group and 0 blocked groups', () => {
            expect(
                manager.isAllowed(CMD_NAME, ['admin'])
            ).toBeTruthy()
        })

        test('isAllowed() should return false if user has 0 allowed groups and cmd has groups', () => {
            expect(
                manager.isAllowed(CMD_NAME, ['user'])
            ).toBeFalsy()
        })

        test('isAllowed() should return false if user has 1+ blocked group', () => {
            expect(
                manager.isAllowed(CMD_NAME, ['visitor'])
            ).toBeFalsy()
        })

        test('isAllowed() should return false if user has at 1 allowed and 1 blocked group', () => {
            expect(
                manager.isAllowed(CMD_NAME, ['admin', 'visitor'])
            ).toBeFalsy()
        })
    })

    describe('Metadata', () => {
        beforeAll(() => {
            manager = new CommandManager([commandSample])
        })
        const CMD_NAME = commandSample.command

        test('stringifyMetadata() should return the metadata as a string', () => {
            expect(
                manager.stringifyMetadata(CMD_NAME)
            ).toBe(stringifyMetadataFn(commandSample.metadata, CMD_NAME))
        })

        test('stringifyMetadata() should return undefined when command doesnt exist', () => {
            expect(
                manager.stringifyMetadata('!invalid')
            ).toBeUndefined()
        })
    })
})