<template>
  <div class="view view--login">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Login</h1>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-one-third-desktop">
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";

export default {
  components: {
    LoginForm
  }
};
</script>
