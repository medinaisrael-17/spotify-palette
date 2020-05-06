let hex_1;
let hex_2;
let hex_3;
let hex_4;
let hex_5;
let base_color_complement;

let dance_arr = []
let energy_arr = [];
let valence_arr = [];

let high_dance_count = 0;
let high_energy_count = 0;
let high_valence_count = 0;

//Materialize JS
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
        direction: 'left',
        hoverEnabled: false
    });
});

//end

$(".color").hover(function () {
    $(this).children().css("display", "block");
}, function () {
    $(this).children().css("display", "none");
});

$(document).on("mouseenter", ".song", function () {
    $(this).children(".playbutton").css("display", "block");
}).on("mouseleave", ".song", function () {
    $(this).children(".playbutton").css("display", "none");
})

$(document).on("mouseenter", ".image", function () {
    $(this).children(".source-box").removeClass("fadeOutLeft");
    $(this).children(".source-box").addClass("fadeInLeft");
    $(this).children(".source-box").css("display", "block");
}).on("mouseleave", ".image", function () {
    $(this).children(".source-box").removeClass("fadeInLeft")
    $(this).children(".source-box").addClass("fadeOutLeft");
    // $(this).children(".source-box").css("display", "none");
})

$("#view_music").click(function () {
    $("#palette-card").removeClass("slideInUp");
    $("#view_palette").removeClass("disabled")
    $("#palette-card").addClass("faster");
    $("#palette-card").addClass("slideOutUp");
    setTimeout(function () { $("#palette-card").css("display", "none") }, 600)

    $("#top-albums-div").show()
    $("#top-albums-div").removeClass("slideOutUp");
    $("#top-albums-div").addClass("slideInUp");
    $("#view_music").addClass("disabled");
})

$("#view_images").click(function () {
    $("#top-albums-div").removeClass("slideInUp");
    $("#view_music").removeClass("disabled")
    $("#top-albums-div").addClass("faster");
    $("#top-albums-div").addClass("slideOutUp");
    setTimeout(function () { $("#top-albums-div").css("display", "none") }, 600)

    $("#similar-images").show()
    $("#similar-images").removeClass("slideOutUp");
    $("#similar-images").addClass("slideInUp");
    $("#view_images").addClass("disabled");

    webScrape();
})

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

const params = getHashParams();

var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

if (error) {
    alert("Looks like there was an error authorizing your account :-(")
}

else {
    if (access_token) {
        $.ajax({
            url: "https://api.spotify.com/v1/me",
            headers: {
                "Authorization": "Bearer " + access_token
            },
            success: function (response) { init(response, access_token) }
        })
    }
    else {
        $("#welcome").show()
    }
}

async function init(data, token) {
    let R = [];
    let G = [];
    let B = [];


    console.log(data);

    $("#welcome").hide();
    $("#palette-card").hide();
    $("toggle-div").hide();
    $("#loader").show()

    $("#name").text(`${data.display_name}'s`)

    const { items } = await getTopTracks(token);
    console.log(items);

    calcColor(0, 50, items, token, R, G, B);

}

async function webScrape() {

    const colors = {
        hex_1: removeHash(hex_1.toHexString()),
        hex_2: removeHash(hex_2.toHexString()),
        hex_3: removeHash(hex_3),
        hex_4: removeHash(hex_4.toHexString()),
        hex_5: removeHash(hex_5.toHexString()),
    }

    console.log(colors);

    const url = `/${colors.hex_1}/${colors.hex_2}/${colors.hex_3}/${colors.hex_4}/${colors.hex_5}`;

    const moveForward = await sendColors(url);

    console.log(moveForward);

    if(moveForward === "OK") {

        

        return;
    }

    console.log("Looks like we encountered an error :-(");

}

