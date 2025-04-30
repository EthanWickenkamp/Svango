<script>
    let email = '';
    let password = '';

    const handleLogin = () => {
        // Add your login logic here
        console.log('Logging in with', email, password);
    };
</script>

<main class="login-container">
    <h1>Login</h1>
    <form on:submit|preventDefault={handleLogin}>
        <div class="form-group">
            <label for="email">Email</label>
            <input
                type="email"
                id="email"
                bind:value={email}
                placeholder="Enter your email"
                required
            />
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input
                type="password"
                id="password"
                bind:value={password}
                placeholder="Enter your password"
                required
            />
        </div>
        <button type="submit">Login</button>
    </form>
</main>

<style>
    .login-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 1rem;
        text-align: center;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>