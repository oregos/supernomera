'use strict';
{

    class InstaVideo {

        index = 0

        isPlayed = false
        isErrored = false
        isLoading = false

        swiper
        allVideos

        length = 0

        onEnd = () => {
        }

        onError = () => {
        }

        onProgress = (progress) => {
        }

        onSliderEnd = () => {
        }

        sliderNext = event => {
            if (event && event.target.tagName === "A") {
                this.onSliderEnd()
                return;
            }
            if (!this.allVideos[this.swiper.activeIndex + 1]) {
                this.onSliderEnd()
                return
            }
            this.allVideos.forEach(elem => {
                elem.setPlay(false)
            })
            this.allVideos[this.swiper.activeIndex + 1].setPlay(true)
            this.swiper.slideNext()
            this.allVideos.forEach(elem => {
                elem.updateStyle()
            })
        }

        sliderBack = event => {
            if (event && event.target.tagName === "A") {
                this.onSliderEnd()
                return;
            }
            if (!this.allVideos[this.swiper.activeIndex - 1]) {
                this.onSliderEnd()
                return
            }
            this.allVideos.forEach(elem => {
                elem.setPlay(false)
            })
            this.allVideos[this.swiper.activeIndex - 1].setPlay(true)
            this.swiper.slidePrev()
            this.allVideos.forEach(elem => {
                elem.updateStyle()
            })
        }

        updateStyle() {

            let activeIndex = this.swiper.activeIndex

            this.slideElement.classList.remove("swiper-slide_left-step-1")
            this.slideElement.classList.remove("swiper-slide_left-step-2")
            this.slideElement.classList.remove("swiper-slide_right-step-1")
            this.slideElement.classList.remove("swiper-slide_right-step-2")
            this.slideElement.classList.remove("swiper-slide_not-visible")

            if (activeIndex === this.index) {

            } else if (activeIndex === this.index - 1) {
                this.slideElement.classList.add("swiper-slide_left-step-1")
            } else if (activeIndex === this.index + 1) {
                this.slideElement.classList.add("swiper-slide_right-step-1")
            } else if (activeIndex === this.index - 2) {
                this.slideElement.classList.add("swiper-slide_left-step-2")
            } else if (activeIndex === this.index + 2) {
                this.slideElement.classList.add("swiper-slide_right-step-2")
            } else {
                this.slideElement.classList.add("swiper-slide_not-visible")
            }

        }

        viewError = false
        viewLoading = false

        constructor(instaVideo, index, slideElement, fullGallery) {
            this.instaVideo = instaVideo
            this.player = instaVideo.querySelector(".insta-video__player")
            this.preloader = instaVideo.querySelector(".insta-video__preloader")
            this.error = instaVideo.querySelector(".insta-video__error")
            this.button = instaVideo.querySelector(".insta-video__button")
            this.index = index
            this.slideElement = slideElement
            this.fullGallery = fullGallery
            this.soundButton = instaVideo.querySelector(".insta-gallery-full__sound")

            this.error.style.display = "none"

            this.player.muted = true

            //initialize metadata
            this.player.addEventListener("loadedmetadata", () => {
                this.length = this.player.duration
            }, {passive: true})

            this.player.addEventListener("error", event => {
                this.isErrored = true
                this.setErrorView(true)
                this.setPlay(false)
                this.onError()
            }, {passive: true})

            this.player.addEventListener("abort", event => {
                this.isErrored = true
                this.setErrorView(true)
                this.setPlay(false)
                this.onError()
            }, {passive: true})

            //progress event initialize
            this.player.addEventListener("playing", () => {
                this.setLoadingView(false)
            }, {passive: true})
            this.player.addEventListener("waiting", () => {
                this.setLoadingView(true)
            }, {passive: true})
            this.player.addEventListener("timeupdate", event => {
                this.onProgress(this.player.currentTime)
            }, {passive: true})
            this.player.addEventListener("ended", () => {
                this.sliderNext()
            }, {passive: true})

            //Pause action
            let isPause = false
            let pauseTimer

            this.x = 0

            let mouseDown = event => {

                if (event.which !== 1) return;

                if (!this.isPlayed) return

                    this.x = event.clientX

                this.player.pause()

                clearTimeout(pauseTimer)
                pauseTimer = setTimeout(() => {
                    isPause = true
                }, 200)
            }

            let touchDown = event => {

                if (!this.isPlayed) return;

                if (event.touches.length === 0) return
                    this.x = event.changedTouches[0].clientX

                this.player.pause()

                clearTimeout(pauseTimer)
                pauseTimer = setTimeout(() => {
                    isPause = true
                }, 200)
            }

            let mouseUp = event => {

                if (event.which !== 1) return;

                if (!this.isPlayed) return;

                clearTimeout(pauseTimer)
            }

            let touchUp = event => {

                if (!this.isPlayed) return;

                clearTimeout(pauseTimer)
                if (isPause) {
                    this.player.play()
                    isPause = false
                }
            }

            let click = event => {

                if (!this.isPlayed) {
                    this.fullGallery.fullGallerySlideTo(this.index)
                    return
                }

                if (isPause) {
                    this.player.play()
                    isPause = false
                    return;
                }

                if (event.clientX > innerWidth / 2) {
                    this.sliderNext(event)
                } else {
                    this.sliderBack(event)
                }
            }

            this.button.addEventListener("click", click, {passive: true})
            this.button.addEventListener("mousedown", mouseDown, {passive: true})
            this.button.addEventListener("touchstart", touchDown, {passive: true})
            this.button.addEventListener("mouseup", mouseUp, {passive: true})
            this.button.addEventListener("touchend", touchUp, {passive: true})
            this.button.oncontextmenu = event => {
                return false
            }

            //Volume button
            this.soundButton.addEventListener("click", () => {
                this.fullGallery.fullGallerySetVolume(!fullGallery.fullGalleryVolume)
            }, {passive: true})
            this.updateViewSoundButton()
        }

        LoadAndPlay = () => {
            if (this.isLoading) return
                if (this.isPlayed === true) {
                    this.player.play()
                    if (this.isErrored) {
                        this.playError()
                        return;
                    }
                    this.setLoadingView(false)
                } else {
                    this.player.pause()
                    clearInterval(this.errorProgressInterval)
                }
            }

            setPlay(play) {
                document.querySelectorAll('.insta-gallery .swiper-slide_video video').forEach((elem)=>{
                //console.log(elem)
                    elem.preload = true
                })
                if (play === this.isPlayed || this.isLoading) return
                    if (play) {
                        clearInterval(this.errorProgressInterval)
                        this.isPlayed = true
                        this.LoadAndPlay()
                    } else {
                        clearInterval(this.errorProgressInterval)
                        this.player.pause()
                        this.isPlayed = false

                        this.updateViewSoundButton()
                    }
                    this.updateStyle()
                }

                setProgress(time) {
                    this.player.currentTime = time
                }

                updateViewSoundButton() {
                    let icons = this.soundButton.querySelectorAll("svg")

                    if (!this.fullGallery.fullGalleryVolume) {
                        icons[1].style.display = "none"
                        icons[0].style.display = ""
                    } else {
                        icons[0].style.display = "none"
                        icons[1].style.display = ""
                    }
                }

                setLoadingView(state) {
                    if (state === this.viewLoading) return
                        if (state) {
                            this.preloader.style.display = ""
                            this.viewLoading = true
                        } else {
                            this.preloader.style.display = "none"
                            this.viewLoading = false
                        }
                    }

                    playError() {
                        this.errorTimeEnd = 0
                        this.length = 50
                        this.errorProgressInterval = setInterval(() => {
                            if (this.errorTimeEnd > 50) {
                                clearInterval(this.errorProgressInterval)
                                this.sliderNext()
                                return
                            }

                            this.errorTimeEnd += 1
                            this.onProgress(this.errorTimeEnd)
                        }, 20)
                    }

                    setErrorView(state) {
                        if (state === this.viewError) return
                            if (state) {
                                this.error.style.display = ""
                                this.viewError = true
                            } else {
                                this.error.style.display = "none"
                                this.viewError = false
                            }
                        }
                    }

                    class InstaGallery {

                        fullGalleryIsOpen = false
                        fullGalleryVolume = true

                        instaVideoList = new Array(0)

                        static delegate() {
                            let instaGalleryDOM = document.querySelectorAll(".insta-gallery")
                            if (instaGalleryDOM) instaGalleryDOM.forEach(elem => new this(elem))
                        }

                    constructor(instaGallery) {
                        this.instaGallery = instaGallery;
                        this.swiperLeft = this.instaGallery.querySelector(".insta-gallery__left")
                        this.swiperRight = this.instaGallery.querySelector(".insta-gallery__right")

            //sound button
                        this.soundButton = this.instaGallery.querySelector(".insta-gallery-full__volume-button")
                        this.soundButton.addEventListener("click", () => {
                            this.fullGallerySetVolume(!this.fullGalleryVolume)
                        }, {passive: true})

            //gallery
                        this.swiper = new Swiper(this.instaGallery.querySelector(".insta-gallery__swiper:not(.swiper-initialized)"), {
                         mousewheel: {
                            forceToAxis: true
                        },
                        
                        slidesPerView: 'auto',

                        navigation: {
                            nextEl: ".insta-gallery__next",
                            prevEl: ".insta-gallery__prev",
                        },

                        watchSlidesProgress: true,
                        breakpoints: {
                            0: {
                                initialSlide: 0,
                            },

                            900: {
                                initialSlide: 1,
                            },

                            1400: {
                                initialSlide: 1,
                            },

                            2000: {
                                initialSlide: 1,
                            }
                        }

                    })

            //full gallery
                        this.fullGallery = this.instaGallery.querySelector(".insta-gallery-full")
                        this.fullGalleryClose = this.instaGallery.querySelector(".insta-gallery-full__close")
                        this.fullGalleryWrapper = this.instaGallery.querySelector(".insta-gallery-full__swiper .swiper-wrapper")

            //navigation
                        this.fullGalleryNavidation = this.instaGallery.querySelector(".insta-gallery-full__navigation")

                        this.fullGalleryWrapper.innerHTML = ""
                        this.fullGalleryNavidation.innerHTML = ""

                        let index = 0


                        //Отсортировать 
                        this.swiper.slides.filter(($item) => $item.classList.contains('swiper-slide_video')).forEach((elem, index) => {
                            //Добавить только видео
                           // if(elem.classList.contains('swiper-slide_video')){
                            let image = elem.querySelector(".insta-gallery__preview")
                            let videoSrc = elem.getAttribute("data-video")

                    //Добавьте действие с открытым видео
                            image.addEventListener("click", () => {
                                this.fullSwiper.slideTo(index - 1, 0)
                                this.fullGallerySetOpen(true)
                            }, {passive: true})

                    //initialize video
                            let newInstaVideo = document.createElement("div")
                            newInstaVideo.setAttribute("class", "insta-video")
                            newInstaVideo.innerHTML = `
                            <div class="insta-video__button"></div>
                            <video preload="none" class="insta-video__player" src="${videoSrc}" playsinline preload="metadata" webkit-playsinline muted></video>
                            <div class="insta-video__error" style="display: none">РћС€РёР±РєР°<br>РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ СЂРѕР»РёРє.</div>
                            <div class="insta-video__preloader" style="display: none"></div>
                            `

                    //initialize sound button
                            let soundButton = document.createElement("div")
                            soundButton.classList.add("insta-gallery-full__sound")
                            soundButton.innerHTML = `
                            <svg width="31" height="18" viewBox="0 0 31 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0L7 4H0V14H7L12 18V0ZM29.2929 2.29289L24.5 7.08579L19.7071 2.29289L18.2929 3.70711L23.0858 8.5L18.2929 13.2929L19.7071 14.7071L24.5 9.91421L29.2929 14.7071L30.7071 13.2929L25.9142 8.5L30.7071 3.70711L29.2929 2.29289Z" fill="white"/>
                            </svg>
                            <svg width="31" height="18" viewBox="0 0 31 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0L7 4H0V14H7L12 18V0ZM22 2C25.866 2 29 5.13401 29 9C29 12.866 25.866 16 22 16H18V18H22C26.9706 18 31 13.9706 31 9C31 4.02944 26.9706 0 22 0H18V2H22ZM25 9C25 7.34315 23.6569 6 22 6H18V4H22C24.7614 4 27 6.23858 27 9C27 11.7614 24.7614 14 22 14H18V12H22C23.6569 12 25 10.6569 25 9Z" fill="white"/>
                            </svg>
                            `
                            newInstaVideo.appendChild(soundButton)

                            let newSlide = document.createElement("div")
                            newSlide.setAttribute("class", "swiper-slide")
                            newSlide.appendChild(newInstaVideo)
                            this.fullGalleryWrapper.appendChild(newSlide)

                            this.instaVideoList.push(new InstaVideo(newInstaVideo, index, newSlide, this))

                            index++

                            this.fullGalleryNavidation.innerHTML += `
                            <div class="insta-gallery-full__navigation-line">
                            <div class="insta-gallery-full__navigation-line-progress" style="width: 0"></div>
                            </div>
                            `
                            //}
                        })

                //full swiper
                        this.fullSwiper = new Swiper(this.instaGallery.querySelector(".insta-gallery-full__swiper:not(.swiper-initialized)"), {
                            spaceBetween: 0,
                            speed: 300,
                            allowTouchMove: false,
                            
                            breakpoints: {
                                1200: {
                                    spaceBetween: 42
                                },
                                1023: {
                                    spaceBetween: 31
                                },
                                512: {
                                    spaceBetween: 27
                                }
                            }
                        })

                        this.fullGalleryClose.addEventListener("click", () => {
                            this.fullGallerySetOpen(false)
                        }, {passive: true})

                //full swiper actions
                        this.instaVideoList.forEach((video, index) => {
                            video.swiper = this.fullSwiper
                            video.allVideos = this.instaVideoList
                            video.onSliderEnd = () => {
                                this.fullGallerySetOpen(false)
                            }
                        })

                //Navigation action
                        this.fullSwiper.on("slideChange", swiper => {
                            this.fullGalleryNavidation.querySelectorAll(".insta-gallery-full__navigation-line").forEach((elem, index) => {
                                elem.querySelector(".insta-gallery-full__navigation-line-progress").style.display = "none"
                                if (index < swiper.activeIndex) {
                                    elem.style.backgroundColor = "#FFF"
                                } else {
                                    elem.style.backgroundColor = ""
                                }

                                if (index === swiper.activeIndex) {
                                    elem.querySelector(".insta-gallery-full__navigation-line-progress").style.display = ""
                                }

                                elem.querySelector(".insta-gallery-full__navigation-line-progress").style.width = "0"
                            })
                        })

                //Progress action
                        this.instaVideoList.forEach((elem, index) => {
                            elem.onProgress = (progress) => {
                                let line = this.fullGalleryNavidation.children[index].querySelector(".insta-gallery-full__navigation-line-progress")
                                line.style.width = (progress / elem.length) * 100 + "%"
                            }

                            elem.onEnd = () => {
                                if (this.fullSwiper.activeIndex === this.fullSwiper.slides.length - 1) this.fullGallerySetOpen(false)
                                    else this.fullSwiper.slideNext()
                            }
                        })

                //volume button
                        this.fullGallerySetVolume()

                //действия с кнопками клавиатуры
                        addEventListener("keydown", event => {

                            if (event.key === "Escape") {
                                this.fullGallerySetOpen(false)
                            }

                            if (event.key === " ") {
                                if (this.fullGalleryIsOpen)
                                    this.fullGallerySetPlay(!this.isPlay)
                            }

                            if (event.key === "ArrowLeft") {
                                if (0 > this.fullSwiper.activeIndex - 1) {
                                    this.fullGallerySetOpen(false)
                                    return
                                }
                                this.fullGallerySlideTo(this.fullSwiper.activeIndex - 1)
                                this.instaVideoList.forEach(elem => elem.updateViewSoundButton())
                            } else if (event.key === "ArrowRight") {
                                if (this.fullSwiper.slides.length < this.fullSwiper.activeIndex + 2) {
                                    this.fullGallerySetOpen(false)
                                    return
                                }
                                this.fullGallerySlideTo(this.fullSwiper.activeIndex + 1)
                                this.instaVideoList.forEach(elem => elem.updateViewSoundButton())
                            }

                        }, {passive: true})

                //Click other action
                        this.fullGallery.addEventListener("click", event => {
                            let isTarget = event.target === this.fullGallery
                            if(isTarget) this.fullGallerySetOpen(false)
                        }, {passive: true})



                    }

                    isPlay = false

                    fullGallerySetPlay(state) {
                        if (state === this.isPlay) return
                            this.isPlay = !!state;
                        this.updatePlay()
                    }

                    updatePlay() {
                        if (this.fullGalleryIsOpen && this.isPlay) {
                            this.instaVideoList.forEach(video => video.setPlay(false))
                            this.instaVideoList[this.fullSwiper.activeIndex].setPlay(true)
                        } else {
                            this.instaVideoList.forEach(video => video.setPlay(false))
                        }
                    }

                    fullGallerySlideTo(index) {
                        this.fullSwiper.slideTo(index)
                        this.updatePlay()
                        this.instaVideoList.forEach(elem => elem.updateStyle())
                        this.instaVideoList.forEach(video => video.setProgress(0))
                    }
                    //asd
                    fullGallerySetOpen(state) {
                        if (this.fullGalleryIsOpen === state) return;

                        if (state) {
                            this.fullGallery.style.display = ""
                            this.fullGalleryIsOpen = true
                            this.fullGallerySetPlay(true)
                            this.instaVideoList.forEach(elem => elem.updateStyle())
                            this.instaVideoList.forEach(video => video.setProgress(0))
                        } else {
                            this.fullGallery.style.display = "none"
                            this.fullGalleryIsOpen = false
                            this.fullGallerySetPlay(false)
                        }
                    }

                    fullGallerySetVolume() {
                        if (this.fullGalleryVolume) {
                            this.fullGallery.querySelectorAll(".insta-gallery-full__swiper .swiper-wrapper .swiper-slide").forEach((elem, index) => {
                                let video = elem.querySelector("video")
                                video.muted = true
                            })
                        } else {
                            this.fullGallery.querySelectorAll(".insta-gallery-full__swiper .swiper-wrapper .swiper-slide").forEach((elem, index) => {
                                let video = elem.querySelector("video")
                                video.muted = false
                            })
                        }
                        this.fullGalleryVolume = !this.fullGalleryVolume
                        this.instaVideoList.forEach(elem => elem.updateViewSoundButton())

            //button icon update
                        let buttonIcons = this.soundButton.querySelectorAll("svg")

                        if (this.fullGalleryVolume) {
                            buttonIcons[0].style.display = "none"
                            buttonIcons[1].style.display = ""
                        } else {
                            buttonIcons[0].style.display = ""
                            buttonIcons[1].style.display = "none"
                        }
                    }
                }

                InstaGallery.delegate()
            }