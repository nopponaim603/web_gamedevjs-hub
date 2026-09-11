/**
 * VOLTA — Web Audio Synthesizer Engine (Storm, Lightning, Power Cables)
 */

export function createAudio() {
    let ctx = null;
    let masterGain = null;
    let isMuted = false;

    let humSource = null;
    let humFilter = null;
    let humGain = null;

    let windSource = null;
    let windFilter = null;
    let windGain = null;

    let stormSource = null;
    let stormFilter = null;
    let stormGain = null;

    let crackleSource = null;
    let crackleGain = null;

    let envSpeed = 0.3;
    let envWind = 0.0;
    let envStorm = 0.0;
    let envLightning = false;
    let lastWhooshTime = 0;

    function createNoiseBuffer(durationSec) {
        const sampleCount = Math.floor(ctx.sampleRate * durationSec);
        const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < sampleCount; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    function createLoopingNoise(noiseBuffer, filterConfig, initialGain) {
        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = filterConfig.type;
        filter.frequency.value = filterConfig.f;
        filter.Q.value = filterConfig.q || 0.7;

        const gainNode = ctx.createGain();
        gainNode.gain.value = initialGain;

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(masterGain);
        source.start();

        return [source, filter, gainNode];
    }

    function initAudioNodes() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        ctx = new AudioCtx();

        masterGain = ctx.createGain();
        masterGain.gain.value = isMuted ? 0.0 : 0.8;
        masterGain.connect(ctx.destination);

        const noise = createNoiseBuffer(2.5);

        // Power Line hum / wind
        [humSource, humFilter, humGain] = createLoopingNoise(noise, { type: 'highpass', f: 2400 }, 0.0);
        [windSource, windFilter, windGain] = createLoopingNoise(noise, { type: 'bandpass', f: 420, q: 1.2 }, 0.0);
        [stormSource, stormFilter, stormGain] = createLoopingNoise(noise, { type: 'bandpass', f: 900, q: 2.5 }, 0.0);

        // Crackle generator
        const crackleSourceNode = ctx.createBufferSource();
        crackleSourceNode.buffer = noise;
        crackleSourceNode.loop = true;

        const crackleFilter = ctx.createBiquadFilter();
        crackleFilter.type = 'highpass';
        crackleFilter.frequency.value = 5000;

        const shaper = ctx.createWaveShaper();
        const curve = new Float32Array(256);
        for (let j = 0; j < 256; j++) {
            const x = j / 128 - 1;
            curve[j] = Math.abs(x) > 0.92 ? Math.sign(x) : 0;
        }
        shaper.curve = curve;

        crackleGain = ctx.createGain();
        crackleGain.gain.value = 0.0;

        crackleSourceNode.connect(crackleFilter);
        crackleFilter.connect(shaper);
        shaper.connect(crackleGain);
        crackleGain.connect(masterGain);
        crackleSourceNode.start();
        crackleSource = crackleSourceNode;
    }

    function playTone(startTime, startFreq, endFreq, duration, waveType = 'sine', volume = 0.1, dest = masterGain) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = waveType;
        osc.frequency.setValueAtTime(startFreq, startTime);
        if (endFreq && endFreq !== startFreq) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + duration);
        }

        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
    }

    function playBurst(startTime, duration, cutoffFreq, volume, filterType = 'lowpass', q = 0.8) {
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(duration + 0.05);

        const filter = ctx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.setValueAtTime(cutoffFreq, startTime);
        filter.Q.value = q;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        noise.start(startTime);
        noise.stop(startTime + duration + 0.05);
    }

    return {
        get muted() {
            return isMuted;
        },
        setMuted(mute) {
            isMuted = !!mute;
            if (masterGain && ctx) {
                masterGain.gain.setTargetAtTime(isMuted ? 0.0 : 0.8, ctx.currentTime, 0.05);
            }
        },
        unlock() {
            try {
                if (!ctx) initAudioNodes();
                if (ctx && ctx.state === 'suspended') ctx.resume();
            } catch {}
        },
        setEnv(speed, wind, storm, isLiveLightning) {
            envSpeed = speed;
            envWind = wind;
            envStorm = storm;
            envLightning = isLiveLightning;
        },
        tick() {
            if (!ctx) return;
            const now = ctx.currentTime;
            if (humGain) humGain.gain.setTargetAtTime(0.02 + envSpeed * 0.09, now, 0.3);
            if (humFilter) humFilter.frequency.setTargetAtTime(1800 + envSpeed * 1800, now, 0.3);

            if (windGain) windGain.gain.setTargetAtTime(envWind * 0.16, now, 0.15);
            if (windFilter) windFilter.frequency.setTargetAtTime(300 + envWind * 500, now, 0.2);

            if (stormGain) stormGain.gain.setTargetAtTime(envStorm * 0.09, now, 0.08);
            if (stormFilter) stormFilter.frequency.setTargetAtTime(500 + envStorm * 1400, now, 0.1);

            if (crackleGain) crackleGain.gain.setTargetAtTime(envLightning ? 0.09 : 0.0, now, 0.03);
        },
        attach() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            playTone(now, 320, 180, 0.12, 'triangle', 0.18);
            playTone(now + 0.01, 640, 420, 0.08, 'square', 0.05);
            playBurst(now, 0.05, 3000, 0.12, 'highpass');
        },
        release() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            playBurst(now, 0.18, 1200, 0.16, 'bandpass', 1.5);
            playTone(now, 200, 90, 0.16, 'sine', 0.12);
        },
        miss() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            playTone(now, 180, 120, 0.08, 'square', 0.05);
        },
        whoosh(intensity = 0.5) {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            if (now - lastWhooshTime < 0.25) return;
            lastWhooshTime = now;
            playBurst(now, 0.3, 700 + intensity * 800, 0.08 + intensity * 0.1, 'bandpass', 2.0);
        },
        pickup(combo = 0) {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            const freq = 660 * Math.pow(1.06, Math.min(12, combo));
            playTone(now, freq, freq, 0.1, 'square', 0.06);
            playTone(now, freq * 2, freq * 2, 0.18, 'sine', 0.08);
        },
        gloves() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            [440, 554, 659, 880].forEach((f, i) => {
                playTone(now + i * 0.07, f, f, 0.25, 'triangle', 0.1);
            });
        },
        dodge() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            playTone(now, 880, 1760, 0.18, 'sawtooth', 0.06);
            playTone(now + 0.05, 1320, 1320, 0.3, 'sine', 0.1);
            playBurst(now, 0.12, 4000, 0.1, 'highpass');
        },
        strike(intensity = 1.0) {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            const w = Math.max(0.15, Math.min(1.0, intensity));
            playBurst(now, 0.09, 6000, 0.7 * w, 'highpass');
            playBurst(now + 0.02, 0.5, 900, 0.5 * w, 'lowpass');
            playBurst(now + 0.25, 2.2 + w * 1.5, 160, 0.55 * w, 'lowpass', 0.5);
            playTone(now, 60, 30, 1.6, 'sine', 0.35 * w);
        },
        rumble() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            playBurst(now, 2.5 + Math.random() * 2, 120 + Math.random() * 80, 0.18, 'lowpass', 0.6);
        },
        gust() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            playBurst(now, 1.2, 380, 0.22, 'bandpass', 1.1);
        },
        fried() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            playBurst(now, 0.6, 5000, 0.5, 'highpass');
            playTone(now, 1200, 60, 0.7, 'sawtooth', 0.25);
            playTone(now + 0.1, 90, 40, 1.2, 'square', 0.25);
        },
        crash() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            playBurst(now, 0.35, 500, 0.5, 'lowpass');
            playTone(now, 120, 40, 0.5, 'triangle', 0.35);
        },
        swallowed() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            playBurst(now, 2.0, 200, 0.5, 'lowpass', 0.7);
            playTone(now, 110, 35, 2.0, 'sawtooth', 0.2);
        },
        zone() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            [[262, 0.0], [330, 0.12], [392, 0.24], [523, 0.36]].forEach(([freq, offset]) => {
                playTone(now + offset, freq, freq, 0.6, 'sawtooth', 0.05);
                playTone(now + offset, freq * 0.5, freq * 0.5, 0.7, 'square', 0.04);
            });
        },
        start() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            playTone(now, 196, 196, 0.5, 'sawtooth', 0.06);
            playTone(now + 0.15, 294, 294, 0.5, 'sawtooth', 0.06);
        },
        ui() {
            if (!ctx || isMuted) return;
            const now = ctx.currentTime;
            playTone(now, 700, 500, 0.06, 'square', 0.05);
        }
    };
}
