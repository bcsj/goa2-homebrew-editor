import { color_map, card_settings, layout } from "./constants.js";
import drawColored from "./drawColored.js";

var gfx = {};

export function asset_loader(callback) {
    var load = {
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
        gear: "svg/gear.svg",
        //art: "img/OIG._sU2.jpeg",
        art: "img/_42b87fb7-037f-43f3-80dc-0576c8874d49.jpeg",
    };
    var nAssets = Object.keys(load).length;

    var nAssetsLoaded = 0;
    for (var img in load) {
        gfx[img] = new Image();
        gfx[img].src = load[img];
        gfx[img].onload = function () {
            // Run render() when last asset loads
            if (++nAssetsLoaded == nAssets) {
                //document.dispatchEvent(gfxLoadedEvent);
                callback();
            }
        }
    }
}

export function render(ctx, canvas, card) {
    console.log("Running render!");
    var color = color_map[card.color] + "ff";

    // BLEED SETTINGS
    var bleed = card_settings.canvas.bleed;
    canvas.width = layout.canvas.width + 2*bleed;
    canvas.height = layout.canvas.height + 2*bleed;
    ctx.save();
    ctx.translate(bleed, bleed);

    // CLEAR CANVAS
    clear_canvas(ctx, canvas);

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

    render_textbox(ctx, card, color);
    ctx.restore();
}

function render_art(ctx) {
    var x = 0;
    var y = 0;
    /*var shiftX = 200;
    var shiftY = -0;
    var scale = 1.00;*/
    var shiftX = 25;
    var shiftY = -70;
    var scale = 0.80;


    ctx.drawImage(gfx.art, x-shiftX, y-shiftY, scale*gfx.art.width, scale*gfx.art.height);
}

//=============================================================
// CLEAR THE CANVAS
function clear_canvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//=============================================================
// DRAW SUBTYPE
function render_subtype(ctx, y, subtype, value, color) {
    var sz, x, imgsz;
    sz = layout.subtype.size;
    if (subtype == "range") {
        imgsz = layout.subtype.range.size;
        x = layout.canvas.width - sz - layout.subtype.range.shift_x;
        y -= layout.subtype.range.shift_y;
        shiftImgY = layout.subtype.range.shift_img_y;
    } else if (subtype == "radius") {
        imgsz = layout.subtype.radius.size;
        x = layout.canvas.width - sz - layout.subtype.radius.shift_x;
        y -= layout.subtype.radius.shift_y;
        var shiftImgY = layout.subtype.radius.shift_img_y;
    } else {
        return;
    }

    ctx.font = layout.subtype.text.font;
    // Draw icon
    drawColored(ctx, gfx[subtype], x, y + shiftImgY, imgsz, imgsz, color);
    
    // Write value
    var textMeas = ctx.measureText(value);

    ctx.fillStyle = layout.subtype.text.color;
    ctx.strokeStyle = layout.subtype.text.stroke;
    ctx.lineWidth = layout.subtype.text.strokesize;
    x += imgsz/2 - textMeas.width/2;
    y += sz/2 + textMeas.actualBoundingBoxAscent/2;
    ctx.strokeText(value, x, y);
    ctx.fillText(value, x, y);

}

//=============================================================
// DRAW PRIMARY
function render_primary(ctx, y, type, value, color) {
    var x = layout.primary.x;
    var sz = layout.primary.size;
    y -= 16*sz/20;

    ctx.font = layout.primary.text.font;
    // Draw icon
    drawColored(ctx, gfx[type], x, y, sz, sz, color);
    
    if (type != "skill") {
        // Write value
        var textMeas = ctx.measureText(value);
    
        ctx.fillStyle = layout.primary.text.color;
        ctx.strokeStyle = layout.primary.text.stroke;
        ctx.lineWidth = layout.primary.text.strokesize;
        x += sz/2 - textMeas.width/2;
        y += sz/2 + textMeas.actualBoundingBoxAscent/2;
        ctx.strokeText(value, x, y);
        ctx.fillText(value, x, y);
    }
}

//=============================================================
// TEXTBOX RENDERER
function render_textbox(ctx, card, color) {
    var text = card.text;
    var item = "";
    if (card.hasOwnProperty('item')) {
        item = card.item;
    }
    var settings = card_settings.textbox;

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
    render_frame(ctx, card, color, textBoxBottom, height);
    
    // Fill in the text
    ctx.font = settings.text.font;
    ctx.fillStyle = settings.text.color;
    var x = layout.canvas.width/2;
    var y = textBoxBottom - height + topPad + minPad + settings.line_height/2;
    process_print_text(ctx, x, y, wordWidths, lineWidth, lineWords, alignment, boldWords, textArr, color, settings);

    // Render item
    render_item(ctx, item);
}

