import './config'
import './style.scss'
import './services/debug'
import m from "mithril"
import App from './App'

var root = document.getElementById('app')
m.mount(root, App)
