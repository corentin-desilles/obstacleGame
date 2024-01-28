import { useKeyboardControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { addEffect } from '@react-three/fiber'
import { useGame } from './stores/useGame'
import { useAudio } from './stores/useAudio'
import UseAnimations from 'react-useanimations'
import volume from 'react-useanimations/lib/volume'

export default function Interface() {
    const time = useRef()

    const audio = useAudio(state => state.audio)
    const toggleAudio = useAudio(state => state.toggleAudio)

    const restart = useGame(state => state.restart)
    const phase = useGame(state => state.phase)
    const forward = useKeyboardControls(state => state.forward)
    const backward = useKeyboardControls(state => state.backward)
    const leftward = useKeyboardControls(state => state.leftward)
    const rightward = useKeyboardControls(state => state.rightward)
    const jump = useKeyboardControls(state => state.jump)

    useEffect(() => {
        const unsubscribeEffect = addEffect(() => {
            const state = useGame.getState()

            let elapsedTime = 0

            if (state.phase === 'playing')
                elapsedTime = Date.now() - state.startTime
            else if (state.phase === 'ended')
                elapsedTime = state.endTime - state.startTime

            elapsedTime /= 1000
            elapsedTime = elapsedTime.toFixed(2)

            if (time.current) time.current.textContent = elapsedTime
        })

        return () => {
            unsubscribeEffect()
        }
    }, [])

    function handleToggleAudio(e) {
        toggleAudio()
        //!!!!!!!!!!!!me renseigner plus sur blur/focus!!!!!!!!!!!!
        e.target.blur()
    }

    return (
        <div className="interface">
            {/* Audio  */}
            <button className="audio-toggle" onClick={handleToggleAudio}>
                <UseAnimations
                    animation={volume}
                    reverse={!audio}
                    strokeColor="white"
                />
            </button>

            {/* Time */}
            <div ref={time} className="time">
                0.00
            </div>

            {/* Auto restart */}
            {phase === 'ended' && (
                <div className="restart" onClick={restart}>
                    Restart
                </div>
            )}

            {/* Controls */}
            <div className="controls">
                <div className="raw">
                    <div className={`key ${forward ? 'active' : ''}`}></div>
                </div>
                <div className="raw">
                    <div className={`key ${leftward ? 'active' : ''}`}></div>
                    <div className={`key ${backward ? 'active' : ''}`}></div>
                    <div className={`key ${rightward ? 'active' : ''}`}></div>
                </div>
                <div className="raw">
                    <div className={`key large ${jump ? 'active' : ''}`}></div>
                </div>
            </div>
            <div className="misc-controls">
                <div className="misc-control">
                    <div className="key">R</div>
                    <div className="label">Reset</div>
                </div>
                <div className="misc-control">
                    <div className="key">M</div>
                    <div className="label">Mute/Unmute</div>
                </div>
            </div>
        </div>
    )
}
