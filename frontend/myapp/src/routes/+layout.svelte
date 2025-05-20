<script lang="ts">
  import { isAuthenticated, user } from '$lib/auth/authstore';
  import { logout } from '$lib/auth/authservice';

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // optional redirect
  };
</script>

<style>
  nav {
    background: #469717;
    padding: 1rem;
    border-bottom: 2px solid #5f5fc5dd;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-left,
  .nav-right {
    display: flex;
    align-items: center;
  }

  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin-right: 1rem;
  }

  a {
    text-decoration: none;
    color: #333;
  }

  .nav-right span {
    color: #fff;
    margin-right: 1rem;
  }

  button {
    background: none;
    border: none;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
  }

  button:hover {
    text-decoration: underline;
  }
</style>

<nav>
  <div class="nav-left">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/items">Items</a></li>
      <li><a href="/itemedit">Edit</a></li>
    </ul>
  </div>

  <div class="nav-right">
    {#if $isAuthenticated}
      <span>Welcome, {$user?.username}</span>
      <button on:click={handleLogout}>Logout</button>
    {:else}
      <a href="/login">Login</a>
    {/if}
  </div>
</nav>

<slot />
