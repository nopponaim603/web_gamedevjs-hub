/**
 * Mogura Tatakanai — Configuration & Constants
 */

window.MOGURA_CONFIG = {
    STORAGE_KEY_SCORES: 'MoguraTatakanai_TopScores',
    STORAGE_KEY_MUTED: 'MoguraTatakanai_Muted',

    BASE_WIDTH: 360,
    BASE_HEIGHT: 640,
    GAME_DURATION: 30.0,

    MOLE_TYPES: {
        NORMAL: { name: 'Normal Mole', points: 100, sfx: 'normal' },
        GOLD: { name: 'Gold Mole', points: 300, sfx: 'gold' },
        BLACK: { name: 'Black Mole', points: -150, sfx: 'black' },
        WHITE: { name: 'White Mole', points: 500, sfx: 'white' }
    },

    BGM_TRACKS: ['bgm_01.mp3', 'bgm_02.mp3']
};