async function populateTopTen() {

    const { items } = await getTopTracks(access_token);

    $("#top-albums-div h3").css("color", base_color_complement);

    for (let i = 0; i < 12; i++) {

        let border_color;

        if (i <= 3) {
            border_color = hex_1;
        }

        else if (i > 3 && i <= 7) {
            border_color = hex_3;
        }

        else if (i > 7 && i <= 11) {
            border_color = hex_5
        }

        const song_html = $(`
        <div class="song">
            <div class="playbutton animated pulse">
                <i class="medium material-icons">play_circle_outline</i>
            </div>
            <a href="${items[i].external_urls.spotify}" target="_blank"><img alt="album cover" class="hoverable" style="border: 5px solid ${border_color}" src="${items[i].album.images[0].url}"></a>
            <strong><span class="song-name truncate">${items[i].name}</span></strong>
        </div>
        `);

        $(".song-div").append(song_html);
    }
}

function rgbToHex(rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

function fullColorHex(r, g, b) {
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return "#" + red + green + blue;
};

async function calcColor(i_min, i_max, items, token, R, G, B) {
    let RedAVG;
    let GreenAVG;
    let BlueAVG;

    for (let i = i_min; i < i_max; i++) {

        const audio_features = await getAudioFeatures(items[i].id, token);

        const danceability = audio_features.danceability;
        const valence = audio_features.valence;
        const energy = audio_features.energy;

        calcDanceability(danceability, R, G, B);
        calcValence(valence, R, G, B);
        calcEnergy(energy, R, G, B);

        RedAVG = calcAverage(R);

        GreenAVG = calcAverage(G);

        BlueAVG = calcAverage(B);
    }

    console.log("Amount of songs with high energy: " + high_energy_count);
    console.log("Amount of songs with high danceability: " + high_dance_count);
    console.log("Amount of songs with high valence: " + high_valence_count);

    let avg_energy = calcAverage(energy_arr);
    let avg_dance = calcAverage(dance_arr);
    let avg_valence = calcAverage(valence_arr);

    //hard coded to test


    console.log("Average Energy: " + avg_energy.toFixed(2));
    console.log("Average Danceability: " + avg_dance.toFixed(2));
    console.log("Average Valence: " + avg_valence.toFixed(2));

    if (high_dance_count == high_energy_count && high_dance_count === high_valence_count) {
        console.log("all the same!")
        // neutral colors
        // r 244 - 255
        // g 218-255
        // b 209-230

        const red = Math.random() * (255 - 244) + 244;
        const green = Math.random() * (255 - 218) + 218;
        const blue = Math.random() * (230 - 209) + 209;

        console.log(red, green, blue);


        const base_color_hex = fullColorHex(red.toFixed(), green.toFixed(), blue.toFixed());
        // const base_color_hex = "#e990fd"

        assignAnalogousBigSpin(base_color_hex);

        $("#loader").hide();

        $("#palette-card").show();

        $("#toggle-div").show()

        return;

    }

    else if (high_valence_count == high_energy_count && high_valence_count > high_dance_count) {
        console.log("similar valence and energy");
        //red to yellow color palette
        const base_color_hex = "#ec5300";
        // const base_color_hex = "#e990fd"

        assignAnalogousBigSpin(base_color_hex);

        $("#loader").hide();

        $("#palette-card").show();

        $("#toggle-div").show()

        return;

    }

    else if (high_energy_count == high_dance_count && high_energy_count > high_valence_count) {
        console.log("similar energy and dance")
        //pastel

        //r 229-255
        //g 123-185
        //b 113-255
        //Math.random() * (255 - 200) + 200
        const red = Math.random() * (255 - 229) + 229;
        const green = Math.random() * (185 - 123) + 123;
        const blue = Math.random() * (255 - 113) + 113;

        console.log(red, green, blue)


        const base_color_hex = fullColorHex(red.toFixed(), green.toFixed(), blue.toFixed());
        // const base_color_hex = "#e990fd"

        assignAnalogousBigSpin(base_color_hex);

        $("#loader").hide();

        $("#palette-card").show();

        $("#toggle-div").show()

        return;
    }

    else if (high_valence_count == high_dance_count && high_valence_count > high_energy_count) {
        console.log("similar valence and dance")
        //neon

        const which_neon = Math.floor(Math.random() * 4);

        let base_color_hex;

        switch (which_neon) {
            case 0:
                base_color_hex = '#7fff00';
                break;
            case 1:
                base_color_hex = '#faed27';
                break;
            case 2:
                base_color_hex = '#fb33db';
                break;
            case 3:
                base_color_hex = '#0310ea';
                break;
        }


        assignAnalogousBigSpin(base_color_hex);

        $("#loader").hide();

        $("#palette-card").show();

        $("#toggle-div").show()

        return;
    }

    else if (high_dance_count > high_energy_count && high_dance_count > high_valence_count) {
        console.log("high dance selected");
        //this will deal with orange so rgb => red must 255 and blue must be 0
        //rgb(255, ???, ???)
        //75-174 
        //0-100


        if (avg_dance === .5) {
            const base_color_hex = "#ffa500"

            assignAnalogousSmallSpin(base_color_hex)

            return;
        }

        else if (avg_dance > .5) {
            const green = Math.floor(Math.random() * 175) + 75;
            const blue = Math.floor(Math.random() * 101);

            const base_color_hex = fullColorHex(255, green, blue);

            assignAnalogousSmallSpin(base_color_hex)

            return;
        }
        else {
            const red = Math.floor(Math.random() * 66);
            const green = Math.floor(Math.random() * 256);

            const base_color_hex = fullColorHex(red, green, 255);

            assignAnalogousSmallSpin(base_color_hex)

            return;
        }
    }

    else if (high_energy_count > high_dance_count && high_energy_count > high_valence_count) {
        console.log("high energy selected");
        //this will deal with red
        //rgb (255, ???, ???)
        //rgb(255, 0, ???)

        if (avg_energy === .5) {
            const base_color_hex = "#ff0000"

            assignAnalogousSmallSpin(base_color_hex)

            return;
        }

        else if (avg_energy > .5) {
            const light_or_bright = Math.random(Math.floor() * 2)

            if (light_or_bright === 1) {
                const b_and_g = Math.floor(Math.random() * 101);

                const base_color_hex = fullColorHex(255, b_and_g, b_and_g);

                assignAnalogousSmallSpin(base_color_hex)

                return;
            }

            const blue = Math.floor(Math.random() * 171);

            const base_color_hex = fullColorHex(255, 0, blue);

            assignAnalogousSmallSpin(base_color_hex)

            return;
        }

        else {
            const red = Math.floor(Math.random() * 156);
            const blue = Math.floor(Math.random() * 133);

            const base_color_hex = fullColorHex(red, 255, blue);

            assignAnalogousSmallSpin(base_color_hex);

            $("#color-5").attr("style", `background-color: ${hex_5}`);

            return;
        }

    }

    else if (high_valence_count > high_dance_count && high_valence_count > high_energy_count) {
        console.log("high valence selected");
        //this will deal with red
        //rgb (255, ???, ???)
        //rgb(255, 0, ???)

        if (avg_valence === .5) {
            const base_color_hex = "#ffff00"

            assignAnalogousSmallSpin(base_color_hex)

            return;
        }

        else if (avg_valence > .5) {
            const test = Math.random() * (255 - 200) + 200;

            const base_color_hex = fullColorHex(255, test.toFixed(), 0);

            assignAnalogousSmallSpin(base_color_hex)

            return;
        }

        else {
            //r => 95-142
            //g => 13
            //b => 159 228

            const red = Math.random() * (142 - 95) + 95;
            const blue = Math.random() * (228 - 159) + 159;

            console.log(red, blue);

            const base_color_hex = fullColorHex(red.toFixed(), 13, blue.toFixed());

            assignAnalogousSmallSpin(base_color_hex);

            return;
        }

    }

}

function calcEnergy(energy, R_array, G_array, B_array) {
    let chosen_color;
    let color_value;

    energy_arr.push(energy);

    if (energy <= .25) {

        chosen_color = "G"

        color_value = 255 * energy;

        G_array.push(color_value.toFixed());


        return;
    }

    else if (energy >= .25 && energy <= .5) {
        const b_or_g = Math.floor(Math.random() * 2)

        if (b_or_g === 1) {

            chosen_color = "G"

            color_value = 255 * energy;

            G_array.push(color_value.toFixed());



            return;
        }

        chosen_color = "B"

        color_value = 255 * energy;

        B_array.push(color_value.toFixed());


        return;
    }


    else if (energy >= .5 && energy <= .75) {
        const high_or_low = Math.floor(Math.random() * 2);

        if (high_or_low === 1) {

            chosen_color = 'R'

            color_value = 255 * energy;

            R_array.push(color_value.toFixed());



            return;
        }

        chosen_color = 'G'

        color_value = 255 * energy;

        G_array.push(color_value.toFixed());

        return;
    }

    else if (energy >= .75) {

        chosen_color = 'R'

        color_value = 255 * energy;

        R_array.push(color_value.toFixed());


        high_energy_count++;

        return;
    }
}

function calcValence(valence, R_array, G_array, B_array) {
    let chosen_color;
    let color_value;

    valence_arr.push(valence);

    if (valence <= .25) {

        chosen_color = "B"

        color_value = 255 * valence;

        B_array.push(color_value.toFixed());


        return;
    }

    else if (valence >= .25 && valence <= .5) {
        const b_or_g = Math.floor(Math.random() * 2)

        if (b_or_g === 1) {

            chosen_color = "G"

            color_value = 255 * valence;

            G_array.push(color_value.toFixed());



            return;
        }

        chosen_color = "B"

        color_value = 255 * valence;

        B_array.push(color_value.toFixed());


        return;
    }


    else if (valence >= .5 && valence <= .75) {
        const high_or_low = Math.floor(Math.random() * 2);

        if (high_or_low === 1) {

            chosen_color = 'R'

            color_value = 255 * valence;

            R_array.push(color_value.toFixed());



            return;
        }

        chosen_color = 'B'

        color_value = 255 * valence;

        B_array.push(color_value.toFixed());


        return;
    }

    else if (valence >= .75) {

        chosen_color = 'R'

        color_value = 255 * valence;

        R_array.push(color_value.toFixed());


        high_valence_count++;

        return;
    }
}

function calcDanceability(danceability, R_array, G_array, B_array) {
    let chosen_color;
    let color_value;

    dance_arr.push(danceability);

    if (danceability <= .25) {

        chosen_color = "B"

        color_value = 255 * danceability;

        B_array.push(color_value.toFixed());

        return;
    }

    else if (danceability >= .25 && danceability <= .5) {
        const b_or_g = Math.floor(Math.random() * 2)

        if (b_or_g === 1) {

            chosen_color = "G"

            color_value = 255 * danceability;

            G_array.push(color_value.toFixed());


            return;
        }

        chosen_color = "B"

        color_value = 255 * danceability;

        B_array.push(color_value.toFixed());

        return;
    }


    else if (danceability >= .5 && danceability <= .75) {
        const high_or_low = Math.floor(Math.random() * 2);

        if (high_or_low === 1) {
            chosen_color = 'R'

            color_value = 255 * danceability;

            R_array.push(color_value.toFixed());


            return;
        }

        chosen_color = 'B'

        color_value = 255 * danceability;

        B_array.push(color_value.toFixed());

        return;
    }

    else if (danceability >= .75) {

        chosen_color = 'R'

        color_value = 255 * danceability;

        R_array.push(color_value.toFixed());

        high_dance_count++;

        return;
    }
}

function sendColors(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: "POST",
            url: url,
        }).then(function(response) {
            resolve(response);
        })
    })
}

