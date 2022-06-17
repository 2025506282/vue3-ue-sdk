import "./dist/index.css"
export * from './dist/bundle.esm.js'
const install = (app) => {
    app.component('UEPlayer', UEPlayer);
}
export default {
    install
}