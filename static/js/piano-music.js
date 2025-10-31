// Peaceful Piano Background Music Generator
// Uses Web Audio API to create soothing piano melodies

class PianoMusicGenerator {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.connect(this.audioCtx.destination);
        this.masterGain.gain.value = 0.15;
        this.isPlaying = false;
        this.currentSongIndex = 0;
        this.scheduledNotes = [];
        this.nextNoteTime = 0;
        this.lookahead = 25.0;
        this.scheduleAheadTime = 0.1;
        this.noteIndex = 0;
        this.timerID = null;
    }

    // Piano note frequencies (A0 to C8)
    getNoteFrequency(note) {
        const notes = {
            'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
            'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51
        };
        return notes[note] || 440;
    }

    // Create a piano-like sound with ADSR envelope
    playPianoNote(frequency, startTime, duration, velocity = 0.3) {
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        // Add subtle harmonics for piano-like timbre
        osc.type = 'triangle';
        osc.frequency.value = frequency;

        // ADSR envelope for piano
        const attack = 0.01;
        const decay = 0.1;
        const sustain = 0.3;
        const release = 0.3;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(velocity, startTime + attack);
        gainNode.gain.linearRampToValueAtTime(sustain * velocity, startTime + attack + decay);
        gainNode.gain.setValueAtTime(sustain * velocity, startTime + duration - release);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);

        return { osc, gainNode };
    }

    // Hardcoded peaceful songs
    getSongs() {
        return [
            {
                name: "Peaceful Stream",
                tempo: 80,
                notes: [
                    // Gentle flowing melody
                    { note: 'C4', duration: 0.5, velocity: 0.2 },
                    { note: 'E4', duration: 0.5, velocity: 0.25 },
                    { note: 'G4', duration: 0.5, velocity: 0.2 },
                    { note: 'E4', duration: 0.5, velocity: 0.2 },
                    { note: 'A4', duration: 1, velocity: 0.3 },
                    { note: 'G4', duration: 0.5, velocity: 0.2 },
                    { note: 'E4', duration: 0.5, velocity: 0.2 },
                    { note: 'C4', duration: 1, velocity: 0.25 },

                    { note: 'D4', duration: 0.5, velocity: 0.2 },
                    { note: 'F4', duration: 0.5, velocity: 0.25 },
                    { note: 'A4', duration: 0.5, velocity: 0.2 },
                    { note: 'F4', duration: 0.5, velocity: 0.2 },
                    { note: 'G4', duration: 1, velocity: 0.3 },
                    { note: 'E4', duration: 0.5, velocity: 0.2 },
                    { note: 'C4', duration: 0.5, velocity: 0.2 },
                    { note: 'G3', duration: 1, velocity: 0.25 },
                ]
            },
            {
                name: "Morning Breeze",
                tempo: 70,
                notes: [
                    // Calm morning melody
                    { note: 'E4', duration: 1, velocity: 0.25 },
                    { note: 'G4', duration: 0.5, velocity: 0.2 },
                    { note: 'A4', duration: 0.5, velocity: 0.2 },
                    { note: 'B4', duration: 1, velocity: 0.3 },
                    { note: 'A4', duration: 0.5, velocity: 0.2 },
                    { note: 'G4', duration: 0.5, velocity: 0.2 },
                    { note: 'E4', duration: 2, velocity: 0.25 },

                    { note: 'D4', duration: 1, velocity: 0.25 },
                    { note: 'E4', duration: 0.5, velocity: 0.2 },
                    { note: 'G4', duration: 0.5, velocity: 0.2 },
                    { note: 'A4', duration: 1, velocity: 0.3 },
                    { note: 'G4', duration: 0.5, velocity: 0.2 },
                    { note: 'E4', duration: 0.5, velocity: 0.2 },
                    { note: 'C4', duration: 2, velocity: 0.25 },
                ]
            },
            {
                name: "Starlight",
                tempo: 60,
                notes: [
                    // Slow, dreamy melody
                    { note: 'C5', duration: 1.5, velocity: 0.25 },
                    { note: 'B4', duration: 0.5, velocity: 0.2 },
                    { note: 'A4', duration: 1, velocity: 0.3 },
                    { note: 'G4', duration: 1, velocity: 0.25 },
                    { note: 'E4', duration: 2, velocity: 0.2 },

                    { note: 'F4', duration: 1, velocity: 0.25 },
                    { note: 'G4', duration: 0.5, velocity: 0.2 },
                    { note: 'A4', duration: 0.5, velocity: 0.2 },
                    { note: 'G4', duration: 1, velocity: 0.3 },
                    { note: 'E4', duration: 1, velocity: 0.25 },
                    { note: 'C4', duration: 2, velocity: 0.2 },

                    { note: 'D4', duration: 1, velocity: 0.25 },
                    { note: 'E4', duration: 1, velocity: 0.25 },
                    { note: 'C4', duration: 2, velocity: 0.3 },
                ]
            },
            {
                name: "Gentle Rain",
                tempo: 75,
                notes: [
                    // Rain-like pattern
                    { note: 'A4', duration: 0.25, velocity: 0.15 },
                    { note: 'E4', duration: 0.25, velocity: 0.15 },
                    { note: 'C4', duration: 0.25, velocity: 0.15 },
                    { note: 'E4', duration: 0.25, velocity: 0.15 },
                    { note: 'A4', duration: 0.5, velocity: 0.2 },
                    { note: 'G4', duration: 0.5, velocity: 0.2 },
                    { note: 'E4', duration: 1, velocity: 0.25 },

                    { note: 'G4', duration: 0.25, velocity: 0.15 },
                    { note: 'D4', duration: 0.25, velocity: 0.15 },
                    { note: 'B3', duration: 0.25, velocity: 0.15 },
                    { note: 'D4', duration: 0.25, velocity: 0.15 },
                    { note: 'G4', duration: 0.5, velocity: 0.2 },
                    { note: 'F4', duration: 0.5, velocity: 0.2 },
                    { note: 'D4', duration: 1, velocity: 0.25 },

                    { note: 'E4', duration: 0.5, velocity: 0.2 },
                    { note: 'C4', duration: 0.5, velocity: 0.2 },
                    { note: 'G3', duration: 1, velocity: 0.25 },
                    { note: 'C4', duration: 2, velocity: 0.3 },
                ]
            }
        ];
    }

    scheduler() {
        const song = this.getSongs()[this.currentSongIndex];
        const secondsPerBeat = 60.0 / song.tempo;

        while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
            const note = song.notes[this.noteIndex];
            const freq = this.getNoteFrequency(note.note);
            const duration = note.duration * secondsPerBeat;

            this.playPianoNote(freq, this.nextNoteTime, duration, note.velocity);

            this.nextNoteTime += duration;
            this.noteIndex++;

            if (this.noteIndex >= song.notes.length) {
                this.noteIndex = 0;
            }
        }

        this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
    }

    start(songIndex = 0) {
        if (this.isPlaying) return;

        this.currentSongIndex = songIndex % this.getSongs().length;
        this.isPlaying = true;
        this.noteIndex = 0;
        this.nextNoteTime = this.audioCtx.currentTime;
        this.scheduler();
    }

    stop() {
        this.isPlaying = false;
        if (this.timerID) {
            clearTimeout(this.timerID);
            this.timerID = null;
        }
    }

    setVolume(volume) {
        this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }

    nextSong() {
        this.stop();
        this.currentSongIndex = (this.currentSongIndex + 1) % this.getSongs().length;
        this.start(this.currentSongIndex);
    }

    getCurrentSongName() {
        return this.getSongs()[this.currentSongIndex].name;
    }
}

// Export for use in games
if (typeof window !== 'undefined') {
    window.PianoMusicGenerator = PianoMusicGenerator;
}
