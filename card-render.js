
var canvas;
var ctx;

var gfx = {};

const gfxLoadedEvent = new Event("gfx ready");

function loadGFX() {
    var load = {
        gear: "svg/gear.svg",
        initiative: "icons/initiative.png",
        attack: "icons/attack.png",
        defense: "icons/defense.png",
        defenseSkill: "icons/defense-skill.png",
        skill: "icons/skill.png",
        movement: "icons/movement.png",
        radius: "icons/radius.png",
        range: "icons/range.png",
        'item-radius': "svg/item-radius.svg",
        'item-range': "svg/item-range.svg",
        'item-movement': "svg/item-movement.svg",
        'item-attack': "svg/item-attack.svg",
        'item-defense': "svg/item-defense.svg",
        'item-initiative': "svg/item-initiative.svg",
        art: "OIG._sU2.jpeg",
    };
    var nAssets = Object.keys(load).length;

    var nAssetsLoaded = 0;
    for (var img in load) {
        gfx[img] = new Image();
        gfx[img].src = load[img];
        gfx[img].onload = function () {
            // Run render() when last asset loads
            if (++nAssetsLoaded == nAssets) {
                document.dispatchEvent(gfxLoadedEvent);
            }
        }
    }
}

var colorMap = {
    textbox: {
        bg: "#ccd2cd",
        border: "#616563"
    },
    banner: {
        border: "#616563" //["#464646", "#9a9a9a"]
    },
    namebox: {
        bg: "#cbc8bc",
        border: ["#464646", "#9a9a9a"]
    },
    background: {
        bg: "#2e2e2e",
        border: "#adadad"
    },
    readability: {
        bg: "#828282",
        border: "#202020"
    },
    red: "#c51a0d",
    blue: "#395acc", //"#1b3eb6",
    green: "#64b637",
    gold: "#d4aa14",
    silver: "#aaaaaa",
    purple: "#8148ae"
};

var font = "ModestoPosterW05-Regular";
var textFont = "Arial";

function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('DOMContentLoaded',function () {
    canvas = document.getElementById("card");
    ctx = canvas.getContext("2d");
    document.addEventListener('gfx ready', function(e) {
        render(card);
    });
    loadGFX();
});

function render(card) {
    console.log("Running render!");
    var color = colorMap[card.color] + "ff";

    var bleed = card_setting.canvas.bleed;
    canvas.width = layout.canvas.width + 2*bleed;
    canvas.height = layout.canvas.height + 2*bleed;
    ctx.save();
    ctx.translate(bleed, bleed);

    clearCanvas(ctx, canvas);

    render_art(ctx);
    render_bg_upper(ctx, bleed);
    render_bg_lower(ctx, bleed);
    
    
    if (Object.keys(card).indexOf('initiative') > -1) {
        render_namebox(ctx);
        render_banner(ctx, card, color, bleed);
        render_name(ctx, card);
    } else {
        render_namebox(ctx, true);
        render_name(ctx, card, true);
    }
    
    render_readability(ctx, card);
    render_tier(ctx, card);

    render_text(ctx, card, color);
    ctx.restore();
}

function render_art(ctx) {
    var x = 0;
    var y = 0;
    var shiftX = 200;
    var shiftY = -0;
    var scale = 1.00;

    ctx.drawImage(gfx.art, x-shiftX, y-shiftY, scale*gfx.art.width, scale*gfx.art.height);
}

function render_subtype(ctx, y, subtype, value, color) {
    var sz, x, imgsz;
    sz = 115;
    if (subtype == "range") {
        imgsz = sz;
        x = 630 - sz - 17;
        y -= 92;
        shiftImgY = 2;
    } else if (subtype == "radius") {
        imgsz = sz + 15;
        x = 630 - sz - 23;
        y -= 92;
        shiftImgY = 10;
    } else {
        return;
    }
    var strokesize = 8;

    ctx.font = "80px " + font;
    // Draw icon
    drawColored(ctx, gfx[subtype], x, y + shiftImgY, imgsz, imgsz, color);
    
    // Write value
    textMeas = ctx.measureText(value);

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = strokesize;
    x += imgsz/2 - textMeas.width/2;
    y += sz/2 + textMeas.actualBoundingBoxAscent/2;
    ctx.strokeText(value, x, y);
    ctx.fillText(value, x, y);

}

