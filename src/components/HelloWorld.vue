<template>
  <h1>{{ msg }}</h1>
  <button @click="setCount">{{ count }}</button>
  <input type="text" v-model="todo" />
  <button class="addTodo" @click="addTodo">add</button>
  <button class="loadUser" @click="loadUser">load</button>
  <p v-if="user.loading" class="loading">Loading</p>
  <div v-else class="userName">{{ user.data && user.data.username }}</div>
  <p v-if="user.error" class="error">error!</p>
  <ul>
    <li v-for="(todo, index) in todos" :key="index">{{ todo }}</li>
  </ul>
  <Hello msg="1234" />
</template>

<script lang="ts">
import { defineComponent, ref, reactive, Ref } from 'vue';
import Hello from '@/components/Hello.vue';
import axios from 'axios';

export default defineComponent({
  components: {
    Hello
  },
  props: {
    msg: String
  },
  emits: ['send'],
  setup(props, { emit }) {
    const todo = ref('');
    const todos: Ref<string[]> = ref([]);
    const count = ref(1);
    const user = reactive({
      data: null as any,
      loading: false,
      error: false
    });

    const setCount = () => {
      count.value++;
    };

    const addTodo = () => {
      if (todo.value) {
        todos.value.push(todo.value);
        emit('send', todo.value);
      }
    };

    const loadUser = () => {
      user.loading = true;
      axios
        .get('https://jsonplaceholder.typicode.com/users/1')
        .then(res => {
          console.log(res);
          user.data = res.data;
        })
        .catch(() => {
          user.error = true;
        })
        .finally(() => {
          user.loading = false;
        });
    };

    return {
      count,
      todo,
      todos,
      setCount,
      addTodo,
      loadUser,
      user
    };
  }
});
</script>

<style scoped></style>
