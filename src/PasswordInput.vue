<template>
    <div v-bind="wrapper">
        <input :type="type" v-model="password" @input="input"/>
        <input type="checkbox" @change="toggle"/>
        <ul>
            <li 
                v-for="(hint, index) in hints"
                :key="index">
                <slot 
                    name="hint"
                    :hint="hint">
                    {{ hint }}
                </slot>
            </li>
            <li v-if="showScore">
                <slot 
                    name="score"
                    :score="score"
                    :scoreLabel="scoreLabels[score]">
                    {{ scoreLabels[score] }}
                </slot>
            </li>
        </ul>
    </div>
</template>

<script>
    import zxcvbn from 'zxcvbn';
    // import debounce from 'lodash.debounce';
    import 'whatwg-fetch';

    export default {
        props: {
            value: {
                type: String,
                default: ''
            },

            scoreLabels: {
                default: () => {
                    return [
                        'Too guessable: risky password.',
                        'Very guessable: protection from throttled online attacks.',
                        'Somewhat guessable: protection from unthrottled online attacks.',
                        'Safely unguessable: moderate protection from offline slow-hash scenario.',
                        'Very unguessable: strong protection from offline slow-hash scenario.',
                    ]
                }
            }
        },

        data()
        {
            return {
                shown: true,
                zxcvbnResult: null,
                password: this.value,
            }
        },

        computed: {
            type()
            {
                return this.shown ? 'text' : 'password'
            },

            hints()
            {
                if (this.zxcvbnResult == null)  return [];

                const { feedback: { suggestions, warning } } = this.zxcvbnResult;
                if (warning.length > 0) {
                    return [warning];
                } else {
                    return suggestions;
                }

            },

            score()
            {
                if (this.zxcvbnResult == null) return null;
                return this.zxcvbnResult.score;
            },

            showScore()
            {
                return this.password.length > 0 && this.score != null && this.score < 3
                            ? true
                            : false;
            },

            wrapper()
            {
                return {
                    class: {

                    }
                };
            }
        },

        watch: {
            value(value)
            {
                this.password = value;
            }
        },

        methods: {
            input()
            {
                this.zxcvbn();
                this.haveIBeenPawned();
                this.$nextTick(function() {
                    this.$emit('input', this.password);
                })
            },

            zxcvbn()
            {
                this.zxcvbnResult = zxcvbn(this.password);
            },

            toggle({ target })
            {
                this.shown = target.checked;
            },

            haveIBeenPawned()
            {
                this.sha1(this.password).then(hash => {
                    const range = hash.substring(0, 5);
                    const request = fetch(`https://api.pwnedpasswords.com/range/${range}`);
                    
                    // debounce(request, 300);

                    request.then(response => {
                        const passwords = response.text().data.split('\n');
                        console.log(passwords);
                    });

                    this.$emit('check', request);
                    console.log(range, hash);
                });
            },

            sha1(value) {
                const buffer = new TextEncoder('utf-8').encode(value);
                return crypto.subtle.digest('SHA-1', buffer).then(hash => Array.from(new Uint8Array(hash)).map(x => x.toString(16).padStart(2, '0')).join(''));
            }
        }
    }
</script>