function render_primary(ctx, y, type, value, color) {
    var x = 17;
    var sz = 115;
    y -= 16*sz/20;
    var strokesize = 8;

    ctx.font = "80px " + font;;
    // Draw icon
    drawColored(ctx, gfx[type], x, y, sz, sz, color);
    
    if (type != "skill") {
        // Write value
        textMeas = ctx.measureText(value);
    
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = strokesize;
        x += sz/2 - textMeas.width/2;
        y += sz/2 + textMeas.actualBoundingBoxAscent/2;
        ctx.strokeText(value, x, y);
        ctx.fillText(value, x, y);
    }
}

// ===================================================================
// SETTINGS - NEEDS TO BE MOVED ELSEWHERE
var card_setting = {
    canvas: {
        bleed: 0
    },
    textbox: {
        space: 6.5,
        line_height: 34,
        padding: {
            top: 15,
            bottom: 15,
            left: 15,
            right: 15
        },
        width: 550,
        text: {
            font: "26px Arial",
            color: "black"
        }
    }
};

// LAYOUT CONSTANTS
const layout = {
    canvas: {
        height: 880,
        width: 630
    },
    textbox: {
        minPad: 10,
        mid: 315,
        bottom: 775,
        item_shift: 55,
    },
};
// ===================================================================

function render_text(ctx, card, color) {
    var text = card.text;
    var item = "";
    if (card.hasOwnProperty('item')) {
        item = card.item;
    }
    var settings = card_setting.textbox;

    var textBoxBottom = layout.textbox.bottom;
    textBoxBottom += (item == "") ? layout.textbox.item_shift : 0;

    // Analyze text
    ctx.font = settings.text.font;
    var textArr = text.split(" ");
    var newlineAfter = process_linebreaks(textArr);
    var boldWords = process_bold(textArr);
    var wordWidths = process_wordWidths(ctx, textArr, boldWords);
    var lineWords, lineWidth;
    [lineWords, lineWidth] = process_lineWords_lineWidth(wordWidths, newlineAfter, settings);
    var alignment = process_alignment(textArr, wordWidths, lineWords, lineWidth, settings);

    // Create textbox
    var minPad = layout.textbox.minPad;
    var topPad = minPad + settings.padding.top;
    var botPad = minPad + settings.padding.bottom;
    var nlines = lineWords.length;
    var height = nlines * settings.line_height + topPad + botPad;
    render_textbox(ctx, card, color, textBoxBottom, height);
    
    // Fill in the text
    ctx.font = settings.text.font;
    ctx.fillStyle = settings.text.color;
    var x = layout.textbox.mid;
    var y = textBoxBottom - height + topPad + minPad + settings.line_height/2;
    process_fillTextBox(ctx, x, y, wordWidths, lineWidth, lineWords, alignment, boldWords, textArr, color, settings);

    // Render item
    render_item(ctx, item);
}

