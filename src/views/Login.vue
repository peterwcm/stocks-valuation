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
        <b-field label="Username">
          <b-input placeholder="Username" icon="user" maxlength="30"></b-input>
        </b-field>
        <b-field label="Password">
          <b-input placeholder="Password" type="password" icon="key" password-reveal></b-input>
        </b-field>
      </div>
    </section>
  </div>
</template>
