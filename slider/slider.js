function Slider({ showDots = true, showButtons = false }) {
  // SLIDER
  this.slider = document.querySelector(".slider");
  this.sliderTrack = document.querySelector(".slider__track");

  // DOTS
  this.dots = [];
  this.dotContainer = document.querySelector(".slider__dots");

  // BUTTONS
  this.prevButton = null;
  this.nextButton = null;
  this.buttonContainer = document.querySelector(".slider__buttons");

  // SLIDES
  this.slides = [];
  this.currentIndexSlide = 0;

  // STATUS
  this.isProcessed = false;
  this.timeAnimation = 3000;
  this.offsetWidth = this.slider.offsetWidth


  // COPY SLIDES
  const originalSlides = document.querySelectorAll(".slider__item");
  originalSlides.forEach((slide) => {
    this.slides = [...this.slides, slide.cloneNode(true)];
    slide.remove();
  });


  // RENDER SLIDE
  this.draw = (index, offset) => {
    this.dots.forEach(dot => {
      dot.classList.remove('slider__dot--active')
    })
    let el;
    el = this.slides[index].cloneNode(false)
    el.id = `item-${index}`
    el.classList.add(`slider__item`)
    el.style.left = `${offset * this.offsetWidth}px`;
    if (offset < 0)
      this.sliderTrack.insertBefore(el, this.sliderTrack.firstChild)
    else
      this.sliderTrack.appendChild(el)
    this.dots[this.currentIndexSlide].classList.add('slider__dot--active')
  };

  // MOVE SLIDES
  this.move = async (slides, offset) => {
    const getInitialLeft = () => {
      let values = [];
      for (let i = 0; i < slides.length; i++) {
        const left = parseInt(slides[i].style.left.slice(0, -2), 10)
        values.push(left);
      }
      return values;
    };
    console.log(offset)
    const offsetSign = offset >= 0 ? 1 : -1;
    const timeAnimation = this.timeAnimation / Math.abs(offset);

    const moveLeft = (timePassed, initialLeft) => {
      let left = timePassed / ((timeAnimation - 20) / this.offsetWidth);
      left = left > this.offsetWidth ? this.offsetWidth : left;
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.left = `${initialLeft[i] - (left * offsetSign)}px`;
      }
    }

    for (let i = 0; i < Math.abs(offset); i++) {
      await new Promise((resolve, reject) => {
        offsetSign > 0 ? slides[0].remove() : slides[slides.length - 1].remove();
        const initialLeft = getInitialLeft();
        const start = Date.now();
        let timer = setInterval(() => {
          let timePassed = Date.now() - start;
          if (timePassed >= timeAnimation) {
            this.currentIndexSlide = this.getCorrectIndex(this.currentIndexSlide + offsetSign);
            const nextIndex = this.getCorrectIndex(this.currentIndexSlide + offsetSign);
            this.draw(nextIndex, offsetSign);
            resolve();
            clearInterval(timer);
            return;
          }
          moveLeft(timePassed, initialLeft);
        }, 20);
      });
    }
    this.isProcessed = false;

  };

//CLICK

  this.onClick = (index = true) => {
    if (!this.isProcessed) {
      if (typeof index === "boolean") {
        index = this.getCorrectIndex(
          index ? this.currentIndexSlide + 1 : this.currentIndexSlide - 1
        );
      }
      let offset = index - this.currentIndexSlide;
      this.isProcessed = true;
      if (this.slides.length < 3)
        offset = index ? 1 : -1;
      else if (index === this.slides.length - 1 && this.currentIndexSlide === 0)
        offset = -1;
      else if (index === 0 && this.currentIndexSlide === this.slides.length - 1)
        offset = 1;
      const slides = document.getElementsByClassName('slider__item')
      this.move(slides, offset);
    }
  };

//INDEX CHECK

  this.getCorrectIndex = (index) => {
    if (index > this.slides.length - 1) {
      index = 0;
    } else if (index < 0) {
      index = this.slides.length - 1;
    }
    return index;
  };

  const initIndexes = [
    this.getCorrectIndex(this.slides.length - 1),
    0,
    this.getCorrectIndex(1),
  ];

  initIndexes.forEach((index, i) => {

    const isFirst = i == 0;
    const isLast = i == initIndexes.length - 1;

    if (!isFirst && !isLast) {
      this.slides[index].style.left = 0;
    } else if (isFirst) {
      this.slides[index].style.left = `-${this.offsetWidth}px`;
    } else {
      this.slides[index].style.left = `${this.offsetWidth}px`;
    }
    this.sliderTrack.appendChild(this.slides[index]);
  });

// OPTIONS

  if (showDots) {
    for (let i = 0; i < this.slides.length; ++i) {
      let dot = document.createElement("div");
      dot.classList.add("slider__dot");
      dot.onclick = () => {
        return this.onClick(i);
      };
      this.dotContainer.appendChild(dot);
    }
    this.dots = this.dotContainer.childNodes;
    this.dots[0].classList.add('slider__dot--active')
  }

  if (showButtons) {
    this.prevButton = document.createElement("button");
    this.prevButton.classList.add("slider__prev-button");
    this.prevButton.onclick = () => {
      return this.onClick(false);
    };
    this.nextButton = document.createElement("button");
    this.nextButton.classList.add("slider__next-button");
    this.nextButton.onclick = () => {
      return this.onClick(true);
    };
    this.buttonContainer.appendChild(this.prevButton);
    this.buttonContainer.appendChild(this.nextButton);
  }
}


const testSlider = new Slider({ showDots: true, showButtons: true });
