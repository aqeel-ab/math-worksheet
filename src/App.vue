<template>
  <div class="container">
    <h1>Rounding to the Nearest 10</h1>
    <form @submit.prevent="handleSubmit">
      <div class="progress-bar">
        <div class="fill" :style="{ width: progressPercent + '%' }"></div>
      </div>

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

      <div v-if="highScores.length" class="leaderboard">
        <h2>🏆 High Scores</h2>
        <ul>
          <li v-for="(entry, i) in highScores" :key="i">
            {{ i + 1 }}. {{ entry.username }} - {{ entry.score }}/12
          </li>
        </ul>
      </div>

      <footer>
        <p>&copy; mathinenglish.com</p>
      </footer>
    </form>
  </div>
</template>

<script>

import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      username: '',
      score: null,
      answers: Array(12).fill(''),
      highScores: [],
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
    async handleSubmit() {
      if (!this.username.trim()) {
        alert("Please enter your name.");
        return;
      }

      const unanswered = this.answers.some(answer => answer === '');
      if (unanswered) {
        alert("Please answer all questions before submitting.");
        return;
      }

      this.score = this.questions.reduce((total, q, index) => {
        return total + (this.answers[index] == q.correct ? 1 : 0);
      }, 0);

       try {
        await addDoc(collection(db, 'scores'), {
          username: this.username.trim(),
          score: this.score,
          timestamp: serverTimestamp()
        });
        console.log("Score saved to Firestore ✅");

        await this.fetchHighScores();
      } catch (e) {
        console.error("Error saving score to Firestore ❌", e);
      }
    },
    reset() {
      this.username = '';
      this.answers = Array(12).fill('');
      this.score = null;
    },

    async fetchHighScores() {
    try {
      const scoresRef = collection(db, 'scores');
      const q = query(scoresRef, orderBy('score', 'desc'), limit(5));
      const snapshot = await getDocs(q);
      this.highScores = snapshot.docs.map(doc => doc.data());
    } catch (e) {
      console.error("Error fetching high scores:", e);
    }
  }
  },

  computed: {

    progressPercent() {
      const answered = this.answers.filter(a => a !== '').length;
      return Math.round((answered / this.questions.length) * 100);
    }
  }
};

</script>

<style scoped>
* {
  box-sizing: border-box;
}

body {
  background-color: #312C51; /* deep indigo */
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 750px;
  margin: 30px auto;
  background-color: #312C51;
  padding: 40px;
  border: 2px solid #e6e1da;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

h1 {
  color: #F1AA9B;
  font-weight: 700;
  font-size: 2em;
  text-align: center;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 20px;
  font-weight: 600;
  color: #e6e1da;
}

input[type="text"] {
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  background-color: #c8c8c9;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1em;
  color: rgb(76, 69, 123);
}

.questions {
  margin-top: 30px;
}

.question {
  background: #48426d;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 5px solid #F1AA9B;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.question p {
  margin: 0 0 10px;
  font-weight: 500;
  color: white
}

select {
  width: 100%;
  padding: 10px;
  font-size: 0.8em;
  background-color:#48426d;
  border-radius: 8px;
  border: 1px solid #ccc;
  color: white
}

select:hover {
  background-color: #f1aa9b2e;
  border-color: #f1aa9b;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

option {
  color: #312C51;
  background-color: #aeadac;
  opacity: 0.8
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

button {
  background-color: #48426d;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #f1aa9b;
}

.score {
  text-align: center;
  margin-top: 30px;
  font-size: 1.3em;
  color: #f1aa9b;
  font-weight: bold;
  animation: fadeInUp 0.6s ease;
}

footer {
  text-align: center;
  font-size: 0.9em;
  color: #312c51;
  margin-top: 40px;
  padding-bottom: 20px;
}

.progress-bar {
  background-color: #e6e1da;
  height: 16px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-bar .fill {
  background-color: #f0c38e;
  height: 100%;
  transition: width 0.3s ease-in-out;
}

.leaderboard {
  margin-top: 30px;
  background-color: #f1aa9b22;
  border: 1px solid #f1aa9b;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.leaderboard h2 {
  color: #f1aa9b;
  margin-bottom: 10px;
}

.leaderboard ul {
  list-style: none;
  padding: 0;
}

.leaderboard li {
  font-weight: 500;
  color: #f1aa9b;
  margin: 6px 0;
}


/* Animation */
@keyframes fadeInUp {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .container {
    padding: 20px;
  }
  .buttons {
    flex-direction: column;
  }
}

</style>



