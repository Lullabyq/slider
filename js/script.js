//0. To add img toggle this variable:
let numberOfImages = 6
// if you want change speed of slider:
let timerDelay = 4000 // (in ms)


// 1. Places buttons of slider
let btnLeft = document.querySelector('.btn--left')
let btnRight = document.querySelector('.btn--right')
let box = document.querySelector('.container__btn')
let translate = btnLeft.offsetWidth / 2

btnLeft.style.left = -translate + 'px'
btnLeft.style.top = box.offsetHeight / 2 -translate + 'px'
btnRight.style.top = box.offsetHeight / 2 -translate + 'px'
btnRight.style.right = -translate + 'px'

box.clientHeight = box.offsetHeight


// 2. (Main part) Makes slider work
function toggleBtnVisibility() {
  if (trackLength - track.scrollLeft < imgWidth / 2) {
    btnRight.classList.add('btn--disabled')
  } else if (track.scrollLeft < imgWidth / 2 ) {
    btnLeft.classList.add('btn--disabled')
    btnRight.classList.remove('btn--disabled')
  } else {
    btnRight.classList.remove('btn--disabled')
    btnLeft.classList.remove('btn--disabled')
  }
}

// When you generate mouseover event on slider it stops autoScroll
// When mouseout event happens slider starts autoscroll
function createInterval() {
  return setInterval(() => {
    if (track.scrollLeft == trackLength) {
      track.scrollLeft = 0
      btnRight.classList.remove('btn--disabled')
      btnLeft.click()
    } else {
      btnRight.click()
    }
  }, timerDelay)
}

function createAutoScroll() {
  new Promise(res => {
    id = createInterval()
    res(id)
  }).then(id => {
    box.addEventListener('pointerenter', clear)
  }).then(() => {
    box.addEventListener('pointerleave', set)
  })
}

// EventListener callback func in order to remove listener
function clear() {
  clearInterval(id)
  flag = "on"
}

// EventListener callback func in order to remove listener
function set() {
  createAutoScroll()
  flag = false
  box.removeEventListener('poiterenter', clear)
  box.removeEventListener('pointerleave', set)
}

function moveTrack (direction, initPosit) {
  let position = track.scrollLeft

  switch (direction) {
    case 'right':
      position += imgWidth
      position = Math.min(position, trackLength)
      break

    case 'left':
      position -= imgWidth
      position = Math.max(position, 0)
      break

    default: position = initPosit
  }
  track.scrollLeft = position
  toggleBtnVisibility()
}

let track = document.querySelector('.track')
let img = document.querySelector('.slider__img')
let imgWidth = img.offsetWidth
let trackLength = imgWidth * (numberOfImages - 1)
let id   // timer id
let flag // indicator for resize listentrack.scrollLeft

createAutoScroll()
toggleBtnVisibility()


//============Event listeners Block======================

box.addEventListener('click', function(event) {

  if (event.target.tagName == 'INPUT') {
    // Switch text in checkbox
    let text = event.target.closest('label').firstChild
    let bindedClass = event.target.dataset.toggle
    let interface = box.querySelector(`.${bindedClass}`)

    if (text.data == 'Show description') {
      text.data = 'Hide'
      interface.classList.remove('slider__text--hidden')
      text.parentNode.classList.remove('checkboxContainer__top')
    } else {
      text.data = 'Show description'
      interface.classList.add('slider__text--hidden')
      text.parentNode.classList.add('checkboxContainer__top')
    }
  }
  // Slide images
  let target = event.target.closest('button')
  if (!target) return

  if (target.classList.contains("btn--right")) {
      moveTrack('right')
    } else if (target.classList.contains("btn--left")) {
      moveTrack('left')
  }
})

box.addEventListener('touchmove', () => {
  setTimeout(toggleBtnVisibility, 200)
})

// In order to use touch swipes on mobile
function disableBtn() {
  if (document.documentElement.clientWidth < 575) {
    btnLeft.style.display = 'none'
    btnRight.style.display = 'none'
  } else {
    btnLeft.style.display = ''
    btnRight.style.display = ''
  }
}

window.addEventListener('resize', disableBtn)
window.addEventListener('load', disableBtn)

// =============================================================


// 3. Places progressBar for slider
let images = track.querySelectorAll('.slider__img')
let progress = track.querySelectorAll('.progress')

for (let i = 0; i < images.length; i++) {
  let span = images[i].firstElementChild

  images[i].dataset.progress = `${i + 1}/${images.length}`
  span.innerHTML = `${i + 1} / ${images.length}`
}


// 4 Adaptive features (308px is min divice maintained width)

//This listener needs for better developer experiense with window resizing (user don't usually resize browser, esp. on mobile)
window.addEventListener('resize', () => {
  clearInterval(id)
  let count = Math.abs(track.scrollLeft / imgWidth)
  let img = document.querySelector('.slider__img')//Dynamic link

  imgWidth = img.offsetWidth // Current width of img
  track.scrollLeft = -imgWidth * count
  trackLength = imgWidth * (numberOfImages - 1) // Update total length

  // Resize on current slide feels weird:
  // moveTrack('length', position)

  moveTrack('custom', 0)
  if (!flag) createAutoScroll() // in case you resize browser with mouseover the slider (ye, you can do it in devTools)
})