function process_fillTextBox(ctx, x, y,
        wordWidths, lineWidth, 
        lineWords, alignment,
        boldWords, textArr,
        color, settings)
{
    const lineHeight = settings.line_height;
    const space = settings.space;
    const font = ctx.font.replace('bold','').trim();
    const nlines = lineWidth.length;
    const symbols = [':atk:',':def:',':ini:',':mov:',':rad:',':rng:'];
    const symsz = 40;

    var i = 0;
    for (line = 0; line < nlines; line++) {
        var posx = x - alignment[line];
        var posy = y + line * lineHeight;
        for (var j = 0; j < lineWords[line]; j++) {
            if (boldWords[i])
                ctx.font = "bold " + font;
            
            if (symbols.indexOf(textArr[i]) > -1) {
                let sym = textArr[i].slice(1, -1);
                let symshiftX = space/2;
                let symshiftY = 5*lineHeight/6;
                drawColored(ctx, gfx[sym2stat(sym)], posx -symshiftX, posy - symshiftY, symsz, symsz, color);
            } else {
                ctx.fillText(textArr[i], posx, posy);
            }
            posx += wordWidths[i];
            if (wordWidths[i] > 0)
                posx += space;

            if (boldWords[i])
                ctx.font = font;
            i++;
        }
    }
}

function sym2stat(sym) {
    switch (sym) {
        case 'atk': return 'attack'; break;
        case 'def': return 'defense'; break;
        case 'ini': return 'initiative'; break;
        case 'mov': return 'movement'; break;
        case 'rad': return 'radius'; break;
        case 'rng': return 'range'; break;
    }
}

function process_alignment(textArr, wordWidths, lineWords, lineWidth, settings) {
    var space = settings.space;
    var bullet_width = 0;
    var alignment = [];
    var align_type = 'center';
    var curr_align = lineWidth[0];
    var nlines = lineWords.length;
    var idx = 0; // position in textArr
    for (line = 0; line < nlines; line++) {
        if (textArr[idx] == '●') {
            curr_align = settings.width/2 - settings.padding.left;
            bullet_width = wordWidths[idx];
            align_type = 'bullet';
        } else if (textArr[idx] == ':right:') {
            curr_align = -settings.width/2 + settings.padding.right + lineWidth[line];
            textArr[idx] = '';
            align_type = 'right';
        } else if (textArr[idx] == ':left:') {
            curr_align = settings.width/2 - settings.padding.left;
            textArr[idx] = '';
            align_type = 'left';
        } else if (textArr[idx] == ':center:') {
            curr_align = lineWidth[line]/2;
            textArr[idx] = '';
            align_type = 'center';
        } else {
            if (align_type == 'bullet') {
                curr_align -= bullet_width + space;
                align_type = 'inbullet';
            } else if (align_type == 'center') {
                curr_align = lineWidth[line]/2;
            } else if (align_type == 'right') {
                curr_align = -settings.width/2 + settings.padding.right + lineWidth[line];
            }
        }
        alignment.push(curr_align);
        idx += lineWords[line];
    }
    return alignment;
}

function process_lineWords_lineWidth(wordWidths, newlineAfter, settings) {
    var space = settings.space;
    var textboxWidth = settings.width;
    textboxWidth -= settings.padding.left;
    textboxWidth -= settings.padding.right;

    var line = 0;
    var lineWords = [0];
    var lineWidth = [0];
    for (var i = 0; i < wordWidths.length; i++) {
        lineWords[line]++;
        lineWidth[line] += wordWidths[i];
        if (lineWidth[line] > textboxWidth) {
            lineWords[line]--;
            lineWidth[line] -= wordWidths[i];
            if (wordWidths[i-1] > 0)
                lineWidth[line] -= space;

            line++;
            lineWords[line] = 1;
            lineWidth[line] = wordWidths[i];
        }
        for (var j = 0; j < newlineAfter[i]; j++) {
            line++;
            lineWords[line] = 0;
            lineWidth[line] = 0;
        }
        if (i < wordWidths.length - 1 && lineWords[line] > 0) {
            if (wordWidths[i] > 0)
                lineWidth[line] += space;
        }
    }
    return [lineWords, lineWidth];
}

