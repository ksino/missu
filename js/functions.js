// variables
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden
let info
let content
var clientWidth = $(window).width()
var clientHeight = $(window).height()

function log() {
    console.log.apply(console, arguments)
}

$(function () {
    // setup garden
    $loveHeart = $("#loveHeart")
    var offsetX = $loveHeart.width() / 2
    var offsetY = $loveHeart.height() / 2 - 55
    $garden = $("#garden")
    gardenCanvas = $garden[0]
    gardenCanvas.width = $("#loveHeart").width()
    gardenCanvas.height = $("#loveHeart").height()
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter"
    garden = new Garden(gardenCtx, gardenCanvas)

    let content = $("#content")
    let width = $loveHeart.width() + $("#code").width()
    content.css("width", width)
    content.css("height", Math.max($loveHeart.height(), $("#code").height()))
    content.css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10))
    content.css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10))

    // renderLoop
    // 渲染爱心图形
    setInterval(function () {
        garden.render();
    }, garden.options.growSpeed)
})

/**
 * 改变窗口大小重新加载
 */
$(window).resize(function () {
    var width = $(window).width()
    var height = $(window).height()
    log("window", width, height)
    if (width != clientWidth && height != clientHeight) {
    //     location.replace(location)
        $("#code").css("width", width)
        $("#code").css("height", height)

    }
})

function resize_heart() {
    let width = window.screen.availWidth
    let height = window.screen.availHeight
    log("window", width, height)
    let heart = $("#loveHeart")
    heart.width
    heart.css("width", width * 0.9)
    heart.css("height", width * 0.9 * 625 / 670)
    $("#code").css("width", width * 2)
    $("#code").css("height", height)
    if ($("#code").width() < 900) {
        $("#code").css("font-size", "2.5em")
        $("#code").css("margin", "auto")
    }
    log("heart", heart.width(), heart.height())
}

function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var y = -20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(offsetX + x, offsetY + y);
}

/**
 * 开始绘制心型图形
 */
function startHeartAnimation() {
    var interval = 50
    var angle = 10
    var heart = new Array()
    var animationTimer = setInterval(function () {
        var bloom = getHeartPoint(angle)
        var draw = true
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i]
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2))
            if (distance < garden.options.bloomRadius.max * 1.3) {
                draw = false
                break
            }
        }
        if (draw) {
            heart.push(bloom)
            garden.createRandomBloom(bloom[0], bloom[1])
        }
        if (angle >= 30) {
            clearInterval(animationTimer)
            show_message()
        } else {
            angle += 0.2
        }
    }, interval)
}

function text_to_html(array) {
    // array是数组 按照回车符号'\r\n' 切割的文本
    length = array.length
    let html = ""
    for (let i = 0; i < length; i++) {
        let current = array[i]

        html += `<span class="comments">${current}</span><br/><br/>`
    }
    return html
}

/**
 * 逐个文字显示
 */
(function ($) {
    $.fn.typewriter = function () {
        this.each(function () {
            let $ele = $(this)
            let str = $ele.html()
            let progress = 0
            let index = 0

            $ele.html('')
            let length = content.length

            str = text_to_html(content)
            let timer = setInterval(function () {
                let current = str.substr(progress, 1)
                // log("current", current)

                if (current === '<') {
                    progress = str.indexOf('>', progress) + 1
                } else {
                    progress++
                }
                // 不明白
                let text = str.substring(0, progress) + (progress & 1 ? '_' : '')
                // log("text", text)
                $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''))
                if (progress >= str.length) {
                    clearInterval(timer)
                }
            }, info.speed)
        })
        return this
    }
})(jQuery)

/**
 * 显示相识的时间
 */
function timeElapse(date) {
    var current = Date()
    var seconds = (Date.parse(current) - Date.parse(date)) / 1000
    var days = Math.floor(seconds / (3600 * 24))
    seconds = seconds % (3600 * 24)
    var hours = Math.floor(seconds / 3600)
    if (hours < 10) {
        hours = "0" + hours
    }
    seconds = seconds % 3600
    var minutes = Math.floor(seconds / 60)
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    seconds = seconds % 60
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    let result = `<span class="digit">${days} 天 </span><span class="digit">${hours}  小时 </span><span class="digit">${minutes} 分 </span><span class="digit">${seconds} 秒</span>`
    $("#elapseClock").html(result)
}

/**
 * 显示心型图的文字
 */
function show_message() {
    adjust_words_position()
    let message = $("#messages")
    let showtime = $("#elapseClock")
    message.html(info.message)
    message.fadeIn(2000, function () {
        showtime.fadeIn(2000)
        showLoveU()
        $("#touch").html(info.tips).hide().fadeIn(6000)
    })
}

/**
 * 显示心型图形里面的署名
 */
function showLoveU() {
    let love = $('#loveu')
    let html = `${info.love}<br/><div class="signature"> ${info.signal}</div>`
    love.html(html)
    love.fadeIn(4000)
}

function adjust_words_position() {
    $('#words').css("position", "absolute")
    $('#words').css("top", $("#garden").position().top + 195)
    $('#words').css("left", $("#garden").position().left + 70)
}

function adjust_letter_position() {
    $('#letter').css("margin-top", ($("#garden").height() - $("#letter").height()) / 2)
}

/**
 * 读取json文件
 */
function get_info() {
    let request = {
        url: "./data/info.json",
        type: "get",
        dataType: "json",
        async: false,
        success: read_letter,
        error: () => {
            log("fail")
        }
    }
    $.ajax(request)
}


function read_letter(data) {
    info = data
    let request = {
        url: `./data/${info.file}`,
        type: "get",
        async: false,
        success: (res) => {
            if (res.indexOf('\r\n') > -1) {
                log(`1111`)
                content = res.split('\r\n')
            } else {
                content = res.split('\n')
            }
            log(content)
        },
        error: () => {
            log("fail")
        }
    }
    $.ajax(request)
}