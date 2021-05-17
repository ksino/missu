// 全局变量
let $window = $(window), gardenCtx, gardenCanvas, $garden, garden
let clientWidth = $(window).width()
let clientHeight = $(window).height()
let info
let content
let count = 0
let text_pos_x = 0
let text_pos_y = 0
let pos_x_min = 0
let pos_y_min = 0
let pos_x_max = 0
let pos_y_max = 0
let offsetX
let offsetY

/**
 * 打印函数
 */
function log() {
    console.log.apply(console, arguments)
}

/**
 * 返回认识的时间
 * @returns {Date}
 */
function get_date() {
    let together = new Date()
    together.setFullYear(info.year, info.month, info.day)
    together.setHours(info.hour)
    together.setMinutes(info.minute)
    together.setSeconds(info.second)
    together.setMilliseconds(0)
    return together
}

/**
 * 启动
 */
$(function() {
    get_info()
    resize_heart()
    // 调试 显示div的边框
    show_border(false)
    // 调试：增加版本号 以确认git page 是否更新
    $("#version").html(`Version © ${info.version}`)
    $("#version").hide()

    // info.is_skip 是否跳过绘制心形图 直接显示信件内容
    if (info.is_skip) {
        $("#heart").hide()
        $("#letter").typewriter()
    } else {
        $("#letter").hide()

        let together = get_date()

        if (document.createElement('canvas').getContext) {
            // 绘制图形
            setTimeout(function () {
                start_heart_animation()
            }, 30)

            $("#clock").hide()
            // 更新时间
            setInterval(function () {
                time_elapse(together)
            }, 500)
        } else {
            $("#letter").hide()
            $("#version").hide()
            document.execCommand("stop")
        }
        setup_garden()
    }
    log("start over")
})

function setup_garden() {
    log("setup garden")
    $garden = $("#garden")
    gardenCanvas = $garden[0]
    gardenCanvas.width = $(window).width()
    gardenCanvas.height = $(window).height()
    log("setup garden", $("#heart").width(), $("#heart").height())
    offsetX = $("#heart").width() / 2
    offsetY = $("#heart").height() / 2 - 55

    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter"
    garden = new Garden(gardenCtx, gardenCanvas)

    // 渲染心形图
    setInterval(function () {
        garden.render();
    }, garden.options.growSpeed)
}

// $(function () {
//     // setup garden
//     log("setup garden")
//     $garden = $("#garden")
//     gardenCanvas = $garden[0]
//     gardenCanvas.width = $(window).width()
//     gardenCanvas.height = $(window).height()
//     offsetX = $("#heart").width() / 2
//     offsetY = $("#heart").height() / 2 - 55
//     text_pos_x = offsetX
//     text_pos_y = offsetY
//
//     // gardenCanvas.width = $("#loveHeart").width()
//     // gardenCanvas.height = $("#loveHeart").height()
//     gardenCtx = gardenCanvas.getContext("2d");
//     gardenCtx.globalCompositeOperation = "lighter"
//     garden = new Garden(gardenCtx, gardenCanvas)
//
//     // let content = $("#content")
//     // let width = $("#loveHeart").width() + $("#code").width()
//     // content.css("width", width)
//     // content.css("height", Math.max($("#loveHeart").height(), $("#code").height()))
//     // content.css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10))
//     // content.css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10))
//
//     // renderLoop
//     // 渲染心形图
//     setInterval(function () {
//         garden.render();
//     }, garden.options.growSpeed)
// })

/**
 * 改变窗口大小重新加载
 */
$(window).resize(function () {
    var width = $(window).width()
    var height = $(window).height()
    log("window", width, height)
    if (width != clientWidth && height != clientHeight) {
        // location.replace(location)
        $("#letter").css("width", width)
        $("#letter").css("height", height)

    }
})

/**
 * 自适应屏幕大小
 */
function resize_heart() {
    // 屏幕的可用宽度和高度
    let width = window.screen.availWidth
    let height = window.screen.availHeight
    log("window", width, height)
     if (width < 900) {
        log("small screen")
        $("#letter").css("font-size", "3rem")
    } else {
        log("big screen")
    }
}