function process_wordWidths(ctx, textArr, boldWords) {
    const font = ctx.font.replace('bold','').trim();
    const macros = [':center:',':left:',':right:'];
    const symbols = [':atk:',':def:',':ini:',':mov:',':rad:',':rng:'];
    var wordWidths = Array(textArr.length);
    for (var i = 0; i < textArr.length; i++) {
        if (boldWords[i])
            ctx.font = "bold " + font;
        if (macros.indexOf(textArr[i]) > -1) {
            wordWidths[i] = 0;
        } else if (symbols.indexOf(textArr[i]) > -1) {
            wordWidths[i] = 35;
        } else {
            wordWidths[i] = ctx.measureText(textArr[i]).width;
        }
        if (boldWords[i])
            ctx.font = font;
    }
    return wordWidths;
}

function process_bold(textArr) {
    var boldWords = [];
    var isbold = false;
    for (var i = 0; i < textArr.length; i++) {
        if (textArr[i].slice(0, 2) == '**') {
            isbold = !isbold;
            boldWords.push(isbold);
        } else if (textArr[i].slice(-2) == '**') {
            boldWords.push(isbold);
            isbold = !isbold;
        } else {
            boldWords.push(isbold);
        }
        textArr[i] = textArr[i].replace('**','');
    }
    return boldWords;
}

function process_linebreaks(textArr) {
    var textArr_ = [...textArr];
    var newlineAfter_ = [];
    //=================================================================
    // INITIAL PROCESS
    var ii = 0;
    var n = textArr.length;
    for (var i = 0; i < n; i++) {
        var tmp = textArr.shift().split('\n');
        textArr_.splice(ii, 1, ...tmp);
        for (var j = 0; j < tmp.length-1; j++) {
            newlineAfter_.push(1);
            ii++;
        }
        newlineAfter_.push(0);
        ii++;
    }
    // SORT OUT "EMPTY WORDS"
    var newlineAfter = [];
    for (var i = 0; i < textArr_.length; i++) {
        if (textArr_[i] != '') {
            textArr.push(textArr_[i]);
            newlineAfter.push(newlineAfter_[i]);
        } else {
            newlineAfter[newlineAfter.length-1] += newlineAfter_[i];
        }
    }
    //=================================================================
    return newlineAfter;
}

// function render_text(ctx, card, color) {
//     var text = card.text;
//     var item = "";
//     if (card.hasOwnProperty('item')) {
//         item = card.item;
//     }
    
//     var textboxWidth = 500;
    
//     var space = 6.5;
//     var lineHeight = 34;
//     var textBoxBottom = 775;
    
//     if (item == "") {
//         textBoxBottom += 55;
//     }

//     // Styling needs to be set for ctx.measureText
//     // to measure correctly
//     var fillStyle = "black";
//     var font = "26px Arial";
//     var bold = false;
//     ctx.fillStyle = fillStyle;
//     ctx.font = font;

//     var textArr = text.split(" ");
//     var wordWidths = Array(textArr.length);
//     for (var i = 0; i < textArr.length; i++) {
//         if (!bold && textArr[i].slice(0,2) == "**") {
//             ctx.font = "bold " + font;
//             bold = true;
//         }
//         wordWidths[i] = ctx.measureText(textArr[i].replace(/\*\*/, '')).width;
//         if (bold && textArr[i].slice(-2) == "**") {
//             ctx.font = font;
//             bold = false;
//         }
//     }

//     // Calculate num lines and line widths
//     var line = 0;
//     var lineWords = [0];
//     var lineWidth = [0];
//     for (var i = 0; i < textArr.length; i++) {
//         lineWords[line]++;
//         lineWidth[line] += wordWidths[i];
//         if (lineWidth[line] > textboxWidth) {
            
//             lineWords[line]--;
//             lineWidth[line] -= (wordWidths[i] + space);

//             line++;
//             lineWords[line] = 1;
//             lineWidth[line] = wordWidths[i];
//         }

//         if (i < textArr.length - 1) {
//             lineWidth[line] += space;
//         }
//     }
//     var nlines = line+1;

//     var minPadding = 10;
//     var textboxPadding = minPadding + 20;
//     var height = nlines * lineHeight + 2*textboxPadding;
//     var x = 315;
//     var y = textBoxBottom - height + textboxPadding + 25; //667
//     render_textbox(ctx, card, color, textBoxBottom, height); 

