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
    $(this).children(".source-box").removeClass("fadeOut");
    $(this).children(".source-box").addClass("fadeIn");
    $(this).children(".source-box").css("display", "block");
}).on("mouseleave", ".image", function () {
    $(this).children(".source-box").removeClass("fadeIn")
    $(this).children(".source-box").addClass("fadeOut");
    // $(this).children(".source-box").css("display", "none");
})

$(document).on("click", "#refresh", function () {
    window.location.reload();
})

//showing the palette card
$("#view_palette").click(function () {
    //hide the music div
    $("#top-albums-div").removeClass("slideInUp");
    $("#view_music").removeClass("disabled")
    $("#top-albums-div").addClass("slideOutUp");
    $("#top-albums-div").hide();

    //hide the images div
    $("#similar-images").removeClass("slideInUp");
    $("#view_images").removeClass("disabled");
    $("#similar-images").addClass("slideOutUp");
    $("#similar-images").hide();


    $("#palette-card").show()
    $("#palette-card").removeClass("slideOutUp");
    $("#palette-card").addClass("slideInUp");
    $("#view_palette").addClass("disabled");
})

//showing the music div 
$("#view_music").click(function () {
    //hide the palette card
    $("#palette-card").removeClass("slideInUp");
    $("#view_palette").removeClass("disabled")
    $("#palette-card").addClass("slideOutUp");
    $("#palette-card").hide();

    //hide the images div
    $("#similar-images").removeClass("slideInUp");
    $("#view_images").removeClass("disabled");
    $("#similar-images").addClass("slideOutUp");
    $("#similar-images").hide();


    $("#top-albums-div").show()
    $("#top-albums-div").removeClass("slideOutUp");
    $("#top-albums-div").addClass("slideInUp");
    $("#view_music").addClass("disabled");
})


//showing the images div
$("#view_images").click(function () {
    //set the colors of the circular palette
    $("#palette-1").css("background-color", hex_1);
    $("#palette-2").css("background-color", hex_2);
    $("#palette-3").css("background-color", hex_3);
    $("#palette-4").css("background-color", hex_4);
    $("#palette-5").css("background-color", hex_5);


    //hide the albums div
    $("#top-albums-div").removeClass("slideInUp");
    $("#view_music").removeClass("disabled")
    $("#top-albums-div").addClass("slideOutUp");
    $("#top-albums-div").hide();

    //hide the palette div
    $("#palette-card").removeClass("slideInUp");
    $("#view_palette").removeClass("disabled");
    $("#palette-card").addClass("slideOutUp");
    $("#palette-card").hide();


    $("#similar-images").show()
    $("#similar-images").removeClass("slideOutUp");
    $("#similar-images").addClass("slideInUp");
    $("#view_images").addClass("disabled");

    webScrape();
});

