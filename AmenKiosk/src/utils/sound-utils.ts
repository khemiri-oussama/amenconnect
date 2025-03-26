/**
 * Utility functions for playing sounds in the kiosk application
 */

// Audio context for more efficient sound handling
let audioContext: AudioContext | null = null;

/**
 * Initialize audio context (must be called on user interaction)
 */
export const initAudioContext = (): void => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

/**
 * Audio buffer cache to avoid reloading sounds
 */
const audioBufferCache: Record<string, AudioBuffer> = {};

/**
 * Load audio file and cache it
 */
const loadAudio = async (url: string): Promise<AudioBuffer> => {
  if (!audioContext) {
    initAudioContext();
  }
  
  // Return from cache if available
  if (audioBufferCache[url]) {
    return audioBufferCache[url];
  }
  
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext!.decodeAudioData(arrayBuffer);
    audioBufferCache[url] = audioBuffer;
    return audioBuffer;
  } catch (error) {
    console.error('Error loading audio:', error);
    throw error;
  }
};

/**
 * Play a sound with optional volume control
 */
export const playSound = async (
  soundUrl: string, 
  volume = 1.0
): Promise<void> => {
  if (!audioContext) {
    initAudioContext();
  }
  
  try {
    const audioBuffer = await loadAudio(soundUrl);
    
    // Create a sound source
    const source = audioContext!.createBufferSource();
    source.buffer = audioBuffer;
    
    // Create a gain node for volume control
    const gainNode = audioContext!.createGain();
    gainNode.gain.value = volume;
    
    // Connect the source to the gain node and the gain node to the destination
    source.connect(gainNode);
    gainNode.connect(audioContext!.destination);
    
    // Play the sound
    source.start(0);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

/**
 * Play a button click sound
 */
export const playButtonSound = (): void => {
  // Base64 encoded short click sound (very small mp3)
  const clickSoundBase64 = 
    "data:audio/mp3;base64,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";

  playSound(clickSoundBase64, 0.5);
};

/**
 * Enable button sound on all buttons
 * This adds the sound to all buttons on the page
 */
export const enableButtonSounds = (): void => {
  // Initialize audio context
  initAudioContext();
  
  // Add click sound to all buttons
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    
    // Check if the clicked element is a button or has a button role
    if (
      target.tagName === 'BUTTON' || 
      target.closest('button') || 
      target.closest('ion-button') || 
      target.getAttribute('role') === 'button' ||
      target.closest('[role="button"]')
    ) {
      playButtonSound();
    }
  });
};

/**
 * Preload sounds for better performance
 */
export const preloadSounds = (): void => {
  // Base64 encoded short click sound
  const clickSoundBase64 = 
    "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwMD4+Pj4+PkxMTExMTFpaWlpaWmhoaGhoaHZ2dnZ2doSEhISEhJKSkpKSkqCgoKCgoK6urq6urrKysrKysr6+vr6+vsbGxsbGxtDQ0NDQ0N7e3t7e3urq6urq6vLy8vLy8v7+/v7+/v///////////////wAAAABMYXZjNTguMTM0AAAAAAAAAAAAAAAAJAZtAAAAAAAAHjOZTf9/AAAAAAAAAAAAAAAAAAAAAP/+xjAAAA0gAYAIQAbADS/ZX+XARQArgsGiwAB//vb+U/n/7v9v+f/2//u7JdikHQD8HwfB8HwfAAAAAAAAAAAAAAAA//8QeXicY2BmAAKG4rScxsIgBhFFQVAcBoYQRAABYmAZKMzKYGRgUmJWYFJSDDFXVVwNU1LUAOKCCLKKCkYGPj4+Pg4gzc/HKM7BwMjPrMBsZsZmxii+6/i4IOBmZ1xm5FNgZFFcGRtnaGoQxaLAYAAAwXkP1gAAAP/+xjAMAAAAJgGeAAABGwBfAAAAAAEIAgABAwDWQCkRIAAAAxW+7vJ9/7YX//UAAIBwfAB8P/4YODg4OCpUqVKlSpUQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQED/+xjCMAAAAJAGeAAABGABnAAAAAAEIAwABAwJSZEKERIAAgKh8JCUfvqGf/5YAAAwDAMDgf3///8VKlS61KlRUODg4OCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKj/+xjCiAAAAI4GeAAABFQBuAAAAAAEIBAAAQgMTtCOFRgEAACh0GXA5X/4P//+pAAIYDwAOEgIHCIP///y4A4GD7/cDe/lgYHBQcFBAcDBwMHAw+QCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkP/+xjC1AAAAI4GeQAABFACGAAAAAAEIBQABAwMDhAbFbgIAAAeHQyYnn/4P9v/6kAAgMD4CgYCAcJf/+FgEAgcL/yACn+JAIBwMfAwcDEgGHwMHAwfIAgICAgICAgICAgICAgICAgICAgICAj/+xjDFAAAAJIGeQAABGYCOAAAAAABCAYAAQITtCOGRIMAD64cDJiEIhTn+Cf//8sAAAQAwAHBQCDP//wQEg4P/LwMc//B/8sEBAQEBAQEBASEhISEhIQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAT/+xjDSAAAAJAGeQAABGACWAAAAAABCAcAAQIAW2Q2I1JECAHLZy8Ln/4P/b/+oAAAAYHwfB8HxYP///ywAAL/LAP/+WAQcHBQUHBQQEBAQEBAQEHwAkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkP/+xjDhAAAAJIGeSAABGQCeAAAAAABCAkAAQMDAHQhhVSMAAGQaDLiJAgUp/gP//+UAAAYAAA4SAgEL//CAIBwv/LgP/5YGA4KCgoKCgoICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAj/+xjDvAAAAJEGeSAABGYCmAAAAAABCAoAAQEDA7QyQqDAAAwcDAZYTaMP/H///JiRAADAYD4Pg+D4v//KgCQn/LQKP/LwUEBASEA4QCggHAwcDB8gAgICAgICAgICAgICAgICAgICAgICAgICAv/7GMO+AAAAkgZ5IAAEaAKYAAAAAAEICwABAwIDtDJCoMAADx0GGEBIACjMa//4n//6gCUTAEgwPA+D4Pi///KQBBb/LCg//Lg4ODgoKCgoICAgICAgIAAkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQk//sYw4wAAACPBnkgAARoApgAAAAAUggMAAEDAgO0MkKgwAAMHgwGWAGCf/w///0QLEEAAAAAOEgIGP//5UAqf8oFd/ysFBAQEhAOEAgIBwMHAw+QAgICAgICAgICAgICAgICAgICAgICAgICA";
  
  // Preload the sound by loading it into the cache
  loadAudio(clickSoundBase64).catch(err => console.error('Failed to preload sound:', err));
};