//-------------------------------------------
// PRINT THE TEXT
function process_print_text(ctx, x, y,
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
    const symsz = layout.textbox.text.icon.symbol_size;

    var i = 0;
    for (var line = 0; line < nlines; line++) {
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

//-------------------------------------------
// SYMBOL ABBREVIATION MAP
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

//-------------------------------------------
// COMPUTE TEXTBOX ALIGNMENT
function process_alignment(textArr, wordWidths, lineWords, lineWidth, settings) {
    var space = settings.space;
    var bullet_width = 0;
    var alignment = [];
    var align_type = 'center';
    var curr_align = lineWidth[0];
    var nlines = lineWords.length;
    var idx = 0; // position in textArr
    for (var line = 0; line < nlines; line++) {
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

//-------------------------------------------
// COMPUTE LINE WORDS AND LINE WIDTHS
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

//-------------------------------------------
// COMPUTE WORD WIDTHS
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
            wordWidths[i] = layout.textbox.text.icon.word_width;
        } else {
            wordWidths[i] = ctx.measureText(textArr[i]).width;
        }
        if (boldWords[i])
            ctx.font = font;
    }
    return wordWidths;
}

//-------------------------------------------
// COMPUTE BOLD TEXT
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

//-------------------------------------------
// COMPUTE LINEBREAKS
function process_linebreaks(textArr) {
    var textArr_ = [...textArr];
    var newlineAfter_ = [];
    // ##### INITIAL PROCESS #####
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
    // ##### SORT OUT "EMPTY WORDS" #####
    var newlineAfter = [];
    for (var i = 0; i < textArr_.length; i++) {
        if (textArr_[i] != '') {
            textArr.push(textArr_[i]);
            newlineAfter.push(newlineAfter_[i]);
        } else {
            newlineAfter[newlineAfter.length-1] += newlineAfter_[i];
        }
    }
    return newlineAfter;
}

//=============================================================
// DRAW ITEM
function render_item(ctx, item) {
    if (item == "") return;
    var sz = layout.item.size;
    var x = layout.canvas.width/2 - sz/2;
    var y = layout.canvas.height - sz - layout.item.shift_y;
    ctx.drawImage(gfx["item-"+item], x, y, sz, sz);
}

//=============================================================
// DRAW TIER
function render_tier(ctx, card) {
    var tier = card.tier;
    var x = layout.tier.x;
    var y = layout.tier.y;

    var sc = layout.tier.gear.scale;
    var sz = layout.tier.gear.size;
    var posx = x - sz/2 - layout.tier.gear.shift_x;
    var posy = y - sz/2 - layout.tier.gear.shift_y;

    ctx.drawImage(gfx.gear, posx, posy, sc*sz, sc*sz);
        
    ctx.fillStyle = layout.tier.text.color;
    ctx.font = layout.tier.text.font;
    var textMeas = ctx.measureText(tier);
    x -= textMeas.width/2;

    // Draw the border
    ctx.strokeStyle = layout.tier.text.stroke;  // Set the border color
    ctx.lineWidth = layout.tier.text.strokesize; // Set the border width

    ctx.strokeText(tier, x, y);
    ctx.fillText(tier, x, y);
    
}

//=============================================================
// DRAW TYPE
function render_type(ctx, y, supertype, type, subtype) {
    var x = layout.canvas.width/2;
    y -= layout.type.shift_y;
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
                typeString += ""; //" - Area";
            }
            break;
        default:
    }

    ctx.fillStyle = layout.type.text.color;
    ctx.font = layout.type.text.font;

    var textMeas = ctx.measureText(typeString);
    x -= textMeas.width/2;

    ctx.strokeStyle = layout.type.text.stroke; // Set the border color
    ctx.lineWidth = layout.type.text.strokesize; // Set the border width

    ctx.strokeText(typeString, x, y);
    ctx.fillText(typeString, x, y);
}

//=============================================================
// DRAW NAME
function render_name(ctx, card, fullwidth = false) {
    var name = card.name;
    var x = fullwidth ? layout.canvas.width/2 : layout.name.x;
    var y = layout.name.y;

    ctx.fillStyle = layout.name.text.color;
    ctx.font = layout.name.text.font;

    var textMeas = ctx.measureText(name);
    x -= textMeas.width/2;
    ctx.fillText(name, x, y);
}

