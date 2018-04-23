import layer from './components/layer/layer.js'
import './components/layer/layer.css'

const App = function () {
  const app = document.getElementById('app')
  app.innerHTML = layer.ejsTpl({
    layer
  })
}

new App()
