import { useState } from "react";
import { helpHttp } from "../helpers/helpHttp";

export function useForm(initialForm, validateForm, pointPost) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  let optionsPost = {
    method: "POST",
    body: form,
    header: { "content-type": "application/json" },
  };

  const handleErrorsForm = () => {
    setErrors(validateForm(form));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateForm(form));

    if (Object.keys(errors).length === 0) {
      setLoading(true);

      helpHttp()
        .post(pointPost, optionsPost)
        .then((res) => {
          setLoading(fasle);
          setResponse(res);
          setForm(initialForm);
          setTimeout(() => {
            setResponse(false);
          }, 3000);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return {
    form,
    errors,
    loading,
    response,
    setForm,
    handleErrorsForm,
    handleSubmit,
  };
}