//     // Write out lines
//     ctx.fillStyle = fillStyle;
//     ctx.font = font;
//     var i = 0;
//     for (line = 0; line < nlines; line++) {
//         var posx = x - lineWidth[line]/2;
//         var posy = y + line * lineHeight;
//         for (var j = 0; j < lineWords[line]; j++) {
//             if (!bold && textArr[i].slice(0,2) == "**") {
//                 ctx.font = "bold " + font;
//                 bold = true;
//             }
            
//             ctx.fillText(textArr[i].replace(/\*\*/, ''), posx, posy);
//             if (bold && textArr[i].slice(-2) == "**") {
//                 ctx.font = font;
//                 bold = false;
//             }
//             posx += wordWidths[i] + space;
//             i++;
//         }
//     }

//     // Render item
//     render_item(ctx, item);
// }

function render_item(ctx, item) {
    if (item == "") return;
    var sz = 100;
    var x = 315 - sz/2;
    var y = 880 - sz - 5;
    ctx.drawImage(gfx["item-"+item], x, y, sz, sz);
}

function render_tier(ctx, card) {
    var tier = card.tier;
    var strokesize = 5;
    var x = 553;
    var y = 80;

    var sc = 1.1;
    var sz = 76;
    var posx = x - sz/2 - 4;
    var posy = y - sz/2 - 20;

    ctx.drawImage(gfx.gear, posx, posy, sc*sz, sc*sz);
        
    ctx.fillStyle = "white";
    ctx.font = "48px " + font;;
    var textMeas = ctx.measureText(tier);
    x -= textMeas.width/2;

    // Draw the border
    ctx.strokeStyle = "black";  // Set the border color
    ctx.lineWidth = strokesize; // Set the border width

    ctx.strokeText(tier, x, y);
    ctx.fillText(tier, x, y);
    
}

function render_type(ctx, y, supertype, type, subtype) {
    var strokesize = 5;
    var x = 315;
    y -= 10;
    var typeString = "";
    switch (supertype) {
        case "basic":
            typeString += "Basic ";
            break;
        case "ultimate":
            typeString += type != "ultimate" ? "Ultimate " : "";
        default:
    }
    switch (type) {
        case "attack":
            typeString += "Attack";
            break;
        case "defense":
            typeString += "Defense";
            break;
        case "defenseSkill":
            typeString += "Defense/Skill";
            break;
        case "skill":
            typeString += "Skill";
            break;
        case "movement":
            typeString += "Movement";
            break;
        case "ultimate":
            typeString += "Ultimate";
            break;
    }
    switch (subtype) {
        case "range":
            typeString += " - Ranged";
            break;
        case "radius":
            if (type != "attack") {
                typeString += " - Area";
            }
            break;
        default:
    }

    ctx.fillStyle = "white";
    ctx.font = "28px " + font;;

    var textMeas = ctx.measureText(typeString);
    x -= textMeas.width/2;

    ctx.strokeStyle = "black"; // Set the border color
    ctx.lineWidth = strokesize; // Set the border width

    ctx.strokeText(typeString, x, y);
    ctx.fillText(typeString, x, y);
}

function render_name(ctx, card, fullwidth = false) {
    var name = card.name;
    var x = fullwidth ? 315 : 335;
    var y = 74;

    ctx.fillStyle = "black";
    ctx.font = "35px " + font;;

    var textMeas = ctx.measureText(name);
    x -= textMeas.width/2;
    ctx.fillText(name, x, y);
}

function render_readability(ctx, card) {
    var color = card.color;
    var strokesize = 5;
    var x = 600;
    var y = 45;
    var letter = (color == "gold") ? 'D' : color[0].toUpperCase();

    ctx.fillStyle = colorMap.readability.bg;
    ctx.font = "24px " + font;;
    var textMeas = ctx.measureText(letter);
    x -= textMeas.width/2;

    // Draw the border
    ctx.strokeStyle = colorMap.readability.border; // Set the border color
    ctx.lineWidth = strokesize; // Set the border width

    ctx.strokeText(letter, x, y);
    ctx.fillText(letter, x, y);
}