$("#toggle-album-view").click(function() {
    const value = $(this).attr("data-view");

    $(".song-div").toggle();

    if (value == "show-palette-albums") {
        $(this).text("Show Your Top Albums");
        $(this).attr("data-view", "show-top-albums");
    }
    else {
        $(this).text("Show Album Art With Your Palette");
        $(this).attr("data-view", "show-palette-albums");
    }
    
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
    alert("Looks like there was an error authorizing your account :-( Try opening this in a new tab")
}

else {
    if (access_token) {
        $.ajax({
            url: "https://api.spotify.com/v1/me",
            headers: {
                "Authorization": "Bearer " + access_token
            },
            success: function (response) { init(response, access_token) },
            error: function (err) {
                const toastHTML = '<span>Erorr getting data :-( Try refreshing the page or opening in a new tab</span><button id="refresh" class="btn-flat toast-action" style="color:#69f0ae ">REFRESH</button>';
                M.toast({ html: toastHTML, displayLength: 10000 });
            }
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

    $("#welcome").hide();
    $("#palette-card").hide();
    $("toggle-div").hide();
    $("#loader").show()

    $("#name").text(`${data.display_name}'s`)

    const { items } = await getTopTracks(token);

    calcColor(0, 50, items, token, R, G, B);

}

async function webScrape() {

    $("#images-div").html(`
    <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue">
            <div class="circle-clipper left">
                <div class="circle"></div>
            </div>
            <div class="gap-patch">
                <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
                <div class="circle"></div>
            </div>
        </div>

        <div class="spinner-layer spinner-red">
            <div class="circle-clipper left">
                <div class="circle"></div>
            </div>
            <div class="gap-patch">
                <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
                <div class="circle"></div>
            </div>
        </div>

        <div class="spinner-layer spinner-yellow">
            <div class="circle-clipper left">
                <div class="circle"></div>
            </div>
            <div class="gap-patch">
                <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
                <div class="circle"></div>
            </div>
        </div>

        <div class="spinner-layer spinner-green">
            <div class="circle-clipper left">
                <div class="circle"></div>
            </div>
            <div class="gap-patch">
                <div class="circle"></div>
            </div>
            <div class="circle-clipper right">
                <div class="circle"></div>
            </div>
        </div>
    </div>
    `)

    let colors;

    try {
        colors = {
            hex_1: removeHash(hex_1.toHexString()),
            hex_2: removeHash(hex_2.toHexString()),
            hex_3: removeHash(hex_3),
            hex_4: removeHash(hex_4.toHexString()),
            hex_5: removeHash(hex_5.toHexString()),
        }
    }
    catch {
        colors = {
            hex_1: removeHash(hex_1),
            hex_2: removeHash(hex_2),
            hex_3: removeHash(hex_3),
            hex_4: removeHash(hex_4),
            hex_5: removeHash(hex_5),
        }
    }

    const url = `/${colors.hex_1}/${colors.hex_2}/${colors.hex_3}/${colors.hex_4}/${colors.hex_5}`;

    const moveForward = await sendColors(url);

    if (moveForward === "OK") {

        let scraped_images;

        try {
            scraped_images = await getImageData();
        }

        catch {
            const toastHTML = '<span>Erorr getting images :-( Try refreshing the page</span><button id="refresh" class="btn-flat toast-action" style="color:#69f0ae ">REFRESH</button>';
            M.toast({ html: toastHTML, displayLength: 8000 });
        }

        $("#images-div").html("");

        const row = $(`<div class="my-row"></div>`);

        for (let i = 1; i < 7; i++) {
            const col = $(`<div id="col-${i}" class="my-col" ></div>`);
            row.append(col);
        }

        $("#images-div").append(row);

        let col_num = 1

        for (let i = 0; i < scraped_images.length; i++) {
            const image_html = $(`
            <div class="image animated zoomIn" style="animation-delay: ${i / 12}s">
                <div class="source-box animated faster">
                    <a href="${scraped_images[i].img_src}" target="_blank">SOURCE <i class="tiny material-icons">open_in_new</i></a>
                </div>
                <img class="hoverable" alt="image with palette"
                    src="${scraped_images[i].img_url ? scraped_images[i].img_url : "https://www.ajactraining.org/wp-content/uploads/2019/09/image-placeholder.jpg"}" />
            </div>
            `);

            if (col_num === 1) {
                $("#col-1").append(image_html);
                col_num++;
                continue;
            }

            else if (col_num === 2) {
                $("#col-2").append(image_html);
                col_num++;
                continue;
            }

            else if (col_num === 3) {
                $("#col-3").append(image_html);
                col_num++;
                continue;
            }

            else if (col_num === 4) {
                $("#col-4").append(image_html);
                col_num++
                continue;
            }
            else if (col_num === 5) {
                $("#col-5").append(image_html);
                col_num++
                continue;
            }
            else if (col_num === 6) {
                $("#col-6").append(image_html);
                col_num = 1;
                continue;
            }
        }

        $("body").css("overflow-y", "scroll")

        for (let i = 1; i < 7; i++) {

            if (i === 1) {
                calcPlaceholders(1)
                continue;
            }

            else if (i === 2) {
                calcPlaceholders(2)
                continue;
            }

            else if (i === 3) {
                calcPlaceholders(3)
                continue;
            }

            else if (i === 4) {
                calcPlaceholders(4)
            }
            else if (i === 5) {
                calcPlaceholders(5)
                continue;
            }
            else if (i === 6) {
                calcPlaceholders(6)
                continue;
            }
        }

        return;
    }

}

function calcPlaceholders(col_num) {
    let col_subarea = 0;
    let empty_area;
    let rectangle_width;
    let rectangle_length;
    let area_per_rectangle;

    const col_area = $(`#col-${col_num}`).height() * $(`#col-${col_num}`).width();

    $(`#col-${col_num} > div`).each(function () {
        col_subarea += $(this).height() * $(this).width()
    });

    // if (col_area == col_subarea) {
    //     return;
    // }

    empty_area = col_area - col_subarea;

    rectangle_width = $(`#col-${col_num}`).width();

    area_per_rectangle = empty_area / 3 //because I want three rectangles

    rectangle_length = area_per_rectangle / rectangle_width //algebra to find the remaining length

    //background: radial-gradient(circle, rgba(255,143,117,1) 0%, rgba(231,123,111,1) 25%, rgba(249,123,152,1) 50%, rgba(231,111,178,1) 75%, rgba(255,117,206,1) 100%);
    //background: linear-gradient(145deg, rgba(255,143,117,1) 0%, rgba(231,123,111,1) 25%, rgba(249,123,152,1) 50%, rgba(231,111,178,1) 75%, rgba(255,117,206,1) 100%)

    for (let i = 1; i < 10; i++) {
        const which_background = Math.floor(Math.random() * 7);
        const what_size = Math.random() * (20 - 7) + 7;

        if (which_background === 0) {
            const personal_placeholder = $(`
            <div class="image personal-placeholder hoverable animated zoomIn"
            style="height: calc(100% / ${what_size}); background-color: ${hex_1};"
            >
            <div class="source-box animated faster">
                    <p>Machine Generated</p>
                </div>
            </div>
            `)

            $(`#col-${col_num}`).append(personal_placeholder);

            continue;
        }

        else if (which_background === 1) {
            const personal_placeholder = $(`
            <div class="image personal-placeholder hoverable animated zoomIn"
            style="height: calc(100% / ${what_size}); background-color: ${hex_2};"
            >
            <div class="source-box animated faster">
                    <p>Machine Generated</p>
                </div>
            </div>
            `)

            $(`#col-${col_num}`).append(personal_placeholder);

            continue;
        }

        else if (which_background === 2) {
            const personal_placeholder = $(`
            <div class="image personal-placeholder hoverable animated zoomIn"
            style="height: calc(100% / ${what_size}); background: radial-gradient(circle, ${hex_1} 0%, ${hex_2} 25%, ${hex_3} 50%, ${hex_4} 75%, ${hex_5} 100%);"
            >
            <div class="source-box animated faster">
                    <p>Machine Generated</p>
                </div>
            </div>
            `)

            $(`#col-${col_num}`).append(personal_placeholder);

            continue;
        }

        else if (which_background === 3) {
            const personal_placeholder = $(`
            <div class="image personal-placeholder hoverable animated zoomIn"
            style="height: calc(100% / ${what_size}); background: linear-gradient(145deg, ${hex_1} 0%, ${hex_2} 25%, ${hex_3} 50%, ${hex_4} 75%, ${hex_5} 100%);"
            >
            <div class="source-box animated faster">
                    <p>Machine Generated</p>
                </div>
            </div>
            `)

            $(`#col-${col_num}`).append(personal_placeholder);

            continue;
        }

        else if (which_background === 4) {
            const personal_placeholder = $(`
            <div class="image personal-placeholder hoverable animated zoomIn"
            style="height: calc(100% / ${what_size}); background-color: ${hex_3};"
            >
            <div class="source-box animated faster">
                    <p>Machine Generated</p>
                </div>
            </div>
            `)

            $(`#col-${col_num}`).append(personal_placeholder);

            continue;
        }

        else if (which_background === 5) {
            const personal_placeholder = $(`
            <div class="image personal-placeholder hoverable animated zoomIn"
            style="height: calc(100% / ${what_size}); background-color: ${hex_4};"
            >
            <div class="source-box animated faster">
                    <p>Machine Generated</p>
                </div>
            </div>
            `)

            $(`#col-${col_num}`).append(personal_placeholder);

            continue;
        }

        else if (which_background === 6) {
            const personal_placeholder = $(`
            <div class="image personal-placeholder hoverable animated zoomIn"
            style="height: calc(100% / ${what_size}); background-color: ${hex_5};"
            >
            <div class="source-box animated faster">
                    <p>Machine Generated</p>
                </div>
            </div>
            `)

            $(`#col-${col_num}`).append(personal_placeholder);

            continue;
        }
    }

    return;

}

async function populateTopTen() {

    const { items } = await getTopTracks(access_token);

    $("#top-albums-div h3").css("color", base_color_complement);

    for (let i = 0; i < 15; i++) {

        let border_color;

        if (i <= 2) {
            border_color = hex_1;
        }

        else if (i > 2 && i <= 5) {
            border_color = hex_2;
        }

        else if (i > 5 && i <= 8) {
            border_color = hex_3
        }

        else if (i > 8 && i <= 11) {
            border_color = hex_4
        }

        else if (i > 11 && i <= 14) {
            border_color = hex_5
        }

        const song_html = $(`
        <div class="song">
            <div class="playbutton animated faster fadeIn">
                <a href="${items[i].external_urls.spotify}" target="_blank"><i class="medium material-icons">play_circle_outline</i></a>
            </div>
            <a href="${items[i].external_urls.spotify}" target="_blank"><img alt="album cover" class="hoverable" style="border: 5px solid ${border_color}" src="${items[i].album.images[0].url}"></a>
            <strong><span class="song-name truncate">${items[i].name}</span></strong>
        </div>
        `);

        $("#song-div-1").append(song_html);
    }
    

    $("iframe").attr("src", `http://predominant.ly/${removeHash(hex_3)}`);
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

    let avg_energy = calcAverage(energy_arr);
    let avg_dance = calcAverage(dance_arr);
    let avg_valence = calcAverage(valence_arr);

    let avg_dance_percent = avg_dance * 100
    let avg_energy_percent = avg_energy * 100
    let avg_valence_percent = avg_valence * 100


    if (high_dance_count == high_energy_count && high_dance_count === high_valence_count) {
        // neutral colors
        // r 244 - 255
        // g 218-255
        // b 209-230

        const red = Math.random() * (255 - 244) + 244;
        const green = Math.random() * (255 - 218) + 218;
        const blue = Math.random() * (230 - 209) + 209;


        const base_color_hex = fullColorHex(red.toFixed(), green.toFixed(), blue.toFixed());
        // const base_color_hex = "#e990fd"

        assignAnalogousBigSpin(base_color_hex);

        $("#loader").hide();

        const p1 = $(`<p class="animated fadeIn delay-5s">You have an <strong>equal</strong> amount of songs with high energy, dance, and valence—giving you a <span style="color: brown;">neutral</span> palette.</p>`);

        const ul = $(
            `
            <ul class="animated fadeIn delay-5s">
                <li>Your Songs Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                <li>Your Songs Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                <li>Your Songs Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
            </ul>
            `
        )

        $("#your-data").append(p1)
        $("#your-data").append(ul)

        $("#palette-card").show();

        $("#toggle-div").show()

        return;

    }

    else if (high_valence_count == high_energy_count && high_valence_count > high_dance_count) {
        //red to yellow color palette
        const base_color_hex = "#ec5300";
        // const base_color_hex = "#e990fd"

        assignAnalogousBigSpin(base_color_hex);

        $("#loader").hide();

        const p1 = $(`<p class="animated fadeIn delay-5s">You have high valence and energetic songs—giving you a <span style="color: ${base_color_hex};">red yellow</span> palette.</p>`);

        const ul = $(
            `
            <ul class="animated fadeIn delay-5s">
                <li>Your Songs Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                <li>Your Songs Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                <li>Your Songs Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
            </ul>
            `
        )

        $("#your-data").append(p1)
        $("#your-data").append(ul)

        $("#palette-card").show();

        $("#toggle-div").show()

        return;

    }

    else if (high_energy_count == high_dance_count && high_energy_count > high_valence_count) {
        //pastel

        //r 229-255
        //g 123-185
        //b 113-255
        //Math.random() * (255 - 200) + 200
        const red = Math.random() * (255 - 229) + 229;
        const green = Math.random() * (185 - 123) + 123;
        const blue = Math.random() * (255 - 113) + 113;



        const base_color_hex = fullColorHex(red.toFixed(), green.toFixed(), blue.toFixed());
        // const base_color_hex = "#e990fd"

        assignAnalogousBigSpin(base_color_hex);

        $("#loader").hide();

        const p1 = $(`<p class="animated fadeIn delay-5s">You have highly danceable and energetic songs—giving you a <span style="color: ${base_color_hex};">pastel</span> palette.</p>`);

        const ul = $(
            `
            <ul class="animated fadeIn delay-5s">
                <li>Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                <li>Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                <li>Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
            </ul>
            `
        )

        $("#your-data").append(p1)
        $("#your-data").append(ul)

        $("#palette-card").show();

        $("#toggle-div").show()

        return;
    }

    else if (high_valence_count == high_dance_count && high_valence_count > high_energy_count) {
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

        const p1 = $(`<p class="animated fadeIn delay-5s">You have high valence and danceable songs—giving you a <span style="color: ${base_color_hex};">neon</span> palette.</p>`);

        const ul = $(
            `
            <ul class="animated fadeIn delay-5s">
                <li>Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                <li>Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                <li>Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
            </ul>
            `
        )

        $("#your-data").append(p1)
        $("#your-data").append(ul)

        $("#palette-card").show();

        $("#toggle-div").show()

        return;
    }

    else if (high_dance_count > high_energy_count && high_dance_count > high_valence_count) {
        //this will deal with orange so rgb => red must 255 and blue must be 0
        //rgb(255, ???, ???)
        //75-174 
        //0-100


        if (avg_dance === .5) {
            const base_color_hex = "#ffa500"

            assignAnalogousSmallSpin(base_color_hex)


            $("#loader").hide();

            const p1 = $(`
            <p class="animated fadeIn delay-5s">Your have more danceable songs—giving you an <span style="color: ${base_color_hex};">orange</span> palette.</p>
            <p class="animated fadeIn delay-5s"> <span style="color: ${base_color_hex};">Orange</span> is the color of movement.</p>
            `);

            const ul = $(
                `
                <ul class="animated fadeIn delay-5s">
                    <li>Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                    <li>Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                    <li>Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
                </ul>
                `
            )

            $("#your-data").append(p1)
            $("#your-data").append(ul)

            $("#palette-card").show();

            $("#toggle-div").show()

            return;
        }

        else if (avg_dance > .5) {
            const green = Math.floor(Math.random() * 175) + 75;
            const blue = Math.floor(Math.random() * 101);

            const base_color_hex = fullColorHex(255, green, blue);

            assignAnalogousSmallSpin(base_color_hex)


            $("#loader").hide();

            const p1 = $(`
            <p class="animated fadeIn delay-5s">Your have more danceable songs—giving you an <span style="color: ${base_color_hex};">orange</span> palette.</p>
            <p class="animated fadeIn delay-5s"> <span style="color: ${base_color_hex};">Orange</span> is the color of movement.</p>
            `);

            const ul = $(
                `
                <ul class="animated fadeIn delay-5s">
                    <li>Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                    <li>Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                    <li>Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
                </ul>
                `
            )

            $("#your-data").append(p1);
            $("#your-data").append(ul)

            $("#palette-card").show();

            $("#toggle-div").show()

            return;
        }
        else {
            const green = Math.floor(Math.random() * 175) + 75;
            const blue = Math.floor(Math.random() * 101);

            const base_color_hex = fullColorHex(255, green, blue);

            assignComplementary(base_color_hex);


            $("#loader").hide();

            const p1 = $(`
            <p class="animated fadeIn delay-5s">Your have more danceable songs—giving you an <span style="color: ${base_color_hex};">orange</span> palette.</p>
            <p class="animated fadeIn delay-5s"><span style="color: ${base_color_hex};">Orange</span> is the color of movement. Your calming average also renders its <span style="color: ${hex_5}">complementary color</span>.</p>
            `)

            const ul = $(
                `
                <ul class="animated fadeIn delay-5s">
                    <li>Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                    <li>Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                    <li>Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
                </ul>
                `
            )

            $("#your-data").append(p1);
            $("#your-data").append(ul)

            $("#palette-card").show();

            $("#toggle-div").show()

            return;
        }
    }

    else if (high_energy_count > high_dance_count && high_energy_count > high_valence_count) {
        //this will deal with red
        //rgb (255, ???, ???)
        //rgb(255, 0, ???)

        if (avg_energy === .5) {
            const base_color_hex = "#ff0000"

            assignAnalogousSmallSpin(base_color_hex)

            const p1 = $(`
            <p class="animated fadeIn delay-5s">Your have more energetic songs—giving you a <span style="color: ${base_color_hex};">red</span> palette.</p>
            <p class="animated fadeIn delay-5s"> <span style="color: ${base_color_hex};">Red</span> is the color of passion or desire and can also be associated with energy.</p>
            `);

            const ul = $(
                `
                <ul class="animated fadeIn delay-5s">
                    <li>Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                    <li>Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                    <li>Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
                </ul>
                `
            )

            $("#your-data").append(p1)
            $("#your-data").append(ul)


            $("#loader").hide();

            $("#palette-card").show();

            $("#toggle-div").show()

            return;
        }

        else if (avg_energy > .5) {
            const light_or_bright = Math.random(Math.floor() * 2)

            if (light_or_bright === 1) {
                const b_and_g = Math.floor(Math.random() * 101);

                const base_color_hex = fullColorHex(255, b_and_g, b_and_g);

                assignAnalogousSmallSpin(base_color_hex);

                const p1 = $(`
                <p class="animated fadeIn delay-5s">Your have more energetic songs—giving you a <span style="color: ${base_color_hex};">red</span> palette.</p>
                <p class="animated fadeIn delay-5s"> <span style="color: ${base_color_hex};">Red</span> is the color of passion or desire and can also be associated with energy.</p>
                `);

                const ul = $(
                    `
                    <ul class="animated fadeIn delay-5s">
                        <li>Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                        <li>Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                        <li>Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
                    </ul>
                    `
                );


                $("#your-data").append(p1)
                $("#your-data").append(ul)


                $("#loader").hide();

                $("#palette-card").show();

                $("#toggle-div").show()

                return;
            }

            const blue = Math.floor(Math.random() * 171);

            const base_color_hex = fullColorHex(255, 0, blue);

            assignAnalogousSmallSpin(base_color_hex);

            const p1 = $(`
                <p class="animated fadeIn delay-5s">Your have more energetic songs—giving you a <span style="color: ${base_color_hex};">red</span> palette.</p>
                <p class="animated fadeIn delay-5s"> <span style="color: ${base_color_hex};">Red</span> is the color of passion or desire and can also be associated with energy.</p>
                `);

            const ul = $(
                `
                    <ul class="animated fadeIn delay-5s">
                        <li>Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                        <li>Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                        <li>Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
                    </ul>
                    `
            );

            $("#your-data").append(p1)
            $("#your-data").append(ul)


            $("#loader").hide();

            $("#palette-card").show();

            $("#toggle-div").show()

            return;
        }

        else {
            const blue = Math.floor(Math.random() * 171);

            const base_color_hex = fullColorHex(255, 0, blue);

            assignComplementary(base_color_hex);

            $("#loader").hide();

            const p1 = $(`
                <p class="animated fadeIn delay-5s">Your have more energetic songs—giving you a <span style="color: ${base_color_hex};">red</span> palette.</p>
                <p class="animated fadeIn delay-5s"> <span style="color: ${base_color_hex};">Red</span> is the color of passion or desire and can also be associated with energy. Your peaceful average has also rendered its <span style="color: ${hex_5}">complementary color</span>. </p>
                `);

            const ul = $(
                `
                    <ul class="animated fadeIn delay-5s">
                        <li>Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                        <li>Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                        <li>Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
                    </ul>
                    `
            );

            $("#your-data").append(p1)
            $("#your-data").append(ul)

            $("#palette-card").show();

            $("#toggle-div").show()

            return;
        }

    }

    else if (high_valence_count > high_dance_count && high_valence_count > high_energy_count) {
        //this will deal with yellow
        //rgb (255, ???, ???)
        //rgb(255, 0, ???)

        if (avg_valence === .5) {
            const base_color_hex = "#ffff00"

            assignAnalogousSmallSpin(base_color_hex)

            const p1 = $(`
                <p class="animated fadeIn delay-5s">Your have more songs with high valence—giving you a <span style="color: #FFE000;">yellow</span> palette.</p>
                <p class="animated fadeIn delay-5s"> <span style="color: #FFE000;">Yellow</span> symbolizes happiness and warmth.</p>
                `);

            const ul = $(
                `
                    <ul class="animated fadeIn delay-5s">
                        <li>Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                        <li>Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                        <li>Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
                    </ul>
                    `
            );

            $("#your-data").append(p1)
            $("#your-data").append(ul)


            $("#loader").hide();

            $("#palette-card").show();

            $("#toggle-div").show()

            return;
        }

        else if (avg_valence > .5) {
            const test = Math.random() * (255 - 200) + 200;
            const blue = Math.random() * (100 - 0) + 0;

            const base_color_hex = fullColorHex(255, test.toFixed(), blue.toFixed());

            assignAnalogousSmallSpin(base_color_hex)

            const p1 = $(`
            <p class="animated fadeIn delay-5s">Your have more songs with high valence—giving you a <span style="color: #FFE000;">yellow</span> palette.</p>
            <p class="animated fadeIn delay-5s"> <span style="color: #FFE000;">Yellow</span> symbolizes happiness and warmth.</p>
            `);

            const ul = $(
                `
                <ul class="animated fadeIn delay-5s">
                    <li>Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                    <li>Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                    <li>Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
                </ul>
                `
            );

            $("#your-data").append(p1)
            $("#your-data").append(ul)


            $("#loader").hide();

            $("#palette-card").show();

            $("#toggle-div").show()

            return;
        }

        else {
            //r => 95-142
            //g => 13
            //b => 159 228

            const test = Math.random() * (255 - 200) + 200;
            const blue = Math.random() * (100 - 0) + 0;

            const base_color_hex = fullColorHex(255, test.toFixed(), blue.toFixed());

            assignComplementary(base_color_hex);

            const p1 = $(`
            <p class="animated fadeIn delay-5s">Your have more songs with high valence—giving you a <span style="color: #FFE000;">yellow</span> palette.</p>
            <p class="animated fadeIn delay-5s"> <span style="color: #FFE000;">Yellow</span> symbolizes happiness and warmth. Your serene average has also rendered its <span style="color:${hex_5}">complementary color</span>.</p>
            `);

            const ul = $(
                `
                <ul class="animated fadeIn delay-5s">
                    <li>Average Danceability: <strong>${avg_dance_percent.toFixed()}%</strong></li>
                    <li>Average Energy: <strong>${avg_energy_percent.toFixed()}%</strong></li>
                    <li>Average Valence (positivty): <strong>${avg_valence_percent.toFixed()}%</strong></li>
                </ul>
                `
            );

            $("#your-data").append(p1)
            $("#your-data").append(ul)

            $("#loader").hide();

            $("#palette-card").show();

            $("#toggle-div").show()


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

function getImageData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/scrape"
        }).then(function (response) {
            resolve(response);
        })
            .catch(function (err) {
                reject(err);
            })
    })
}

function sendColors(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: "POST",
            url: url,
        }).then(function (response) {
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

    hex_3 = base_color_hex;

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

    $("#color-3-text").text(hex_3);
    $("#color-1-text").text(hex_1);
    $("#color-2-text").text(hex_2);
    $("#color-4-text").text(hex_4);
    $("#color-5-text").text(hex_5);

    populateTopTen();
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
