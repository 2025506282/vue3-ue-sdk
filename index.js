import { UEPlayer, BaiduCalendar } from './dist/bundle.esm.js'
import "./dist/index.css"
export {
    BaiduCalendar
}
const install=(app)=>{
    app.component('BaiduCalendar', BaiduCalendar);
    app.component('UEPlayer', UEPlayer);
}
export default {
    install
}