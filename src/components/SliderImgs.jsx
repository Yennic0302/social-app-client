import React, { useEffect, useRef, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import styled from "styled-components";

let isDragStart = false,
  isDragging = false,
  prevPageX,
  preScrollLeft,
  firstImg,
  firstImgWidth,
  carousel,
  positionDiff;

const SliderImgs = ({ imgs }) => {
  const [countImg, setCountImg] = useState(1);
  const btnLeft = useRef();
  const btnRigth = useRef();

  const showHideIcons = () => {
    setTimeout(() => {
      btnLeft.current.style.display =
        carousel.scrollLeft == 0 ? "none" : "block";
      btnRigth.current.style.display =
        carousel.scrollLeft >= carousel.scrollWidth - firstImgWidth
          ? "none"
          : "block";
    }, 500);
  };

  const next = () => {
    carousel.scrollLeft += firstImgWidth;
    setCountImg(() => countImg + 1);
    showHideIcons();
  };

  const back = () => {
    carousel.scrollLeft -= firstImgWidth;
    setCountImg(() => countImg - 1);
    showHideIcons();
  };

  const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    preScrollLeft = carousel.scrollLeft;
  };

  const dragEnd = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");
    if (!isDragging) return;
    isDragging = false;
    autoSlide();
  };

  const dragging = (e) => {
    if (!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = preScrollLeft - positionDiff;
    carousel.classList.add("dragging");

    showHideIcons();
  };

  const autoSlide = () => {
    if (carousel.scrollLeft == carousel.scrollWidth - carousel.clientWidth)
      return;

    if (carousel.scrollLeft == 0) return;

    positionDiff = Math.abs(positionDiff);
    let valDifference = firstImgWidth - positionDiff;
    if (carousel.scrollLeft > preScrollLeft) {
      if (positionDiff > firstImgWidth / 3) {
        setCountImg(() => countImg + 1);
        carousel.scrollLeft += valDifference;
      } else {
        carousel.scrollLeft += -positionDiff;
      }
      return showHideIcons();
    }

    if (positionDiff > firstImgWidth / 3) {
      setCountImg(() => countImg - 1);
      carousel.scrollLeft -= valDifference;
    } else {
      carousel.scrollLeft -= -positionDiff;
    }
    showHideIcons();
  };

  useEffect(() => {
    setTimeout(() => {
      carousel = document.querySelector(".carousel");
      firstImg = carousel.children[0];
      firstImgWidth = firstImg.clientWidth + 14;
      showHideIcons();
    }, 60);
  }, []);

  return (
    <Container className="wrapper">
      <div className="image-counter">{`${countImg}/${imgs.length}`}</div>
      <button ref={btnLeft} id="left" onClick={back}>
        {<BsArrowLeft />}
      </button>

      <div
        onMouseMove={dragging}
        onTouchMove={dragging}
        onMouseDown={dragStart}
        onTouchStart={dragStart}
        onMouseUp={dragEnd}
        onTouchEnd={dragEnd}
        className="carousel"
      >
        {imgs && imgs.map((e, i) => <img key={i} src={e} draggable="false" />)}
      </div>
      <button ref={btnRigth} id="rigth" onClick={next}>
        {<BsArrowRight />}
      </button>
    </Container>
  );
};

export default SliderImgs;

const Container = styled.div`
  width: 100%;
  position: relative;

  button {
    background: #fff;
    height: 30px;
    width: 30px;
    text-align: center;
    color: #111;
    border: none;
    outline: none;
    line-height: 10px;
    border-radius: 50%;
    cursor: pointer;
    position: absolute;
    font-size: 1.1rem;
    top: 50%;
    transform: translateY(-50%);
  }

  button:first-child {
    left: -23px;
  }
  button:last-child {
    right: 0px;
  }

  &,
  .carousel {
    font-size: 0px;
    white-space: nowrap;
    overflow: hidden;
    scroll-behavior: smooth;
    cursor: pointer;
  }

  .dragging {
    cursor: grab;
    scroll-behavior: auto;
  }
  .dragging img {
    pointer-events: none;
    user-select: none;
  }

  .carousel img {
    height: 340px;
    object-fit: cover;
    margin-left: 14px;
    width: calc(100%);
  }

  .carousel img:first-child {
    margin-left: 0px;
  }

  .image-counter {
    position: absolute;
    display: flex;
    font-size: 0.9rem;
    justify-content: center;
    align-items: center;
    right: 0;
    top: 0;
    margin: 1rem;
    background: #3338;
    width: 2rem;
    height: 1rem;
    border-radius: 0.5rem;
  }

  .back {
    position: absolute;
    top: 47%;
    left: 0;
  }

  .next {
    position: absolute;
    top: 47%;
    right: 0;
  }

  @media screen and (min-width: 720px) {
    width: 340px;
  }
`;
