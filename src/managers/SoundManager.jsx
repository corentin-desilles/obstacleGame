import { useEffect, useMemo } from 'react'
import { useAudio } from '../stores/useAudio'
import { useGame } from '../stores/useGame'

function SoundManager() {
    const audio = useAudio(state => state.audio)
    const gamePhase = useGame(state => state.phase)

    const completeSound = useMemo(() => {
        const sound = new Audio('./sounds/complete.mp3')
        sound.volume = 0.3
        return sound
    }, [])

    const backgroundSound = useMemo(() => {
        const sound = new Audio('./sounds/backgroundMusic.mp3')
        sound.loop = true
        return sound
    }, [])

    useEffect(() => {
        if (gamePhase === 'ready') {
            backgroundSound.volume = 0.05
        }
        if (gamePhase === 'playing') {
            backgroundSound.volume = 0.05
            backgroundSound.play()
        }
        if (gamePhase === 'ended') {
            backgroundSound.volume = 0.2
            completeSound.currentTime = 0
            completeSound.play()
        }
    }, [gamePhase])

    useEffect(() => {
        backgroundSound.muted = !audio
        completeSound.muted = !audio
    }, [audio])

    return null
}

export { SoundManager }