function render_textbox(ctx, card, color, textBoxBottom, height) {
    var supertype = card.supertype;
    var type = card.type;
    var value = card[type != "defenseSkill" ? type : "defense"];
    var subtype = card.subtype;
    var subvalue = card.subtypevalue;

    var strokesize = 8;
    var width = 570;
    var radius = 20;
    var x = 30;
    var y = textBoxBottom - height;

    // ----------------------------------------------
    // Type panel
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + width/6, y);
    ctx.arcTo(x + width/6, y - width/16, x + width/6 + width/16, y - width/16, width/16);
    ctx.lineTo(x + 5*width/6 - width/16, y - width/16);
    ctx.arcTo(x + 5*width/6, y - width/16, x + 5*width/6, y, width/16);
    ctx.closePath();
    
    ctx.strokeStyle = colorMap.textbox.border; // Set the border color
    ctx.lineWidth = strokesize; // Set the border width
    
    ctx.stroke();
    ctx.fill();

    render_type(ctx, y, supertype, type, subtype);

    // ----------------------------------------------
    // Textbox corner gears
    var sz = 70;
    var shift = 13;
    var posx = x - shift;
    var posy = y + height - sz + shift;
    ctx.drawImage(gfx.gear, posx, posy, sz, sz);
    
    posx = x + width - sz + 15;
    ctx.drawImage(gfx.gear, posx, posy, sz, sz);

    // ----------------------------------------------
    // Textbox
    var gradient = ctx.createLinearGradient(x, y, x, y + height);
    
    var stop1 = 0.5;
    var stop2 = (height - 40) / height;
    stop1 = stop2 < stop1 ? stop2/2 : stop1;

    gradient.addColorStop(0, color);
    gradient.addColorStop(stop1, color);
    gradient.addColorStop(stop2, colorMap.textbox.bg);
    gradient.addColorStop(1, colorMap.textbox.bg);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    
    // Draw the border
    ctx.strokeStyle = colorMap.textbox.border; // Set the border color
    ctx.lineWidth = strokesize; // Set the border width
    
    ctx.stroke();
    ctx.fill();
    
    // Inner color
    var padx = 8;
    var pady = 5;
    width -= 2*padx;
    height -= 2*pady;
    ctx.fillStyle = colorMap.textbox.bg;
    roundedRectPath(ctx, x + padx, y + pady, width, height, radius);
    ctx.fill();

    // Primary action
    if (type != "ultimate") {
        render_primary(ctx, y, type, value, color);
    }
    if (subtype != "") {
        render_subtype(ctx, y, subtype, subvalue, color);
    }
}

function roundedRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function draw_arc(ctx, p0, p1, gam) {
    let add = function (p, q) { return [p[0] + q[0], p[1] + q[1]]; }
    let diff = function (p, q) { return [p[0] - q[0], p[1] - q[1]]; }
    let scale = function (s, p) { return [s * p[0], s * p[1]]; }
    let norm = function (p) { return Math.sqrt(p[0]*p[0] + p[1]*p[1]); }
    let rot = function (p) { return [-p[1], p[0]]; }
    let s = scale(.5, diff(p1, p0));
    let ps = add(s, p0);
    let t = rot(s);
    let cp = add(scale(gam, t), ps);
    let r = norm(diff(p1, add(scale(-1/gam, t), ps)));
    ctx.arcTo(cp[0], cp[1], p1[0], p1[1], r);
}

