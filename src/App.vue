<!--<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>-->
<template>
  <div class="container">
    <h1>Rounding to the Nearest 10</h1>
    <form @submit.prevent="handleSubmit">
      <label>
        Name:
        <input type="text" v-model="username" required placeholder="Enter your name" />
      </label>

      <div class="questions">
        <div v-for="(q, index) in questions" :key="index" class="question">
          <p>{{ index + 1 }}. Round {{ q.original }} to the nearest 10:</p>
          <select v-model="answers[index]">
            <option disabled value="">Select</option>
            <option v-for="opt in q.options" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </div>
      </div>

      <div class="buttons">
        <button type="submit">Submit</button>
        <button type="button" @click="reset">Reset</button>
      </div>

      <transition name="fade">
        <div v-if="score !== null" class="score">
          <p>{{ username }}, your score is: {{ score }}/12</p>
        </div>
      </transition>

      <footer>
        <p>&copy; mathinenglish.com</p>
      </footer>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      score: null,
      answers: Array(12).fill(''),
      questions: [
        { original: 123, correct: 120, options: [100, 120, 130] },
        { original: 47, correct: 50, options: [40, 50, 60] },
        { original: 89, correct: 90, options: [80, 90, 100] },
        { original: 152, correct: 150, options: [140, 150, 160] },
        { original: 309, correct: 310, options: [300, 310, 320] },
        { original: 25, correct: 30, options: [20, 30, 40] },
        { original: 78, correct: 80, options: [70, 80, 90] },
        { original: 291, correct: 290, options: [280, 290, 300] },
        { original: 99, correct: 100, options: [90, 100, 110] },
        { original: 211, correct: 210, options: [200, 210, 220] },
        { original: 342, correct: 340, options: [330, 340, 350] },
        { original: 67, correct: 70, options: [60, 70, 80] }
      ]
    };
  },
  methods: {
    handleSubmit() {
      if (!this.username.trim()) {
        alert("Please enter your name.");
        return;
      }
      this.score = this.questions.reduce((total, q, index) => {
        return total + (this.answers[index] == q.correct ? 1 : 0);
      }, 0);
    },
    reset() {
      this.username = '';
      this.answers = Array(12).fill('');
      this.score = null;
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 700px;
  margin: auto;
  font-family: Arial, sans-serif;
  padding: 20px;
}
.question {
  margin-bottom: 15px;
}
.buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
.score {
  margin-top: 20px;
  font-weight: bold;
  font-size: 1.2em;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
footer {
  margin-top: 30px;
  font-size: 0.9em;
  text-align: center;
  color: #555;
}
select, input {
  padding: 5px;
  font-size: 1em;
  margin-top: 5px;
}
@media (max-width: 600px) {
  .container {
    padding: 10px;
  }
}
</style>



