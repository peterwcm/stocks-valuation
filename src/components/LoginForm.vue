<template>
  <form>
    <b-field>
      <b-input placeholder="Username" icon="user" maxlength="30"></b-input>
    </b-field>

    <b-field>
      <b-input placeholder="Password" type="password" icon="key" password-reveal></b-input>
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
