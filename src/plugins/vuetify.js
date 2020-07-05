import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  customVariables: ['~/styles/variables.scss'],
  theme: {
    dark: true,
  }
});
