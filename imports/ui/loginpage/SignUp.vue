<template>
  <form @submit.prevent="onSignUp">
    <div class="signupContainer">
      <img class="logo" src="logo.jpeg">
      <h1> Sign Up</h1>
      <div class="register">
        <p>Please fill in this form to create an account.</p>
        <hr>
        <label for="fullName"><b>Full Name</b></label>
        <input type="text" v-model="user.fullName" name="fullName" required>

        <label for="email"><b>Email</b></label>
        <input type="email" v-model="user.email" name="email" required>

        <label for="orgName"><b>Organization Name</b></label>
        <input type="text" v-model="organization.orgName" name="orgName" required>

        <label for="orgRole"><b>User Role</b></label>
        <input type="text" v-model="organization.orgRole" name="orgRole" required readonly>

        <label for="password"><b>Password</b></label>
        <input type="password" v-model="user.password" name="password" required>

        <label for="confirmPassword"><b>Confirm Password</b></label>
        <input type="password" v-model="user.confirmPassword" name="confirmPassword" required>
        <p v-if="error" class="errormsg">{{ error }}</p>

        <button type="submit" class="signupbtn"><b>Sign Up</b></button>

        <p class="linklogin">
          Already have an account? <router-link to="/login" class="loginlink">Log In</router-link>
        </p>
      </div>
    </div>
  </form>
</template>

<script>
import { Meteor } from 'meteor/meteor';

export default {
  name: 'signup',
  data() {
    return {
      user: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      organization: {
        orgName: '',
        orgRole: 'Keela Admin',
      },
      error: '',
    };
  },
  methods: {
    checkPasswordValidation(password, confirmPassword) {
  if (password !== confirmPassword) {
    this.error = 'Password should be the same';
  } else {
    this.error = ''; // Clear the error when passwords match
  }

    },
    onSignUp() {
  const { fullName, email, password, confirmPassword } = this.user;
  const { orgName, orgRole } = this.organization;

  // Check password validation
  this.checkPasswordValidation(password, confirmPassword);

  if (!this.error) {
    const newOrganization = {
      fullName: fullName.trim(),
      email: email.trim(),
      orgName: orgName.trim(),
      orgRole: orgRole.trim(),
      password: password.trim(),
      confirmPassword: confirmPassword.trim(),
    };

    Meteor.call('organizations.insert', newOrganization, (error) => {
      console.log('Method called!');
      if (error) {
        console.error('Error adding organization:', error);
        this.error = 'Error adding organization: ' + error.message;
      } else {
        this.clearForm();
        alert('Organization created successfully!');
      }
    });
  }
},
    clearForm() {
      // Clear the form fields
      this.user = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      };
      this.organization = {
        orgName: '',
        orgRole: 'Keela Admin',
      };
    },
  },
};
</script>

  
<style scoped>
.logo {
    height: 30px;
    margin-left: 100px;
}

p.errormsg {
    color: red;
    font-size: smaller;
    transform: translateY(-30px);
}

.signupContainer .register {
    margin: 0 auto;
    overflow-x: visible;
    padding: 1.25rem 1.25rem 1px;
    transition: opacity .25s ease-out;
    width: 400px;
}

h1 {
    color: rgb(0, 0, 0);
    font-weight: bold;
    font-size: 20px;
}

.signupContainer .register label {
    color: #999;
    font-family: Roboto, sans-serif;
    font-size: 12px;
    letter-spacing: .5px;
    text-transform: uppercase;
    display: inline-block;
    margin-bottom: 0.375rem;
    box-sizing: border-box;
}

.signupContainer .register input {
    font-family: Roboto, sans-serif;
    width: 300px;
    height: 40px;
    padding-left: 20px;
    display: block;
    margin-bottom: 30px;
    border: 1px solid rgb(0, 0, 0);
    margin-left: auto;
    margin-right: auto;
    border-radius: 0.25rem;
}

hr {
    border: 1px solid #f1f1f1;
    margin-bottom: 25px;
}

.signupContainer .signupbtn {
    font-family: Roboto, sans-serif;
    background-color: #7745d6;
    color: white;
    border: none;
    cursor: pointer;
    width: 300px;
    height: 40px;
    padding-left: 20px;
    opacity: 0.9;
    border-radius: 0.25rem;
}

.signupContainer .register button:hover {
    opacity: 1;
}

.loginlink {
    color: blueviolet;
    text-decoration: underline;
}

.linklogin {
    padding-top: 10px;
}
</style>
