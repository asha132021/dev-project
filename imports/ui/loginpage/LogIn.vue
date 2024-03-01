<template>
    <img class="logo" src="logo.jpeg">
    
    <div class="login">
        <h1>Log In</h1>
        <hr>
        <label for="email"><b>Email</b></label>
        <input type="email" v-model="email" name="email" required>
    
        <label for="password"><b>Password</b></label>
        <input type="password" v-model="password" name="password" required>
    
        <button v-on:click="logIn" type="submit" class="loginbtn"><b>Log In</b></button>
        <p class="linksignup">Don't have an account? <router-link to="/signup" class="signuplink">Sign Up</router-link>
        </p>
    </div>
    </template>
    
        
        
    <script>
    export default {
        name: "LogIn",
        data() {
            return {
                fullname: "",
                email: "",
                password: ""
            }
        },
        methods: {
            logIn() {
                console.warn("login", this.fullname, this.email, this.password)
    
            }
        }
    
    }
    </script>
        
        
    <style scoped>
    .logo {
        height: 30px;
        margin-left: 100px;
    }
    
    .login {
        margin: 0 auto;
        overflow-x: visible;
        padding: 1.25rem 1.25rem 1px;
        transition: opacity .25s ease-out;
        width: 300px;
    }
    
    .login label {
        color: #999;
        font-family: Roboto, sans-serif;
        font-size: 12px;
        letter-spacing: .5px;
        text-transform: uppercase;
        display: inline-block;
        margin-bottom: 0.375rem;
        box-sizing: border-box;
    }
    
    .login input {
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
        width: 300px
    }
    
    h1 {
        color: rgb(0, 0, 0);
        font-weight: bold;
        font-size: 20px;
        transform: translateY(-10px);
    }
    
    .loginbtn {
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
    
    .login button:hover {
        opacity: 1;
    }
    
    .signuplink {
        color: blueviolet;
        text-decoration: underline;
    }
    .linksignup{
        padding-top: 10px;
    }
    </style>
    