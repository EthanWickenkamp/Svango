<script lang="ts">
  import { login } from '$lib/auth/authservice';
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';
  let error = '';

  async function handleLogin(event: Event) {
    event.preventDefault();

    const success = await login(username, password);
    if (success) {
      goto('/'); //send to home page on login
    } else {
      error = 'Invalid username or password';
    }
  }
</script>

<h1>Login</h1>

<form on:submit={handleLogin}>
  <div>
    <label for="username">Username</label>
    <input id="username" bind:value={username} required />
  </div>

  <div>
    <label for="password">Password</label>
    <input id="password" bind:value={password} required />
  </div>

  {#if error}
    <p style="color: red;">{error}</p>
  {/if}

  <button type="submit">Login</button>
</form>
