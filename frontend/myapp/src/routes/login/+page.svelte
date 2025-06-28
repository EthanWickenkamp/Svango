<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  export let form: {
    error?: string;
  };
</script>

<h1>Login</h1>

<form method="POST">
  <div>
    <label for="username">Username</label>
    <input id="username" name="username" required />
  </div>

  <div>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" required />
  </div>

  {#if form?.error}
    <p style="color: red;">{form.error}</p>
  {/if}

  <button type="submit">Login</button>
</form>
