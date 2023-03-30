import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useForm } from "../hooks/useForm";
import { createPost } from "../utils/APIRoutes";
import SliderImgs from "./SliderImgs";

let initialForm = {
  imgs: [],
  description: "",
};

const validateForm = (form) => {
  let errors = {};

  if (form.imgs.length == 0) errors.imgs = "there is no an image";
  if (!form.description.trim()) errors.description = "the description is empty";

  return errors;
};

const NewPost = ({ setIsOpenNewPost }) => {
  const {
    form,
    errors,
    loading,
    response,
    setForm,
    handleSubmit,
    handleErrorsForm,
  } = useForm(initialForm, validateForm, createPost);

  const containerRef = useRef();

  const readImgs = (e) => {
    let imgs = e.target.files;
    const arrayImgs = [];
    for (let img of imgs) {
      let url = URL.createObjectURL(img);
      arrayImgs.push(url);
    }
    setForm({ ...form, imgs: [...form.imgs, ...arrayImgs] });
  };

  useEffect(() => {
    if (form.imgs.length > 0) {
      containerRef.current.style.height = "80vh";
      containerRef.current.style.gridTemplateRows = "10% 90%";
    } else {
      containerRef.current.style.height = "40vh";
      containerRef.current.style.gridTemplateRows = "20% 80%";
    }
  }, [form.imgs]);

  return (
    <Container ref={containerRef}>
      <div className="nav-create-post">
        <h3 className="title-section">Create your Post</h3>
        <button onClick={() => setIsOpenNewPost(false)} className="btn-close">
          X
        </button>
      </div>
      <form
        className={`post-form ${form.imgs.length > 0 && "post-form-with-imgs"}`}
        onSubmit={(e) => handleSubmit(e)}
        action=""
      >
        {form.imgs.length > 0 && (
          <div>
            <label className="select-images" htmlFor="post-image">
              Please select your images
            </label>
            <input
              hidden
              onChange={readImgs}
              type="file"
              multiple
              id="post-image"
              name="imgs"
            />
          </div>
        )}
        <div className="slider-imgs-container">
          {form.imgs.length == 0 && (
            <div className={errors.imgs ? "imgs-error" : ""}>
              <div className="input-to-imgs">
                <label className="select-images" htmlFor="post-image">
                  <h2>Please select your images</h2>
                </label>
                <input
                  hidden
                  onChange={(e) => {
                    handleErrorsForm();
                    readImgs(e);
                  }}
                  type="file"
                  multiple
                  id="post-image"
                  name="imgs"
                />
              </div>
              {errors.imgs && (
                <p className="error">
                  <span>x</span> {errors.imgs}
                </p>
              )}
            </div>
          )}
          {form.imgs.length > 0 && <SliderImgs imgs={form.imgs} />}
        </div>
        <div
          className={
            errors.description ? "description-error" : "description-container"
          }
        >
          <textarea
            type="text"
            id="post-description"
            name="description"
            className="description"
            placeholder="Type a description"
            onChange={(e) => {
              handleErrorsForm();
              setForm({ ...form, description: e.target.value });
            }}
          />
          {errors.description && (
            <p className="error">
              <span>x</span> {errors.description}
            </p>
          )}
        </div>
        <div className="btn-container">
          <button className="btn-submit" type="submit">
            submit
          </button>
        </div>
      </form>
    </Container>
  );
};

export default NewPost;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 20% 80%;
  color: white;
  background: #222;

  .nav-create-post {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .btn-close {
      font-size: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--second-color);
      height: 1rem;
      width: 1rem;
      margin: 1rem;
      padding: 1rem;
      border: none;
      outline: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    .btn-close:hover {
      background-color: var(--primary-color);
      color: #fff;
    }
  }
  .title-section {
    padding: 1rem;
  }

  .post-form {
    height: 100%;
    width: 100%;
    overflow: auto;
    display: grid;
    grid-template-rows: 50% 30% 20%;
    align-items: center;
    .slider-imgs-container {
      display: flex;
      justify-content: center;
      padding: 10px;
    }
  }

  .post-form-with-imgs {
    grid-template-rows: 5% 70% 15% 10%;
  }
  @media screen and (min-width: 720px) {
    width: 720px;
    height: 40vh;
    border-radius: 1rem;

    .btn-submit {
      margin-bottom: 1rem;
    }
  }

  .error {
    padding-left: 1rem;
    color: #ca4a55;
  }

  .imgs-error {
    width: 100%;
    display: grid;
    grid-template-rows: 90% 10%;
  }

  .description-error {
    width: 100%;
    display: grid;
    margin: auto;
    grid-template-rows: 90% 10%;
    grid-template-columns: 100%;
  }

  .input-to-imgs {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .description {
    resize: none;
    border: none;
    outline: none;
    width: 90%;
    overflow: auto;
    color: #fff;
    margin: auto;
    background-color: transparent;
    font-size: 1rem;
    font-family: cursive;
    padding: 1rem;
  }

  .select-images {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .description-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .btn-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    .btn-submit {
      position: absolute;
      right: 1rem;
      padding: 0.5rem 0.7rem;
      background-color: var(--second-color);
      width: 5rem;
      border: none;
      outline: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    .btn-submit:hover {
      background-color: var(--primary-color);
      color: #fff;
    }
  }
`;
