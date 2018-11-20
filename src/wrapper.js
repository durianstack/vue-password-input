import PasswordInput from './PasswordInput.vue';

const install = (Vue) => {
	if (install.installed) return;
    install.installed = true;
    Vue.component('PasswordInput', PasswordInput);
};

let GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use({ install });
}

export { PasswordInput };
export default { install };