//=============================================================
// DRAW READABILITY LETTER
function render_readability(ctx, card) {
    var color = card.color;
    var x = layout.readability.x;
    var y = layout.readability.y;
    var letter = (color == "gold") ? 'D' : color[0].toUpperCase();

    ctx.fillStyle = layout.readability.text.color;
    ctx.font = layout.readability.text.font;
    var textMeas = ctx.measureText(letter);
    x -= textMeas.width/2;

    // Draw the border
    ctx.strokeStyle = layout.readability.text.stroke; // Set the border color
    ctx.lineWidth = layout.readability.text.strokesize; // Set the border width

    ctx.strokeText(letter, x, y);
    ctx.fillText(letter, x, y);
}

//=============================================================
// DRAW TEXTBOX FRAME
function render_frame(ctx, card, color, textBoxBottom, height) {
    var supertype = card.supertype;
    var type = card.type;
    var value = card[type != "defenseSkill" ? type : "defense"];
    var subtype = card.subtype;
    var subvalue = card.subtypevalue;

    var width = layout.textbox.frame.width;
    var radius = layout.textbox.frame.radius;
    var x = (layout.canvas.width - width)/2;
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
    
    ctx.strokeStyle = layout.textbox.frame.stroke; // Set the border color
    ctx.lineWidth = layout.textbox.frame.strokesize; // Set the border width
    
    ctx.stroke();
    ctx.fill();

    render_type(ctx, y, supertype, type, subtype);

    // ----------------------------------------------
    // Textbox corner gears
    var sz = layout.textbox.gear.size;
    var shift = layout.textbox.gear.shift_left;
    var posx = x - shift;
    var posy = y + height - sz + shift;
    ctx.drawImage(gfx.gear, posx, posy, sz, sz);
    
    posx = x + width - sz + layout.textbox.gear.shift_right;
    ctx.drawImage(gfx.gear, posx, posy, sz, sz);

    // ----------------------------------------------
    // Textbox
    var gradient = ctx.createLinearGradient(x, y, x, y + height);
    
    var stop1 = 0.5;
    var tmp = layout.textbox.gradient.shift_stop;
    var stop2 = (height - tmp) / height;
    stop1 = stop2 < stop1 ? stop2/2 : stop1;

    gradient.addColorStop(0, color);
    gradient.addColorStop(stop1, color);
    gradient.addColorStop(stop2, layout.textbox.frame.bgcolor);
    gradient.addColorStop(1, layout.textbox.frame.bgcolor);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    
    // Draw the border
    ctx.strokeStyle = layout.textbox.frame.stroke; // Set the border color
    ctx.lineWidth = layout.textbox.frame.strokesize; // Set the border width
    
    ctx.stroke();
    ctx.fill();
    
    // Inner color
    var padx = layout.textbox.frame.inner_color_pad_x;
    var pady = layout.textbox.frame.inner_color_pad_y;
    width -= 2*padx;
    height -= 2*pady;
    ctx.fillStyle = layout.textbox.frame.bgcolor;
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

//-------------------------------------------
// DRAW ROUNDED CORNER RECTANGLE
function roundedRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

//-------------------------------------------
// DRAW ARCS FOR BANNER
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

//-------------------------------------------
// DRAW BANNER BOTTOM
function draw_banner_bottom(ctx, color, x, y, width, height) {
    var ratio, s;
    var p1, p2, p3, gam;
    switch (color) {
        case 'gold':
            ratio = layout.banner.gold.ratio;
            ctx.lineTo(x, y+height);
            ctx.lineTo(x+width/2, y + height - ratio * width/2);
            ctx.lineTo(x+width, y+height);
            break;
        case 'green':
            ratio = layout.banner.green.ratio;
            gam = layout.banner.green.gam;
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
            gam = layout.banner.blue.gam;
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
            ratio = layout.banner.red.ratio;
            ctx.lineTo(x, y + height - ratio * width/2);
            ctx.lineTo(x+width/2, y+height);
            ctx.lineTo(x+width, y + height - ratio * width/2);
    }
}

//=============================================================
// DRAW BANNER
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

    var base = layout.banner.base;
    var topPadding = layout.banner.padding.top + 15; // 15 is flex
    var bottomPadding = layout.banner.padding.bottom + 10; // maybe 10 is flex?
    var padding = topPadding + bottomPadding;
    var actionSize = layout.banner.action_size;
    var height = base + actionSize * nactions + padding + bleed;
    
    var baseX = layout.banner.base_x;
    var baseY = layout.banner.base_y;
    var width = layout.banner.width;

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
    ctx.strokeStyle = layout.banner.stroke; // Set the border color
    ctx.lineWidth = layout.banner.strokesize; // Set the border width
    
    ctx.stroke();
    ctx.fill();
    
    // Draw banner shading
    var shiftX = width/4;
    x = baseX + shiftX;
    y = baseY;
    var w = width - 2*shiftX;
    var memAlpha = ctx.globalAlpha;
    ctx.globalAlpha = layout.banner.shade_alpha;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x+w, y + height);
    ctx.lineTo(x+w, y);
    ctx.closePath();
    let gradient = ctx.createLinearGradient(0, base, 0, y + height - 0.9 * width/4);
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
    var h = base + layout.banner.small.base_shift + bleed;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    draw_banner_bottom(ctx, card['color'], x, y, w, h);
    ctx.lineTo(x+w, y);
    ctx.closePath();
    
    ctx.globalAlpha = layout.banner.small.stroke_alpha;
    ctx.strokeStyle = layout.banner.small.stroke;
    ctx.lineWidth = layout.banner.small.strokesize;
    ctx.stroke();
    ctx.globalAlpha = memAlpha;
    ctx.fill();

    // Render inititative hourglass
    var scplus = layout.banner.initiative.scale_add;
    x = baseX - layout.banner.initiative.shift_x - scplus/2;
    y = baseY - layout.banner.initiative.shift_y;
    var sz = width + scplus;
    ctx.drawImage(gfx.initiative, x, y, sz, sz);

    // render initiative
    x = baseX + width/2;
    y = baseY + layout.banner.initiative.text_shift_y;
    var value = initiative;

    ctx.fillStyle = layout.banner.text.color;
    ctx.font = layout.banner.initiative.font;

    var textMeas = ctx.measureText(value);
    x -= textMeas.width/2;

    ctx.strokeStyle = layout.banner.text.stroke; // Set the border color
    ctx.lineWidth = layout.banner.strokesize; // Set the border width

    ctx.strokeText(value, x, y);
    ctx.fillText(value, x, y);

    // Secondary actions
    x = baseX - (actionSize - width)/2;
    var sz = actionSize;
    var posx, posy;
    var keys = Object.keys(actions);

    ctx.font = layout.banner.secondary_actions.font;
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

