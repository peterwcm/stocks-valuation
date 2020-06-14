<template>
  <form>
    <b-field>
      <b-input
        placeholder="Username"
        size="is-medium"
        icon="user"
        maxlength="30"
        :has-counter="false"
      ></b-input>
    </b-field>

    <b-field>
      <b-input placeholder="Password" size="is-medium" type="password" icon="key" password-reveal></b-input>
    </b-field>

    <b-field>
      <b-button tag="input" type="is-primary" native-type="submit" value="Login" />
    </b-field>
  </form>
</template>
<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    async loginUser() {
      return false;
    }
  }
};
</script>
