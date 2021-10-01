<template>
  <h1>{{ msg }}</h1>
  <button @click="setCount">{{ count }}</button>
  <input type="text" v-model="todo" />
  <button class="addTodo" @click="addTodo">add</button>
  <ul>
    <li v-for="(todo, index) in todos" :key="index">{{ todo }}</li>
  </ul>
  <Hello msg="1234" />
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import Hello from '@/components/Hello.vue';

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

    const setCount = () => {
      count.value++;
    };

    const addTodo = () => {
      if (todo.value) {
        todos.value.push(todo.value);
        emit('send', todo.value);
      }
    };

    return {
      count,
      todo,
      todos,
      setCount,
      addTodo
    };
  }
});
</script>

<style scoped></style>
