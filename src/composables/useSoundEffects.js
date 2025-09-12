import { ref } from 'vue'

export const useSoundEffects = () => {
  const isEnabled = ref(true)
  const spinSound = ref(null)
  const winSound = ref(null)
  const buttonClickSound = ref(null)
  const ambientSound = ref(null)

  // Initialize audio objects
  const initializeSounds = () => {
    try {
      // Create audio contexts for different sound effects
      spinSound.value = createSpinSound()
      winSound.value = createWinSound()
      buttonClickSound.value = createButtonClickSound()
      ambientSound.value = createAmbientSound()
    } catch (error) {
      console.warn('Audio initialization failed:', error)
    }
  }

  // Create spinning sound using HTML5 Audio API
  const createSpinSound = () => {
    try {
      const audio = new Audio('/spin.wav')
      audio.preload = 'auto'
      audio.loop = false
      audio.volume = 0.6
      
      return {
        audio,
        isPlaying: false
      }
    } catch (error) {
      console.warn('Failed to create spin sound:', error)
      return { audio: null, isPlaying: false }
    }
  }

  // Create win sound
  const createWinSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    return { audioContext, isPlaying: false }
  }

  // Create button click sound
  const createButtonClickSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    return { audioContext }
  }

  // Create ambient sound
  const createAmbientSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    return { audioContext, isPlaying: false }
  }

  // Play spinning sound
  const playSpinSound = () => {
    if (!isEnabled.value || !spinSound.value || !spinSound.value.audio) return
    
    try {
      const { audio } = spinSound.value
      
      // Reset audio to beginning and play
      audio.currentTime = 0
      
      const playPromise = audio.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            spinSound.value.isPlaying = true
          })
          .catch(error => {
            console.warn('Failed to play spin sound:', error)
          })
      }
      
      // Handle audio end event
      audio.onended = () => {
        spinSound.value.isPlaying = false
      }
      
    } catch (error) {
      console.warn('Failed to play spin sound:', error)
    }
  }

  // Stop spinning sound
  const stopSpinSound = () => {
    if (!spinSound.value || !spinSound.value.audio) return
    
    try {
      const { audio } = spinSound.value
      
      if (!audio.paused) {
        audio.pause()
        audio.currentTime = 0
      }
      
      spinSound.value.isPlaying = false
    } catch (error) {
      console.warn('Failed to stop spin sound:', error)
    }
  }

  // Play win sound based on celebration type
  const playWinSound = (celebrationType = 'default') => {
    if (!isEnabled.value || !winSound.value) return
    
    try {
      const { audioContext } = winSound.value
      
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
      
      // Create win sound sequence
      const gainNode = audioContext.createGain()
      gainNode.connect(audioContext.destination)
      
      let frequencies = []
      let duration = 0.8
      
      // Different win sounds based on celebration type
      switch (celebrationType) {
        case 'jackpot':
          frequencies = [523, 659, 784, 1047, 1319] // C major scale up
          duration = 1.5
          break
        case 'big-win':
          frequencies = [440, 554, 659, 880] // A major chord progression
          duration = 1.2
          break
        default:
          frequencies = [523, 659, 784] // Simple C major triad
          duration = 0.8
      }
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        oscillator.connect(gainNode)
        
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
        
        const startTime = audioContext.currentTime + (index * 0.15)
        const endTime = startTime + 0.3
        
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime)
        
        oscillator.start(startTime)
        oscillator.stop(endTime)
      })
    } catch (error) {
      console.warn('Failed to play win sound:', error)
    }
  }

  // Play button click sound
  const playButtonClick = () => {
    if (!isEnabled.value || !buttonClickSound.value) return
    
    try {
      const { audioContext } = buttonClickSound.value
      
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Quick click sound
      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.warn('Failed to play button click sound:', error)
    }
  }

  // Play ambient sound
  const playAmbientSound = () => {
    if (!isEnabled.value || !ambientSound.value || ambientSound.value.isPlaying) return
    
    try {
      const { audioContext } = ambientSound.value
      
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
      
      // Create subtle ambient background sound
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      const filter = audioContext.createBiquadFilter()
      
      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(110, audioContext.currentTime)
      
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(200, audioContext.currentTime)
      
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
      
      oscillator.start(audioContext.currentTime)
      
      ambientSound.value.oscillator = oscillator
      ambientSound.value.isPlaying = true
    } catch (error) {
      console.warn('Failed to play ambient sound:', error)
    }
  }

  // Stop ambient sound
  const stopAmbientSound = () => {
    if (!ambientSound.value || !ambientSound.value.isPlaying) return
    
    try {
      if (ambientSound.value.oscillator) {
        ambientSound.value.oscillator.stop()
        ambientSound.value.isPlaying = false
      }
    } catch (error) {
      console.warn('Failed to stop ambient sound:', error)
    }
  }

  // Toggle sound on/off
  const toggleSound = () => {
    isEnabled.value = !isEnabled.value
    
    if (!isEnabled.value) {
      stopSpinSound()
      stopAmbientSound()
    }
  }

  // Initialize sounds when composable is used
  initializeSounds()

  return {
    isEnabled,
    playSpinSound,
    stopSpinSound,
    playWinSound,
    playButtonClick,
    playAmbientSound,
    stopAmbientSound,
    toggleSound
  }
}