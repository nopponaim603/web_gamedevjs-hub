/**
 * Dice Quest — Configuration and Game Data
 */

window.DQ_CONFIG = {
    TILE_COUNT: 28,
    START_MONEY: 1500,
    PASS_GO_MONEY: 200,
    WIN_AMOUNT: 20000,
    PASS_TURN_LIMIT: 500,
    
    TILE_TYPES: {
        CORNER: 'corner',
        PROPERTY: 'property',
        CHANCE: 'chance',
        TAX: 'tax',
        JAIL: 'jail',
        FREEPARKING: 'freeparking',
    },

    PLAYER_NAMES: ['🟢 Player', '🔵 AI-1', '🟡 AI-2', '🔴 AI-3'],
    PLAYER_COLORS: ['#22c55e', '#3b82f6', '#eab308', '#ef4444'],
    PLAYER_ICONS: ['🟢', '🔵', '🟡', '🔴'],

    TILE_CONFIG: [
        { type: 'corner', label: 'GO', sub: '+$200', price: 0, rent: 0, group: null, icon: '🏠' },
        { type: 'property', label: 'Garden City', sub: '$60', price: 60, rent: 10, group: 'Garden', icon: '🏡' },
        { type: 'chance', label: 'CHANCE', sub: '', price: 0, rent: 0, group: null, icon: '❓' },
        { type: 'property', label: 'Forest Road', sub: '$80', price: 80, rent: 12, group: 'Garden', icon: '🏡' },
        { type: 'tax', label: 'Income Tax', sub: '$100', price: 100, rent: 0, group: null, icon: '💰' },
        { type: 'property', label: 'Seaside Place', sub: '$100', price: 100, rent: 15, group: 'Seaside', icon: '🏡' },
        { type: 'corner', label: 'VISIT', sub: 'JAIL', price: 0, rent: 0, group: null, icon: '⛓️' },
        { type: 'property', label: 'Mountain Lane', sub: '$120', price: 120, rent: 18, group: 'Mountain', icon: '🏡' },
        { type: 'property', label: 'Ocean Breeze', sub: '$140', price: 140, rent: 20, group: 'Seaside', icon: '🏡' },
        { type: 'chance', label: 'CHANCE', sub: '', price: 0, rent: 0, group: null, icon: '❓' },
        { type: 'property', label: 'Valley Farm', sub: '$160', price: 160, rent: 22, group: 'Mountain', icon: '🏡' },
        { type: 'corner', label: 'GO TO\nJAIL', sub: '', price: 0, rent: 0, group: null, icon: '🚔' },
        { type: 'property', label: 'Sunset Ave', sub: '$180', price: 180, rent: 25, group: 'Sunset', icon: '🏡' },
        { type: 'property', label: 'Lake Drive', sub: '$200', price: 200, rent: 28, group: 'Lake', icon: '🏡' },
        { type: 'chance', label: 'CHANCE', sub: '', price: 0, rent: 0, group: null, icon: '❓' },
        { type: 'property', label: 'Hill Manor', sub: '$220', price: 220, rent: 30, group: 'Lake', icon: '🏡' },
        { type: 'property', label: 'Creek Court', sub: '$240', price: 240, rent: 35, group: 'Sunset', icon: '🏡' },
        { type: 'freeparking', label: 'FREE', sub: 'PARKING', price: 0, rent: 0, group: null, icon: '🅿️' },
        { type: 'property', label: 'River Walk', sub: '$260', price: 260, rent: 38, group: 'River', icon: '🏡' },
        { type: 'tax', label: 'Luxury Tax', sub: '$150', price: 150, rent: 0, group: null, icon: '💎' },
        { type: 'property', label: 'Haven Point', sub: '$280', price: 280, rent: 42, group: 'River', icon: '🏡' },
        { type: 'chance', label: 'CHANCE', sub: '', price: 0, rent: 0, group: null, icon: '❓' },
        { type: 'property', label: 'Palace Terrace', sub: '$300', price: 300, rent: 45, group: 'River', icon: '🏡' },
        { type: 'property', label: 'Estate Grounds', sub: '$320', price: 320, rent: 50, group: 'River', icon: '🏡' },
        { type: 'corner', label: 'JAIL\nVISIT', sub: '', price: 0, rent: 0, group: null, icon: '🚔' },
        { type: 'property', label: 'Grand Plaza', sub: '$350', price: 350, rent: 55, group: 'Plaza', icon: '🏛️' },
        { type: 'property', label: 'Royal Court', sub: '$400', price: 400, rent: 60, group: 'Plaza', icon: '👑' },
        { type: 'property', label: 'Sky Tower', sub: '$350', price: 350, rent: 55, group: 'Plaza', icon: '🏰' },
    ],

    CHANCE_CARDS: [
        { text: '🎉 Found money! Go forward 3 spaces.', action: (p) => { p.position = (p.position + 3) % 28; } },
        { text: '💸 Bank error. Pay $50.', action: (p) => { p.money -= 50; } },
        { text: '🏦 Get $100 back.', action: (p) => { p.money += 100; } },
        { text: '🎮 Go to Jail.', action: (p) => { p.position = 10; p.jailed = true; p.jailTurns = 0; } },
        { text: '🏥 Hospital bill. Pay $150.', action: (p) => { p.money -= 150; } },
        { text: '🎓 Scholarship! Get $200.', action: (p) => { p.money += 200; } },
        { text: '🚗 Speeding fine. Pay $80.', action: (p) => { p.money -= 80; } },
        { text: '🏆 Lottery win! Get $300.', action: (p) => { p.money += 300; } },
    ]
};
