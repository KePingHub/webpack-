import tpl from './layer.html'
import './a.less'
import ejsTpl from './layer.ejs'

console.log(ejsTpl)

export default {
  msg: 'this is layer.js',
  tpl,
  ejsTpl: ejsTpl
}