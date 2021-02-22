<script>
  import { auth, db_user } from "../config.js";
  import { authState } from "rxfire/auth";
  import { onMount, afterUpdate } from "svelte";
  import firebase from "firebase/app";

  export let user;
  let name_user = user.email.split("@")[0].toUpperCase();

  let data = [];
  let length = 0;

  onMount(async () => {
    var docRef = db_user
      .collection("unitData")
      .doc(user.email.split("@")[0].toUpperCase());

    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          data = doc.data();
          data = data.notif;
          length = data.length;
        }
      })
      .catch(function(error) {
        alert("error getting data");
      });
  });

  afterUpdate(() => {
    // Notification
    var close = document.getElementsByClassName("closebtn");
    var i;

    for (i = 0; i < close.length; i++) {
      close[i].onclick = function() {
        var div = this.parentElement;
        div.style.opacity = "0";
        if (length > 0) {
          length = length - 1;
        }
        setTimeout(function() {
          div.style.display = "none";
        }, 600);
      };
    }
  });

  function Remove(unit) {
    var user = db_user.collection("unitData").doc(name_user);
    user.update({
      notif: firebase.firestore.FieldValue.arrayRemove(unit)
    });
  }
</script>

<style>
  .navbar {
    background-color: #000000 !important;
    height: 80px;
  }

  .navbar-brand {
    color: black;
    font-family: "Roboto Slab", serif;
    font-weight: 600;
    color: red !important;
    font-size: 30px !important;
  }

  .navbar-brand span {
    color: white;
  }

  .navbar-nav .nav-item {
    color: red !important;
    font-weight: 400;
    font-size: 16px !important;
    margin-left: 10px;
    border: none;
  }

  .nav-item:hover {
    color: red !important;
  }

  .nav-tabs {
    border: 0;
    color: red;
  }
  .dropdown-menu {
    padding: 0 0 0 0;
  }
  a.dropdown-menu-header {
    background: #f7f9fe;
    font-weight: bold;
    border-bottom: 1px solid #e3e3e3;
  }
  .dropdown-menu > li a {
    padding: 10px 20px;
  }

  .badge {
    padding: 3px 5px 2px;
    position: absolute;
    top: 8px;
    right: 5px;
    display: inline-block;
    min-width: 10px;
    font-size: 12px;
    font-weight: bold;
    color: #ffffff;
    line-height: 1;
    vertical-align: baseline;
    white-space: nowrap;
    text-align: center;
    border-radius: 10px;
  }
  .badge-danger {
    background-color: #db5565;
  }

  .divisi-login {
    color: white;
    font-weight: 600;
    margin-right: 10px;
    cursor: pointer;
  }
  .divisi-login:hover {
    color: #db5565 !important;
  }
  .fas.fa-sign-out-alt {
    cursor: pointer !important;
  }
  .fas.fa-sign-out-alt:hover {
    transform: scale(1.2);
  }

  .alert {
    padding: 20px;
    background-color: #f44336;
    color: white;
    opacity: 1;
    transition: opacity 0.6s;
    margin-bottom: 15px;
  }
  .alert.info {
    background-color: #2196f3;
  }
  .closebtn {
    margin-left: 15px;
    color: white;
    font-weight: bold;
    float: right;
    font-size: 22px;
    line-height: 20px;
    cursor: pointer;
    transition: 0.3s;
  }
  .closebtn:hover {
    color: black;
  }
</style>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-light">
  <a class="navbar-brand" href="#">
    <!-- <img class="img-fluid" src="logo.png" alt="logo" style="width:200px;" /> -->
    CATCH
    <span style="color:white !important;">UP!</span>
  </a>
  <div class="dropdown" style="float: right; padding: 13px">
    <a
      href="#"
      onclick="return false;"
      role="button"
      data-toggle="dropdown"
      id="dropdownMenu1"
      data-target="#"
      style="float: left"
      aria-expanded="true">
      <i
        class="fa fa-bell-o"
        style="font-size: 20px; float:right; color: white" />
    </a>
    <span class="badge badge-danger">{length}</span>
    <ul
      class="dropdown-menu dropdown-menu-left pull-right"
      style="width:100px; opacity: 0.8s;"
      role="menu"
      aria-labelledby="dropdownMenu1">
      <!-- notification -->
      <!-- {#each data as notif}
        <div class="toast" data-autohide="false">
          <div class="toast-header" style="background-color:#93d8d9;">
            <strong class="mr-auto text-primary">Notification</strong>
            <small class="text-muted text-center">5 mins ago</small>
            <button
              type="button"
              class="ml-2 mb-1 close"
              data-dismiss="toast"
              on:click={() => {
                Remove(notif);
              }}>
              &times;
            </button>
          </div>
          <div class="toast-body">Assign by Divisi {notif}</div>
        </div>
      {/each} -->
      {#each data as unit}
        <div class="alert info">
          <span
            class="closebtn"
            on:click={() => {
              Remove(unit);
            }}>
            &times;
          </span>
          <strong class="mb-2">Notif!</strong>
          {unit}
        </div>
      {/each}
    </ul>
  </div>
  <div class="nav nav-tabs navbar-nav ml-auto" id="nav-tab" role="tablist">
    <!-- <a
      class="nav-item nav-link active"
      id="nav-home-tab"
      data-toggle="tab"
      href="#nav-home"
      role="tab"
      aria-controls="nav-home"
      aria-selected="true">
      Home
    </a> -->
    <!-- <a
      class="nav-item nav-link"
      id="nav-profile-tab"
      data-toggle="tab"
      href="#nav-update"
      role="tab"
      aria-controls="nav-update"
      aria-selected="false">
      Update Task
    </a> -->
    <span class="nav-item nav-link">
      <!-- login -->
      <span class="divisi-login">{user.email.split('@')[0].toUpperCase()}</span>
      <i
        class="fas fa-sign-out-alt fa-lg"
        on:click={() => {
          auth.signOut();
          location.reload();
        }} />
    </span>
  </div>

</nav>
<!-- end Navbar -->
