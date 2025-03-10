<script>
  </script>
  
  <style>
    nav {
      background: #469717;
      padding: 1rem;
      border-bottom: 2px solid #5f5fc5dd;
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
  </style>
  
  <nav>
    <ul>
      <!-- Links relative to the /baseball root -->
      <li><a href="/">Home</a></li>
      <li><a href="/items">Items</a></li>
      <li><a href="/itemedit">Edit</a></li>
    </ul>
  </nav>
  
  <!-- This slot will render the content of nested pages -->
  <slot />
  