function draw_banner_bottom(ctx, color, x, y, width, height) {
    var ratio, s, r;
    var p1, p2, p3, gam;
    switch (color) {
        case 'gold':
            ratio = 0.9;
            ctx.lineTo(x, y+height);
            ctx.lineTo(x+width/2, y + height - ratio * width/2);
            ctx.lineTo(x+width, y+height);
            break;
        case 'green':
            ratio = 6/7;
            gam = 0.5;
            ctx.lineTo(x, y + height - ratio * width/2);
            p1 = [x, y + height - ratio * width/2];
            p2 = [x+width/2, y+height];
            draw_arc(ctx, p1, p2, gam);
            p1 = p2;
            p2 = [x+width, y + height - ratio * width/2]; 
            draw_arc(ctx, p1, p2, gam);
            break;
        case 'silver':
            s = width/5;
            ctx.lineTo(x, y + height);
            ctx.lineTo(x + s, y + height);
            ctx.lineTo(x + s, y + height - s);
            ctx.lineTo(x + 2*s, y + height - s);
            ctx.lineTo(x + 2*s, y + height);
            ctx.lineTo(x + 3*s, y + height);
            ctx.lineTo(x + 3*s, y + height - s);
            ctx.lineTo(x + 4*s, y + height - s);
            ctx.lineTo(x + 4*s, y + height);
            ctx.lineTo(x+width, y + height);
            break;
        case 'blue':
            s = width/5;
            gam = 0.5;
            p1 = [x, y + height - s];
            p2 = [x + s/2, y + height];
            p3 = [x + s, y + height - s];
            ctx.lineTo(p1[0], p1[1]);
            draw_arc(ctx, p1, p2, gam);
            draw_arc(ctx, p2, p3, gam);
            p1 = [x + 2*s, y + height - s];
            p2 = [x + 2*s + s/2, y + height];
            p3 = [x + 3*s, y + height - s];
            ctx.lineTo(p1[0], p1[1]);
            draw_arc(ctx, p1, p2, gam);
            draw_arc(ctx, p2, p3, gam);
            p1 = [x + 4*s, y + height - s];
            p2 = [x + 4*s + s/2, y + height];
            p3 = [x + 5*s, y + height - s];
            ctx.lineTo(p1[0], p1[1]);
            draw_arc(ctx, p1, p2, gam);
            draw_arc(ctx, p2, p3, gam);
            break;
        default:
            ratio = 0.9;
            ctx.lineTo(x, y + height - ratio * width/2);
            ctx.lineTo(x+width/2, y+height);
            ctx.lineTo(x+width, y + height - ratio * width/2);
    }
}

