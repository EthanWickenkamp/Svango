<script lang="ts">
    import { login } from '$lib/stores/auth';
    let username = '';
    let password = '';

    async function handleLogin() {
        await login(username, password);
    }
</script>

<div>
    <input type="text" bind:value={username} placeholder="Username" />
    <input type="password" bind:value={password} placeholder="Password" />
    <button on:click={handleLogin}>Login</button>
</div>
