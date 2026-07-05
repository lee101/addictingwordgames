// Game Audio Library - Unified procedural audio for all word games
// Includes background music, SFX, and ambient sounds

class GameAudio {
    constructor(opts = {}) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();

        this.sfxGain.connect(this.master);
        this.musicGain.connect(this.master);
        this.master.connect(this.ctx.destination);

        this.master.gain.value = opts.volume || 0.5;
        this.sfxGain.gain.value = opts.sfxVolume || 0.7;
        this.musicGain.gain.value = opts.musicVolume || 0.2;

        this.musicPlaying = false;
        this.currentSong = 0;
        this.noteIdx = 0;
        this.nextNote = 0;
        this.timer = null;

        this.reverb = this._createReverb();
    }

    _createReverb() {
        const convolver = this.ctx.createConvolver();
        const rate = this.ctx.sampleRate;
        const length = rate * 1.5;
        const impulse = this.ctx.createBuffer(2, length, rate);
        for (let ch = 0; ch < 2; ch++) {
            const data = impulse.getChannelData(ch);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
            }
        }
        convolver.buffer = impulse;
        return convolver;
    }

    resume() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }

    // --- SFX Methods ---

    tone(freq, dur, type = 'sine', vol = 0.3, dest = this.sfxGain) {
        this.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        osc.connect(gain);
        gain.connect(dest);
        osc.start();
        osc.stop(this.ctx.currentTime + dur);
    }

    noise(dur, vol = 0.1) {
        this.resume();
        const bufferSize = this.ctx.sampleRate * dur;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const src = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        src.buffer = buffer;
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        src.start();
    }

    // Type a letter
    type() {
        this.tone(800 + Math.random() * 400, 0.05, 'sine', 0.15);
    }

    // Correct answer - ascending arpeggio
    correct() {
        const base = 523.25;
        [0, 4, 7, 12].forEach((semi, i) => {
            setTimeout(() => {
                this.tone(base * Math.pow(2, semi/12), 0.15, 'sine', 0.25);
            }, i * 50);
        });
    }

    // Wrong answer - dissonant buzz
    wrong() {
        this.tone(150, 0.25, 'sawtooth', 0.2);
        this.tone(155, 0.25, 'sawtooth', 0.15);
    }

    // Hit/damage sound
    hit() {
        this.tone(200, 0.1, 'square', 0.2);
        this.noise(0.05, 0.15);
    }

    // Kill/destroy enemy
    kill() {
        this.tone(600, 0.1, 'sine', 0.2);
        setTimeout(() => this.tone(800, 0.1, 'sine', 0.25), 50);
        setTimeout(() => this.tone(1000, 0.15, 'triangle', 0.2), 100);
    }

    // Combo sound - pitch increases with combo
    combo(level) {
        const freq = 440 + level * 80;
        this.tone(freq, 0.08, 'sine', 0.2);
        this.tone(freq * 1.5, 0.08, 'sine', 0.15);
    }

    // Lose life
    loseLife() {
        this.tone(200, 0.3, 'sawtooth', 0.25);
        this.tone(150, 0.4, 'sawtooth', 0.2);
    }

    // Game over
    gameOver() {
        [400, 350, 300, 200].forEach((f, i) => {
            setTimeout(() => this.tone(f, 0.3, 'sawtooth', 0.2), i * 150);
        });
    }

    // Victory
    victory() {
        const notes = [523, 659, 784, 1047];
        notes.forEach((f, i) => {
            setTimeout(() => {
                this.tone(f, 0.2, 'sine', 0.25);
                this.tone(f * 0.5, 0.3, 'triangle', 0.15);
            }, i * 120);
        });
    }

    // Wave complete
    waveComplete() {
        [523, 659, 784].forEach((f, i) => {
            setTimeout(() => this.tone(f, 0.15, 'sine', 0.2), i * 80);
        });
    }

    // Build/place tower
    build() {
        this.tone(300, 0.1, 'square', 0.15);
        this.tone(450, 0.1, 'square', 0.15);
    }

    // Shoot projectile
    shoot() {
        this.tone(1200, 0.05, 'sine', 0.1);
        this.tone(800, 0.08, 'sine', 0.1);
    }

    // Tick/timer
    tick() {
        this.tone(1000, 0.02, 'sine', 0.1);
    }

    // Letter spawn
    spawn() {
        this.tone(400 + Math.random() * 200, 0.08, 'triangle', 0.1);
    }

    // Power up
    powerUp() {
        [400, 500, 600, 800].forEach((f, i) => {
            setTimeout(() => this.tone(f, 0.1, 'sine', 0.2), i * 40);
        });
    }

    // Button click
    click() {
        this.tone(600, 0.03, 'sine', 0.15);
    }

    // --- Background Music ---

    _noteFreq(note) {
        const notes = {
            'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77
        };
        return notes[note] || 440;
    }

    _playNote(freq, time, dur, vel = 0.3) {
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc2.type = 'sine';
        osc.frequency.value = freq;
        osc2.frequency.value = freq * 2;

        const att = 0.01, dec = 0.1, sus = 0.3, rel = 0.3;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(vel, time + att);
        gain.gain.linearRampToValueAtTime(sus * vel, time + att + dec);
        gain.gain.setValueAtTime(sus * vel, time + dur - rel);
        gain.gain.linearRampToValueAtTime(0, time + dur);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + dur);
        osc2.start(time);
        osc2.stop(time + dur);
    }

    _songs() {
        return [
            { name: "Peaceful Stream", tempo: 80, notes: [
                {n:'C4',d:0.5,v:0.2},{n:'E4',d:0.5,v:0.25},{n:'G4',d:0.5,v:0.2},{n:'E4',d:0.5,v:0.2},
                {n:'A4',d:1,v:0.3},{n:'G4',d:0.5,v:0.2},{n:'E4',d:0.5,v:0.2},{n:'C4',d:1,v:0.25},
                {n:'D4',d:0.5,v:0.2},{n:'F4',d:0.5,v:0.25},{n:'A4',d:0.5,v:0.2},{n:'F4',d:0.5,v:0.2},
                {n:'G4',d:1,v:0.3},{n:'E4',d:0.5,v:0.2},{n:'C4',d:0.5,v:0.2},{n:'G3',d:1,v:0.25}
            ]},
            { name: "Morning Breeze", tempo: 70, notes: [
                {n:'E4',d:1,v:0.25},{n:'G4',d:0.5,v:0.2},{n:'A4',d:0.5,v:0.2},{n:'B4',d:1,v:0.3},
                {n:'A4',d:0.5,v:0.2},{n:'G4',d:0.5,v:0.2},{n:'E4',d:2,v:0.25},{n:'D4',d:1,v:0.25},
                {n:'E4',d:0.5,v:0.2},{n:'G4',d:0.5,v:0.2},{n:'A4',d:1,v:0.3},{n:'G4',d:0.5,v:0.2},
                {n:'E4',d:0.5,v:0.2},{n:'C4',d:2,v:0.25}
            ]},
            { name: "Starlight", tempo: 60, notes: [
                {n:'C5',d:1.5,v:0.25},{n:'B4',d:0.5,v:0.2},{n:'A4',d:1,v:0.3},{n:'G4',d:1,v:0.25},
                {n:'E4',d:2,v:0.2},{n:'F4',d:1,v:0.25},{n:'G4',d:0.5,v:0.2},{n:'A4',d:0.5,v:0.2},
                {n:'G4',d:1,v:0.3},{n:'E4',d:1,v:0.25},{n:'C4',d:2,v:0.2},{n:'D4',d:1,v:0.25},
                {n:'E4',d:1,v:0.25},{n:'C4',d:2,v:0.3}
            ]},
            { name: "Gentle Rain", tempo: 75, notes: [
                {n:'A4',d:0.25,v:0.15},{n:'E4',d:0.25,v:0.15},{n:'C4',d:0.25,v:0.15},{n:'E4',d:0.25,v:0.15},
                {n:'A4',d:0.5,v:0.2},{n:'G4',d:0.5,v:0.2},{n:'E4',d:1,v:0.25},{n:'G4',d:0.25,v:0.15},
                {n:'D4',d:0.25,v:0.15},{n:'B3',d:0.25,v:0.15},{n:'D4',d:0.25,v:0.15},{n:'G4',d:0.5,v:0.2},
                {n:'F4',d:0.5,v:0.2},{n:'D4',d:1,v:0.25},{n:'E4',d:0.5,v:0.2},{n:'C4',d:0.5,v:0.2},
                {n:'G3',d:1,v:0.25},{n:'C4',d:2,v:0.3}
            ]},
            { name: "Ocean Waves", tempo: 65, notes: [
                {n:'E3',d:1,v:0.2},{n:'G3',d:1,v:0.2},{n:'C4',d:1.5,v:0.25},{n:'E4',d:0.5,v:0.2},
                {n:'G4',d:2,v:0.3},{n:'E4',d:1,v:0.2},{n:'C4',d:1,v:0.2},{n:'G3',d:2,v:0.25},
                {n:'A3',d:1,v:0.2},{n:'C4',d:1,v:0.2},{n:'E4',d:1.5,v:0.25},{n:'G4',d:0.5,v:0.2},
                {n:'A4',d:2,v:0.3},{n:'G4',d:1,v:0.2},{n:'E4',d:1,v:0.2},{n:'C4',d:2,v:0.25}
            ]},
            { name: "Fireflies", tempo: 90, notes: [
                {n:'G4',d:0.25,v:0.2},{n:'A4',d:0.25,v:0.2},{n:'G4',d:0.25,v:0.2},{n:'E4',d:0.25,v:0.2},
                {n:'D4',d:0.5,v:0.25},{n:'E4',d:0.5,v:0.2},{n:'G4',d:1,v:0.3},{n:'A4',d:0.25,v:0.2},
                {n:'B4',d:0.25,v:0.2},{n:'A4',d:0.25,v:0.2},{n:'G4',d:0.25,v:0.2},{n:'E4',d:0.5,v:0.25},
                {n:'D4',d:0.5,v:0.2},{n:'C4',d:1,v:0.3},{n:'E4',d:0.5,v:0.2},{n:'G4',d:0.5,v:0.2},
                {n:'A4',d:1,v:0.25},{n:'G4',d:1,v:0.3}
            ]}
        ];
    }

    _schedule() {
        const song = this._songs()[this.currentSong];
        const secPerBeat = 60 / song.tempo;

        while (this.nextNote < this.ctx.currentTime + 0.1) {
            const note = song.notes[this.noteIdx];
            const dur = note.d * secPerBeat;
            this._playNote(this._noteFreq(note.n), this.nextNote, dur, note.v);
            this.nextNote += dur;
            this.noteIdx = (this.noteIdx + 1) % song.notes.length;
        }
        this.timer = setTimeout(() => this._schedule(), 25);
    }

    startMusic(idx) {
        if (this.musicPlaying) return;
        this.resume();
        this.currentSong = idx !== undefined ? idx : this.currentSong;
        this.currentSong = this.currentSong % this._songs().length;
        this.musicPlaying = true;
        this.noteIdx = 0;
        this.nextNote = this.ctx.currentTime;
        this._schedule();
    }

    stopMusic() {
        this.musicPlaying = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    nextSong() {
        this.stopMusic();
        this.currentSong = (this.currentSong + 1) % this._songs().length;
        this.startMusic(this.currentSong);
    }

    getSongName() {
        return this._songs()[this.currentSong].name;
    }

    // Volume controls
    setVolume(v) { this.master.gain.value = Math.max(0, Math.min(1, v)); }
    setSfxVolume(v) { this.sfxGain.gain.value = Math.max(0, Math.min(1, v)); }
    setMusicVolume(v) { this.musicGain.gain.value = Math.max(0, Math.min(1, v)); }
}

// Legacy compatibility
class PianoMusicGenerator {
    constructor() {
        this._audio = new GameAudio();
    }
    start(idx) { this._audio.startMusic(idx); }
    stop() { this._audio.stopMusic(); }
    nextSong() { this._audio.nextSong(); }
    getCurrentSongName() { return this._audio.getSongName(); }
    setVolume(v) { this._audio.setMusicVolume(v); }
}

if (typeof window !== 'undefined') {
    window.GameAudio = GameAudio;
    window.PianoMusicGenerator = PianoMusicGenerator;
}
