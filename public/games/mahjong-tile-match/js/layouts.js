/**
 * Mahjong Tile Match — Layouts & Game Data
 */

window.MahjongData = (function () {
    const EMOJIS = ['🍎', '🍌', '🍉', '🍊', '🥝', '🫐', '🍇', '🍐', '🍓', '🍒', '🥑', '🥥'];
    const TRAY_SIZE = 7;

    function getTileDimensions() {
        const root = getComputedStyle(document.documentElement);
        const width = parseInt(root.getPropertyValue('--tile-width')) || 60;
        const height = parseInt(root.getPropertyValue('--tile-height')) || 70;
        return { width, height };
    }

    function createGridLayout(container, cols, rows, layers) {
        const { width: TILE_WIDTH, height: TILE_HEIGHT } = getTileDimensions();
        const layout = [];
        const startX = (container.clientWidth - cols * TILE_WIDTH) / 2;
        const startY = 40;

        for (let z = 0; z < layers; z++) {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    layout.push({
                        x: startX + c * TILE_WIDTH + (z * 4),
                        y: startY + r * TILE_HEIGHT + (z * 4),
                        z: z
                    });
                }
            }
        }
        return layout;
    }

    function createStackLayout(container) {
        const { width: TILE_WIDTH, height: TILE_HEIGHT } = getTileDimensions();
        const layout = [];
        const width = container.clientWidth || 360;
        const centerX = width / 2 - TILE_WIDTH / 2;
        const centerY = 100;

        for (let z = 0; z < 4; z++) {
            const size = 5 - z;
            const startX = centerX - (size - 1) * TILE_WIDTH / 2;
            const startY = centerY + z * 10;
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    layout.push({
                        x: startX + c * TILE_WIDTH,
                        y: startY + r * TILE_HEIGHT,
                        z: z
                    });
                }
            }
        }
        return layout;
    }

    function createMahjongLayout(container) {
        const { width: TILE_WIDTH, height: TILE_HEIGHT } = getTileDimensions();
        const layout = [];
        const width = container.clientWidth || 360;
        const height = container.clientHeight || 500;

        for (let z = 0; z < 3; z++) {
            const size = 6 - z;
            const startX = (width - size * TILE_WIDTH) / 2;
            const startY = 50 + z * 5;

            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if ((r + c) % 2 === 0) {
                        layout.push({
                            x: startX + c * TILE_WIDTH,
                            y: startY + r * TILE_HEIGHT,
                            z: z
                        });
                    }
                }
            }
        }

        const cornerSize = 2;
        const offsets = [
            { x: 10, y: 10 },
            { x: width - TILE_WIDTH * 2 - 10, y: 10 },
            { x: 10, y: height - TILE_HEIGHT * 2 - 150 },
            { x: width - TILE_WIDTH * 2 - 10, y: height - TILE_HEIGHT * 2 - 150 }
        ];

        offsets.forEach(offset => {
            for (let z = 0; z < 5; z++) {
                for (let r = 0; r < cornerSize; r++) {
                    for (let c = 0; c < cornerSize; c++) {
                        layout.push({
                            x: offset.x + c * (TILE_WIDTH / 2) + (z * 2),
                            y: offset.y + r * (TILE_HEIGHT / 2) + (z * 2),
                            z: z + 5
                        });
                    }
                }
            }
        });

        return layout;
    }

    function getLevelLayout(container, level) {
        if (level === 1) return createGridLayout(container, 4, 4, 3);
        if (level === 2) return createStackLayout(container);
        return createMahjongLayout(container);
    }

    return {
        EMOJIS,
        TRAY_SIZE,
        getTileDimensions,
        getLevelLayout
    };
})();