function get_heart_point(angle) {
    let t = angle / Math.PI
    let x = 19.5 * (16 * Math.pow(Math.sin(t), 3))
    let y = -20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    count++
    // log(t, x, y)
    if (count === 51) {
        pos_y_min = y
        text_pos_x = offsetX + x
        text_pos_y = offsetY + y
        log("50 flower", text_pos_x, text_pos_y )
    }
    if (count === 1) {
        pos_y_min = y
        log("50 flower", text_pos_x, text_pos_y )
    }
    //return new Array(offsetX + x, offsetY + y)
    return [offsetX + x, offsetY + y]
}

function get_x() {
    let x_min = 19.5 * (16 * Math.pow(-1, 3))
    let x_max = 19.5 * (16 * Math.pow(1, 3))
    let width = (x_max - x_min)
    let height = (pos_y_max - pos_y_min)
    text_pos_x = x_min + offsetX + width * 0.1
    text_pos_y = pos_y_min + offsetY + height * 0.05
    $("#words").css("width", width * 0.8)
    $("#words").css("height", height * 0.8)
}

/**
 * 绘制心形图
 */
function start_heart_animation() {
    let interval = 50
    let angle = 10
    //let flowers = new Array()
    let blooms = []
    let animationTimer = setInterval(function () {
        let bloom = get_heart_point(angle)
        let draw = true
        for (var i = 0; i < blooms.length; i++) {
            var p = blooms[i]
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2))
            if (distance < garden.options.bloomRadius.max * 1.3) {
                draw = false
                break
            }
        }
        if (draw) {
            blooms.push(bloom)
            garden.createRandomBloom(bloom[0], bloom[1])
        }
        if (angle >= 30) {
            clearInterval(animationTimer)
            show_loving()
            click_heart()
        } else {
            angle += 0.2
        }
    }, interval)
}

function text_to_html(array) {
    length = array.length
    let html = ""
    for (let i = 0; i < length; i++) {
        let current = array[i]

        html += `<span class="comments">${current}</span><br/><br/>`
    }
    return html
}

/**
 * 逐个文字显示，类似打字效果
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
                // 不太明白
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
function time_elapse(date) {
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
    $("#clock").html(result)
}

/**
 * 显示心型图的文字
 */
function show_loving() {
    adjust_words_position()
    let message = $("#loving")
    let showtime = $("#clock")
    message.html(info.message)
    message.fadeIn(2000, function () {
        showtime.fadeIn(2000)
        show_sign()
        $("#tips").html(info.tips).hide().fadeIn(6000)
    })
}

/**
 * 显示心型图形里面的署名
 */
function show_sign() {
    let love = $('#sign')
    let html = `${info.love}<br/><div class="signature"> ${info.signal}</div>`
    love.html(html)
    love.fadeIn(4000)
}

/**
 * click心形图 显示信件文字
 */
function click_heart() {
    let heart = $("#heart")
    heart.click(function () {
        // 显示文字
        $("#main").css("height", "100%")
        $("#letter").show()
        $("#letter").typewriter()
        heart.hide()
    })
}

/**
 * 判断心形图里面的文字显示位置
 */
function adjust_words_position() {
    get_x()
    $('#words').css("position", "absolute")
    $('#words').css("top", text_pos_y)
    $('#words').css("left", text_pos_x)
    // $('#words').css("top", $("#garden").width() + 195)
    // $('#words').css("left", $("#garden").height() + 70)
}

function adjust_letter_position() {
    $('#letter').css("margin-top", ($("#garden").height() - $("#letter").height()) / 2)
}

/**
 * 读取info.json文件
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
                log("get local data")
                content = res.split('\r\n')
            } else {
                content = res.split('\n')
            }
            // log(content)
        },
        error: () => {
            log("fail")
        }
    }
    $.ajax(request)
}

function show_border(flag) {
    let status = "none"
    if (flag) {
        status = "dotted"
    }
    $("#words").css("border-style", status)
    $("#heart").css("border-style", status)
    $("#letter").css("border-style", status)
    $("#version").css("border-style", status)
    $("#content").css("border-style", status)
}