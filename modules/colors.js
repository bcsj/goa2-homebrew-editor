
export var color_map = {
    red: "#c51a0d",
    blue: "#395acc", //"#1b3eb6",
    green: "#64b637",
    gold: "#d4aa14",
    silver: "#aaaaaa",
    purple: "#8148ae"
};

export function lightenColor(color, gamma) {
    var color_rgb = hexToRgb(color);
    Object.keys(color_rgb).forEach(function (k) {
        color_rgb[k] = parseInt(color_rgb[k] + gamma * (255 - color_rgb[k]));
    });
    return rgbToHex(color_rgb['r'], color_rgb['g'], color_rgb['b']);
}

export function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}
export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}