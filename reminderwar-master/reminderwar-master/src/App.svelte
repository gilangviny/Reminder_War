<script>
  import Header from "./Layout/header.svelte";
  import Main from "./MainPage/Main.svelte";
  import Login from "./Login/login.svelte";

  //auth
  import { auth } from "./config.js";
  import { authState } from "rxfire/auth";

  //Sign In User with Email and Password
  let user;
  const unsubscribe = authState(auth).subscribe(u => (user = u));
</script>

{#if user}
  <Header {user} />
  <Main {user} />
{:else}
  <Login {user} />
{/if}
