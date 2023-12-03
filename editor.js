
window.addEventListener('DOMContentLoaded',function () {
    var div = document.getElementById("stat");
    const can = Object.assign(document.createElement("canvas"), {
        width: 270,
        height: 75,
    });

    div.appendChild(can);

    var ctx = can.getContext("2d");
    document.addEventListener('gfx ready', function(e) {
        
        //console.log(gfx.art.height);
        //ctx.drawImage(gfx.art, 0, 0, 1.0*gfx.art.width, 1.0*gfx.art.height);
        
        var y = 0;
        var x;
        var sz = 75;
        var pad = 15;
        var activeTiers = [0, 1, 1];
        var value = [3, 3, 4];
        var mod = [0, -1, 0];

        var val, textMeas, posx, posy;
        var icon = gfx['attack'];
        var color = colorMap.red;

        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        for (var i = 0; i < activeTiers.length; i++) {
            x = pad/2 + i * (sz+pad);

            ctx.font = "40px ModestoPosterW05-Regular";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 6;
            val = value[i].toString();
            textMeas = ctx.measureText(val);
            posx = x + sz/2 - textMeas.width/2;
            posy = y + sz/2 + textMeas.actualBoundingBoxAscent/2 - 2;
            if (activeTiers[i]) {
                drawColored(ctx, icon, x, y, sz, sz, color, 1);
                ctx.strokeText(val, posx, posy);
                ctx.fillText(val, posx, posy);
            } else {
                drawFaded(ctx, icon, x, y, sz, sz, color, 0.2);
            }
            
            ctx.fillStyle = "#dddddd";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;
            ctx.beginPath()
            posx = x + 5;
            posy = y + 12;
            ctx.arc(posx, posy, 10, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();

            ctx.font = "20px ModestoPosterW05-Regular";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;
            val = 'I' + 'I'.repeat(i);
            textMeas = ctx.measureText(val);
            posx = posx - textMeas.width/2;
            posy = posy + textMeas.actualBoundingBoxAscent/2;
            ctx.strokeText(val, posx, posy);
            ctx.fillText(val, posx, posy);

            if (mod[i] != 0) {
                ctx.fillStyle = "#dddddd";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 4;
                ctx.beginPath()
                posx = x + sz - 10 - 0;
                posy = y + sz - 10 - 10;
                ctx.arc(posx, posy, 10, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
    
                ctx.font = "14px Arial";
                ctx.fillStyle = "black";
                val = mod[i];
                textMeas = ctx.measureText(val);
                posx = posx - textMeas.width/2;
                posy = posy + textMeas.actualBoundingBoxAscent/2;
                ctx.fillText(val, posx, posy);
            }
        }

    });
});