const MockChannel = require('./mock_channel')
const MaryTTS = require('@yaps/tts').MaryTTS
const Storage = require('@yaps/storage')
const YWC = require('../src/ywc')

const assert = require('assert')

describe('YWC tests', () => {

    it('Test verb answer', done => {
        const channel = new MockChannel()
        const ywc = new YWC(channel)
        assert.equal(0, ywc.answer())
        done()
    })

    it('Test verb hangup', done => {
        const channel = new MockChannel()
        const ywc = new YWC(channel)
        assert.equal(1, ywc.hangup())
        done()
    })

    it('Test verb play', done => {
        const channel = new MockChannel()
        const ywc = new YWC(channel)
        channel.setData(['1'])
        const result = ywc.play('beep')
        assert.equal('1', result)

        try {
            ywc.play('beep', {finishOnKey: '%'})
            done('Error: Failed exception')
        } catch(e) {
        }

        done()
    })

    it.skip('Test verb say', done => {
        const channel = new MockChannel()
        const ywc = new YWC(channel)
        channel.setData(['1'])

        try {
            ywc.say('Hello World')
            done('Error: Failed exception')
        } catch(e) {
        }

        ywc.config({
            tts: new MaryTTS(),
            storage: new Storage()
        })

        ywc.say('Hello Raysa')
        done()
    })

    it('Test verb gather', done => {
        const channel = new MockChannel()
        const ywc = new YWC(channel)

        try {
            ywc.gather('', {finishOnKey: 'aa', maxDigits: 'p'})
            done('Error: Failed exception')
        } catch(e) {
        }

        try {
            ywc.gather('', {timeout: 0})
            done('Error: Failed exception')
        } catch(e) {
        }

        // Stops reading at maxDigits
        channel.setData(['1', '2', '3', '4'])
        let result = ywc.gather('', {maxDigits: 4})
        assert.equal('1234', result)

        // Stops reading at finishOnKey
        channel.setData(['1', '2', '3', '4', '*'])
        channel.resetDataPointer()
        result = ywc.gather('', {maxDigits: 6, finishOnKey: '*'})
        assert.equal('1234', result)

        // Stops reading at null because a timeout event
        channel.setData(['1', '2', '3', null])
        channel.resetDataPointer()
        result = ywc.gather('', {timeout: 5, maxDigits: 4})
        assert.equal('123', result)

        done()
    })

    it('Test verb wait', done => {
        const channel = new MockChannel()
        const ywc = new YWC(channel)

        try {
            ywc.wait(-1)
            done('Error: Failed exception')
        } catch(e) {
        }

        done()
    })

    it('Test verb record', done => {
        const channel = new MockChannel()

        const ywc = new YWC(channel)

        try {
            ywc.record({ beep: 'a' })
            done('Error: Failed exception')
        } catch(e) {
        }

        ywc.record()

        done()
    })

    it('Test verb stash', done => {
        const channel = new MockChannel()
        const ywc = new YWC(channel)
        ywc.stash('key1', 'val1')
        ywc.stash('key2', 'val2')
        ywc.stash('key1', 'val3')
        assert.equal(2, ywc.getCallDetailRecord().vars.size)
        done()
    })

})
