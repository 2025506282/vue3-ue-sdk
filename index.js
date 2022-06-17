import "./dist/index.css"
import { UEPlayer } from './dist/bundle.esm.js'
export * from './dist/bundle.esm.js'
const install = (app) => {
    app.component('UEPlayer', UEPlayer);
}
export default {
    install
}