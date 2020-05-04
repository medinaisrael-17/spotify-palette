let hex_1;
let hex_2;
let hex_3;
let hex_4;
let hex_5;

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
    $("#palette-card").show();

    const { items } = await getTopTracks(token);
    console.log(items);

    calcColor(0, 10, items, token, R, G, B, 1, calcColor);

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

async function calcColor(i_min, i_max, items, token, R, G, B, color_number, cb) {

    let final_color;
    let final_color_hex;

    let RedAVG;
    let GreenAVG;
    let BlueAVG;

    for (let i = i_min; i < i_max; i++) {

        const audio_features = await getAudioFeatures(items[i].id, token);

        const danceability = audio_features.danceability;
        const valence = audio_features.valence

        calcDanceability(danceability, R, G, B);
        calcValence(valence, R, G, B);

        // console.log(R);

        // console.log(G);

        // console.log(B);

        RedAVG = calcAverage(R);

        GreenAVG = calcAverage(G);

        BlueAVG = calcAverage(B);

        $(`#color-${color_number}`).attr("style", `background-color: rgb(${RedAVG.toFixed()}, ${GreenAVG.toFixed()}, ${BlueAVG.toFixed()}) `)
    }

    final_color = `rgb(${RedAVG.toFixed()}, ${GreenAVG.toFixed()}, ${BlueAVG.toFixed()})`

    console.log("FINAL COLOR AS RGB: " + final_color);

    let red = RedAVG.toFixed();

    let green = GreenAVG.toFixed();

    let blue = BlueAVG.toFixed();

    final_color_hex = fullColorHex(red, green, blue);

    switch (color_number) {
        case 1:
            hex_1 = final_color_hex;
        case 2:
            hex_2 = final_color_hex;
        case 3:
            hex_3 = final_color_hex;
        case 4:
            hex_4 = final_color_hex;
        case 5:
            hex_5 = final_color_hex;
    }

    console.log("FINAL COLOR AS HEX: " + final_color_hex);

    console.log(`*** DONE WITH COLOR ${color_number} ***`);

    R = [];
    G = [];
    B = [];

    color_number++

    const new_i_min = i_min + 10;

    const new_i_max = i_max + 10;

    if (new_i_min > 40 && new_i_max > 50) {
        console.log("done");
        return;
    }

    cb(new_i_min, new_i_max, items, token, R, G, B, color_number, cb);
}

function calcEnergy(energy, R_array, G_array, B_array) {
    let chosen_color;
    let color_value;

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

        return;
    }
}

function calcValence(valence, R_array, G_array, B_array) {
    let chosen_color;
    let color_value;

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

        return;
    }
}

function calcDanceability(danceability, R_array, G_array, B_array) {
    let chosen_color;
    let color_value;

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

        return;
    }
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

        total += parseInt(array[i]);

    };

    return total / parseInt(array.length);
};