function getTopTracks(token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://api.spotify.com/v1/me/top/tracks?limit=50",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (data) {
                resolve(data)
            }
        });
    });
}

function getAudioFeatures(id, token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://api.spotify.com/v1/audio-features/${id}`,
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (data) {
                resolve(data);
            }
        });
    });
};

function getAudioAnalysis(id, token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://api.spotify.com/v1/audio-analysis/${id}`,
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (data) {
                resolve(data);
            }
        })
    })
};

function calcAverage(array) {
    let total = 0;

    for (let i = 0; i < array.length; i++) {

        total += parseFloat(array[i]);

    };

    return total / parseInt(array.length);
};

function assignAnalogousBigSpin(base_color_hex) {
    hex_3 = base_color_hex;

    const complement_base = hexToComplimentary(hex_3);

    $("#color-3").attr("style", `background-color: ${base_color_hex}`);

    $("#color-3-text").text(hex_3);

    base_color_complement = tinycolor(complement_base).darken(20).toHexString();

    hex_1 = tinycolor(base_color_hex).spin(25).saturate(20);

    $("#color-1").attr("style", `background-color: ${hex_1}`);

    $("#color-1-text").text(hex_1);

    hex_2 = tinycolor(base_color_hex).spin(20).desaturate(20).darken(6);

    $("#color-2").attr("style", `background-color: ${hex_2}`);

    $("#color-2-text").text(hex_2);

    hex_4 = tinycolor(base_color_hex).spin(-20).desaturate(20).darken(6);

    $("#color-4").attr("style", `background-color: ${hex_4}`);

    $("#color-4-text").text(hex_4);

    hex_5 = tinycolor(base_color_hex).spin(-25).saturate(20);

    $("#color-5").attr("style", `background-color: ${hex_5}`);

    $("#color-5-text").text(hex_5);

    populateTopTen();
}

