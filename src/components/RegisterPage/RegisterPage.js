import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import "./RegisterPage.css";

function RegisterPage() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const password = useRef();
  password.current = watch("password");

  return (
    <div className="auth-wrapper">
      <form>
        <h1>Register</h1>

        <label>Email</label>
        <input
          type="email"
          name="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>This field is required</p>}

        <label>Name</label>
        <input type="text" name="name" {...register("name", { required: true, maxLength: 10 })} />
        {errors.name && errors.name.type === "required" && <p> This name field is required</p>}
        {errors.name && errors.name.type === "maxLength" && (
          <p> Your input exceed maximum length</p>
        )}

        <label>Password</label>
        <input
          type="password"
          name="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required" && (
          <p> this name field is required</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p> password must have at least 6 characters</p>
        )}

        <label>Password Confirm</label>
        <input
          type="password"
          name="password_confirm"
          {...register("password_confirm", {
            required: true,
            validate: (value) => value === password.current,
          })}
        />
        {errors.password_confirm && errors.password_confirm.type === "required" && (
          <p> this password confirm field is required</p>
        )}
        {errors.password_confirm && errors.password_confirm.type === "validate" && (
          <p> the password do not match</p>
        )}
        <input type="submit" value="회원가입" />

        <Link style={{ color: "gray", textDecoration: "none" }} to="login">
          이미 아이디가 있다면...
        </Link>
      </form>
    </div>
  );
}

export default RegisterPage;
