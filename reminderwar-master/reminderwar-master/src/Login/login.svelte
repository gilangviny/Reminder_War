<script>
  import { auth } from "../config.js";
  import { authState } from "rxfire/auth";
  export let user;
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap");
  .body {
    font-size: 16px;
    /* background: #edf2f4; */
    font-family: "Noto Sans", sans-serif;
    color: #666;
    box-sizing: border-box;
  }

  img {
    filter: blur(8px);
    -webkit-filter: blur(8px);
  }
  .login-container {
    box-sizing: border-box;
    height: 100vh;
    width: 100%;
  }

  .login-form {
    /* border: 1px solid black; */
    /* background-color: white; */
    margin: auto;
    width: 370px;
    padding: 15px;
    max-width: 100%;
    position: relative;
    animation: form-login 3s none;
  }

  @keyframes form-login {
    0% {
      top: -800px;
    }

    100% {
      top: 4px;
    }
  }

  .login-form .form-control {
    font-size: 15px;
    min-height: 48px;
    font-weight: 500;
  }

  .login-form a {
    text-decoration: none;
    color: #666;
  }

  .login-form a:hover {
    color: #ef233c;
  }

  .forgot-link {
    font-size: 13px;
  }

  .form-control:focus {
    border-color: brown;
    box-shadow: 0 0 0 0.2rem rgba(186, 61, 190, 0.25);
  }

  .btn-custom {
    background: #d60404;
    border-color: #8d99ae;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    min-height: 48px;
  }

  .btn-custom:focus,
  .btn-custom:hover,
  .btn-custom:active,
  .btn-custom:active:focus {
    background: #f57170;
    border-color: #8d99ae;
    color: black;
  }

  .btn-custom:focus {
    box-shadow: 0 0 0 0.2rem rgba(114, 61, 190, 0.25);
  }

  .text-login {
    color: #f57170;
  }
  input {
    border-radius: 20px;
  }
  button {
    border-radius: 20px;
  }
  @media only screen and (max-width: 1110px) {
    .text-login {
      color: #14213d;
    }

    .btn-custom {
      background: #14213d;
      border-color: #8d99ae;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      min-height: 48px;
    }
  }
</style>

<div
  class="d-flex justify-content-center align-items-center login-container body">

  <img
    src="remainder.svg"
    alt="bcgk"
    style="position: absolute; z-index: -1; margin-right:20em; width: 45%;" />

  <div class="login-form text-center">
    <h1
      class="mb-5 font-weight-light text-uppercase text-login"
      style=" font-size:50px; font-weight:500 !important;">
      Login to CATCH UP! 
    </h1>
    <div class="form-group">
      <input
        type="email"
        class="form-control rounded-pill form-control-lg"
        placeholder="Email"
        id="email" />
    </div>
    <div class="form-group">
      <input
        type="password"
        class="form-control rounded-pill form-control-lg"
        placeholder="Password"
        id="pass" />
    </div>
    <button
      class="btn mt-5 rounded-pill btn-lg btn-custom btn-block text-uppercase"
      on:click={() => {
        let email = document.getElementById('email').value;
        let pass = document.getElementById('pass').value;
        console.log(email);
        auth.signInWithEmailAndPassword(email, pass).catch(function(error) {
          alert('no match found on email/password');
        });
      }}>
      Log in
    </button>
  </div>
</div>