function assignAnalogousSmallSpin(base_color_hex) {
    hex_3 = base_color_hex;

    const complement_base = hexToComplimentary(hex_3);

    base_color_complement = tinycolor(complement_base).darken(20).toHexString();

    $("#color-3").attr("style", `background-color: ${base_color_hex}`);

    $("#color-3-text").text(hex_3);

    hex_1 = tinycolor(base_color_hex).spin(15).saturate(20);

    $("#color-1").attr("style", `background-color: ${hex_1}`);

    $("#color-1-text").text(hex_1);

    hex_2 = tinycolor(base_color_hex).spin(10).desaturate(20).darken(6);

    $("#color-2").attr("style", `background-color: ${hex_2}`);

    $("#color-2-text").text(hex_2);

    hex_4 = tinycolor(base_color_hex).spin(-10).desaturate(20).darken(6);

    $("#color-4").attr("style", `background-color: ${hex_4}`);

    $("#color-4-text").text(hex_4);

    hex_5 = tinycolor(base_color_hex).spin(-15).saturate(20);

    $("#color-5").attr("style", `background-color: ${hex_5}`);

    $("#color-5-text").text(hex_5);

    populateTopTen();
}

function assignComplementary(base_color_hex) {
    $("#color-3").attr("style", `background-color: ${base_color_hex}`);

    const compliment_one = hexToComplimentary(base_color_hex);

    hex_5 = compliment_one;

    $("#color-5").attr("style", `background-color: ${compliment_one}`);

    compliment_one_darker = tinycolor(compliment_one).darken(20).toHexString()

    hex_4 = compliment_one_darker;

    $("#color-4").attr("style", `background-color: ${compliment_one_darker}`);

    const base_color_hex_lighter = tinycolor(base_color_hex).lighten(20).toHexString();

    hex_2 = base_color_hex_lighter;

    $("#color-2").attr("style", `background-color: ${base_color_hex_lighter}`);

    const base_color_hex_darker = tinycolor(base_color_hex).darken(20).toHexString();

    hex_1 = base_color_hex_darker;

    $("#color-1").attr("style", `background-color: ${base_color_hex_darker}`);
}

function removeHash(hex) {
    return hex.slice(1, hex.length);
}

function hexToComplimentary(hex) {

    // Convert hex to rgb
    // Credit to Denis http://stackoverflow.com/a/36253499/4939630
    var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length / 3 + '})', 'g')).map(function (l) { return parseInt(hex.length % 2 ? l + l : l, 16); }).join(',') + ')';

    // Get array of RGB values
    rgb = rgb.replace(/[^\d,]/g, '').split(',');

    var r = rgb[0], g = rgb[1], b = rgb[2];

    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2.0;

    if (max == min) {
        h = s = 0;  //achromatic
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if (max == r && g >= b) {
            h = 1.0472 * (g - b) / d;
        } else if (max == r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if (max == g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if (max == b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0 + 0;

    // Shift hue to opposite side of wheel and convert to [0-1] value
    h += 180;
    if (h > 360) { h -= 360; }
    h /= 360;

    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    // Convert r b and g values to hex
    rgb = b | (g << 8) | (r << 16);
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
}
