// https://stackoverflow.com/a/68414300

function copyImage(img) { // img can be any image type
    const can = Object.assign(document.createElement("canvas"), {
        width: img.width,
        height: img.height,
    });
    can.ctx = can.getContext("2d");
    can.ctx.drawImage(img, 0, 0, img.width, img.height);
    return can;

}

function imageFilterChannel(img, channel = "red") {
    const imgf = copyImage(img);
    // remove unwanted channel data
    imgf.ctx.globalCompositeOperation = "multiply";
    imgf.ctx.fillStyle = imageFilterChannel.filters[channel] ?? "#FFF";
    imgf.ctx.fillRect(0,0, img.width, img.height);

    // add alpha mask
    imgf.ctx.globalCompositeOperation = "destination-in";
    imgf.ctx.drawImage(img, 0, 0, img.width, img.height);
    imgf.ctx.globalCompositeOperation = "source-over";
    return imgf;
}
imageFilterChannel.filters = {
    red:   "#F00",
    green: "#0F0",
    blue:  "#00F",
    alpha: "#000",
};

function drawColored(ctx, img, x, y, W, H, color) {

    const channels = [];
    channels[0] = imageFilterChannel(img, "red");
    channels[1] = imageFilterChannel(img, "green");
    channels[2] = imageFilterChannel(img, "blue");
    channels[3] = imageFilterChannel(img, "alpha");
    
    // get RGBA from color string
    const r = parseInt(color[1] + color[2], 16);
    const g = parseInt(color[3] + color[4], 16);
    const b = parseInt(color[5] + color[6], 16);
    //const a = parseInt(color[7] + color[8], 16);
    
    // draw alpha first then RGB
    var memAlpha = ctx.globalAlpha;
    ctx.globalCompositeOperation = "source-over";
    //ctx.globalAlpha = a / 255;
    //ctx.drawImage(channels[3], x, y, W, H);
    ctx.globalAlpha = 1;
    ctx.drawImage(img, x, y, W, H);
    
    ctx.globalCompositeOperation = "multiply";
    
    ctx.globalAlpha = r / 255;
    ctx.drawImage(channels[0], x, y, W, H);
    ctx.globalAlpha = g / 255;
    ctx.drawImage(channels[1], x, y, W, H);
    ctx.globalAlpha = b / 255;
    ctx.drawImage(channels[2], x, y, W, H);
    
    ctx.globalCompositeOperation = "screen";
    
    ctx.globalAlpha = r / 255;
    ctx.drawImage(channels[0], x, y, W, H);
    ctx.globalAlpha = g / 255;
    ctx.drawImage(channels[1], x, y, W, H);
    ctx.globalAlpha = b / 255;
    ctx.drawImage(channels[2], x, y, W, H);
    
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = memAlpha;
}

function imageWhiteShadow(img) {
    const imgf = copyImage(img);
    // remove unwanted channel data
    imgf.ctx.globalCompositeOperation = "source-in";
    imgf.ctx.fillStyle = "white";
    imgf.ctx.fillRect(0,0, img.width, img.height);
    imgf.ctx.globalCompositeOperation = "source-over";
    return imgf;
}

function drawFaded(ctx, img, x, y, W, H, color, fade=1) {

    const channels = [];
    console.log(img);
    channels[0] = imageFilterChannel(img, "red");
    channels[1] = imageFilterChannel(img, "green");
    channels[2] = imageFilterChannel(img, "blue");
    channels[3] = imageFilterChannel(img, "alpha");
    
    // get RGBA from color string
    const r = parseInt(color[1] + color[2], 16);
    const g = parseInt(color[3] + color[4], 16);
    const b = parseInt(color[5] + color[6], 16);
    const a = parseInt(color[7] + color[8], 16);
    
    // draw alpha first then RGB
    var memAlpha = ctx.globalAlpha;
    ctx.globalCompositeOperation = "source-over";
    //ctx.globalAlpha = a / 255;
    //ctx.drawImage(channels[3], x, y, W, H);
    var whiteShadow = imageWhiteShadow(img);
    ctx.drawImage(whiteShadow, x, y, W, H);
    var s = fade;
    ctx.globalAlpha = s*1;
    ctx.drawImage(img, x, y, W, H);
    
    ctx.globalCompositeOperation = "multiply";
    
    ctx.globalAlpha = s*r / 255;
    ctx.drawImage(channels[0], x, y, W, H);
    ctx.globalAlpha = s*g / 255;
    ctx.drawImage(channels[1], x, y, W, H);
    ctx.globalAlpha = s*b / 255;
    ctx.drawImage(channels[2], x, y, W, H);
    
    ctx.globalCompositeOperation = "screen";
    
    ctx.globalAlpha = s*r / 255;
    ctx.drawImage(channels[0], x, y, W, H);
    ctx.globalAlpha = s*g / 255;
    ctx.drawImage(channels[1], x, y, W, H);
    ctx.globalAlpha = s*b / 255;
    ctx.drawImage(channels[2], x, y, W, H);
    
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = memAlpha;
}
