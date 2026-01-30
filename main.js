import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Hello Vite + Bun!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

let count = 0
const setupCounter = (element) => {
    const setCounter = (count) => {
        element.innerHTML = `count is ${count}`
    }
    element.addEventListener('click', () => setCounter(++count))
    setCounter(0)
}

setupCounter(document.querySelector('#counter'))