//=============================================================
// DRAW NAMEBOX
function render_namebox(ctx, fullwidth = false) {
    var width = fullwidth ? layout.name.box.width.full : layout.name.box.width.regular;
    var height = layout.name.box.height;
    var radius = height/2;
    var x = fullwidth ? layout.name.box.x.full : layout.name.box.x.regular;
    var y = layout.name.box.y;

    ctx.fillStyle = layout.name.box.bgcolor;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    
    // Draw the border
    ctx.strokeStyle = layout.name.box.stroke; // Set the border color
    ctx.lineWidth = layout.name.box.strokesize; // Set the border width
    
    ctx.fill();
    ctx.stroke();
}

//=============================================================
// DRAW BACKGROUND ELEMENT UPPER
function render_bg_upper(ctx, bleed) { 
    var width = layout.canvas.width + 2*bleed;
    var height = layout.bg_elements.upper.height + bleed;
    var x = -bleed;
    var y = -bleed;
    
    ctx.fillStyle = layout.bg_elements.bgcolor; // Set the fill color
    
    // Draw the rectangle border
    ctx.strokeStyle = layout.bg_elements.stroke; // Set the border color
    ctx.lineWidth = layout.bg_elements.strokesize; // Set the border width
    
    ctx.strokeRect(x, y, width, height);
    ctx.fillRect(x, y, width, height);
}

//=============================================================
// DRAW BACKGROUND ELEMENT LOWER
function render_bg_lower(ctx, bleed) {
    var width = layout.canvas.width + 2*bleed;
    var height = layout.bg_elements.lower.height + bleed;
    var x = -bleed;
    var y = layout.canvas.height - height;
    
    ctx.fillStyle = layout.bg_elements.bgcolor; // Set the fill color

    // Draw the rectangle border
    ctx.strokeStyle = layout.bg_elements.stroke; // Set the border color
    ctx.lineWidth = layout.bg_elements.strokesize; // Set the border width
    
    ctx.strokeRect(x, y, width, height);
    ctx.fillRect(x, y, width, height);
}