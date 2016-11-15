import fetchJson from 'app/lib/fetchJson'
import DataLoader from 'dataloader'

const todos = [
    {
        id: 1,
        text: "Lorem ipum it sem dollar"
    },
    {
        id: 2,
        text: "<h1>Hello, world!</h1>"
    }
]

const getTodo = async id => todos.filter(todo => todo.id === id)[0]
const getBatchTodos = async ids => ids.map(getTodo)
const todoLoader = new DataLoader(getBatchTodos)

export default todoLoader
