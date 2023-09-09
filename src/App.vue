<template>
  <router-view />
</template>

<script>
import { computed, onBeforeMount, watch } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const appTitle = computed(() => store.state.appTitle);

    watch(appTitle, (val) => {
      document.title = val;
    });

    onBeforeMount(() => {
      document.title = appTitle.value;
    });

    return;
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Poppins:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");

*,
html {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Nunito", sans-serif;
}

:root {
  --BG_COLOR_GREY: rgb(70, 90, 100);
  --TEXT_COLOR_0: rgb(15, 20, 25);
  --TEXT_COLOR_1: rgb(83, 100, 113);
  --TEXT_COLOR_2: rgb(255, 255, 255);
  --TEXT_LINK_COLOR: rgb(29, 155, 240);
  --DARK_COLOR: rgb(15, 20, 25);
  --LIGHT_COLOR: rgb(255, 255, 255);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  width: 100%;
  height: auto;
  min-height: 100vh;
  background: var(--LIGHT_COLOR);
}
</style>