function render_banner(ctx, card, color, bleed) {
    var initiative = card.initiative;
    var actions = {};
    ['defense', 'movement', 'attack'].forEach(function(type) {
        if (type != card.type && !(type == "defense" && card.type == "defenseSkill")) {
            if (card.hasOwnProperty(type)) {
                actions[type] = card[type];
            }
        }
    });

    var nactions = Object.keys(actions).length;

    var base = 125;
    var topPadding = 35 + 15; // 15 is flex
    var bottomPadding = 20 + 15; // maybe 10 is flex?
    var padding = topPadding + bottomPadding;
    var actionSize = 95;
    var height = base + actionSize * nactions + padding + bleed;
    
    var baseX = 30;
    var baseY = 0;
    var width = 90;

    var strokesize = 8;
    var pointyness = 0.9;
    var x = baseX;
    var y = baseY - bleed;
    
    // auxiliary vector calculus
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    draw_banner_bottom(ctx, card['color'], x, y, width, height);
    ctx.lineTo(x+width, y);
    ctx.closePath();
    
    // Draw the border
    ctx.strokeStyle = colorMap.banner.border; // Set the border color
    ctx.lineWidth = strokesize; // Set the border width
    
    ctx.stroke();
    ctx.fill();
    
    // Draw banner shading
    var shiftX = width/4;
    x = baseX + shiftX;
    y = baseY;
    var w = width - 2*shiftX;
    var memAlpha = ctx.globalAlpha;
    ctx.fillStyle = "black";
    ctx.globalAlpha = .10;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x+w, y + height);
    ctx.lineTo(x+w, y);
    ctx.closePath();
    let gradient = ctx.createLinearGradient(0, base, 0, y + height - pointyness * width/4);
    gradient.addColorStop(0, "rgba(0, 0, 0, 255)");
    gradient.addColorStop(.90, "rgba(0, 0, 0, 255)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Small top banner
    shiftX = width/5;
    x = baseX + shiftX;
    y = baseY - bleed;
    w = width - 2*shiftX;
    h = base + 25 + bleed;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    draw_banner_bottom(ctx, card['color'], x, y, w, h);
    ctx.lineTo(x+w, y);
    ctx.closePath();
    
    ctx.globalAlpha = .45;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.globalAlpha = memAlpha;
    ctx.fill();

    // Render inititative hourglass
    var scplus = 55;
    x = baseX - 5 - scplus/2;
    y = baseY - 5;
    var sz = width + scplus;
    ctx.drawImage(gfx.initiative, x, y, sz, sz);

    // render initiative
    x = baseX + width/2;
    y = baseY + 100;
    var value = initiative;

    ctx.fillStyle = "white";
    ctx.font = "100px " + font;

    var textMeas = ctx.measureText(value);
    x -= textMeas.width/2;

    ctx.strokeStyle = "black"; // Set the border color
    ctx.lineWidth = strokesize; // Set the border width

    ctx.strokeText(value, x, y);
    ctx.fillText(value, x, y);

    // Secondary actions
    var scplus = 15;
    x = baseX - (actionSize - width)/2;
    var sz = actionSize;
    var posx, posy;
    var keys = Object.keys(actions);

    ctx.font = "65px " + font;
    for (var i = 0; i < keys.length; i++) {
        // Draw icon
        y = base + topPadding + i * sz;
        ctx.drawImage(gfx[keys[i]], x, y, sz, sz);

        // Write value
        value = actions[keys[i]].toString();
        textMeas = ctx.measureText(value);
        posx = baseX + width/2 - textMeas.width/2;
        posy = y + sz/2 + textMeas.actualBoundingBoxAscent/2 - 5;

        ctx.strokeText(value, posx, posy);
        ctx.fillText(value, posx, posy);
    }

}

function render_namebox(ctx, fullwidth = false) {
    var strokesize = 8;
    var width = fullwidth ? 540 : 455;
    var height = 60;
    var radius = height/2;
    var x = fullwidth ? 45 : 130;
    var y = 34;

    ctx.fillStyle = colorMap.namebox.bg;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    
    // Draw the border
    ctx.strokeStyle = colorMap.namebox.border; // Set the border color
    ctx.lineWidth = strokesize; // Set the border width
    
    ctx.fill();
    ctx.stroke();
}

function render_bg_upper(ctx, bleed) { 
    var strokesize = 6;
    var width = layout.canvas.width + 2*bleed;
    var height = 65 + bleed;
    var x = -bleed;
    var y = -bleed;
    
    ctx.fillStyle = colorMap.background.bg; // Set the fill color
    
    // Draw the rectangle border
    ctx.strokeStyle = colorMap.background.border; // Set the border color
    ctx.lineWidth = strokesize; // Set the border width
    
    ctx.strokeRect(x, y, width, height);
    ctx.fillRect(x, y, width, height);
}

function render_bg_lower(ctx, bleed) {
    var strokesize = 6;
    var width = layout.canvas.width + 2*bleed;
    var height = 125 + bleed;
    var x = -bleed;
    var y = canvas.height - (height + bleed);
    
    ctx.fillStyle = colorMap.background.bg; // Set the fill color

    // Draw the rectangle border
    ctx.strokeStyle = colorMap.background.border; // Set the border color
    ctx.lineWidth = strokesize; // Set the border width
    
    ctx.strokeRect(x, y, width, height);
    ctx.fillRect(x, y, width, height);
}