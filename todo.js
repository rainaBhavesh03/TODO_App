let todoItems = []
const todoInput = document.querySelector('.todo__input')
const completedTodosDiv = document.querySelector('.todo__completed')
const incompleteTodosDiv = document.querySelector('.todo__incomplete')
const audio = new Audio('Assets/sound.mp3')

window.onload = () => {
    let storageTodoItems = localStorage.getItem('todoItems')
    if(storageTodoItems !== null){
        todoItems = JSON.parse(storageTodoItems)
    }

    render()
}

todoInput.onkeyup = ((e) => {
    let value = e.target.value.replace(/^\s+/, "")
    if(value && e.keyCode === 13){
        addTodo(value)

        todoInput.value = ''
        todoInput.focus()
    }
})

function addTodo (text) {
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    })

    saveAndRender()
}

function removeTodo (id) {
    todoItems = todoItems.filter(todo => todo.id !== Number(id))
    saveAndRender()
}

function markAsCompleted (id) {
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = true
        }

        return todo
    })

    audio.play()

    saveAndRender()
}

function markAsIncomplete (id) {
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = false
        }

        return todo
    })

    saveAndRender()
}

function save () {
    localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

function render () {
    let incompleteTodos = todoItems.filter(item => !item.completed)
    let completedTodos = todoItems.filter(item => item.completed)

    completedTodosDiv.innerHTML = ''
    incompleteTodosDiv.innerHTML = ''

    if(incompleteTodos.length > 0){
        incompleteTodos.forEach(todo => {
            incompleteTodosDiv.append(createTodoListElement(todo))
        })
    }
    else{
        incompleteTodosDiv.innerHTML = `<div class="empty">No incomplete mission</div>`
    }

    if(completedTodos.length > 0){
        completedTodosDiv.innerHTML = `<div class="completed-title">Completed (${completedTodos.length} / ${todoItems.length})</div>`

        completedTodos.forEach(todo => {
            completedTodosDiv.append(createTodoListElement(todo))
        })
    }
}

function saveAndRender () {
    save()
    render()
}

function createTodoListElement (todo) {
    const todoDiv = document.createElement('div')
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = 'todo__item'

    const todoTextSpan = document.createElement('span')
    todoTextSpan.innerHTML = todo.text

    const todoInputCheckbox = document.createElement('input')
    todoInputCheckbox.type = 'checkbox'
    todoInputCheckbox.checked = todo.completed
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.todo__item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsIncomplete(id)
    }

    const todoRemoveBtn = document.createElement('a')
    todoRemoveBtn.href = '#'
    todoRemoveBtn.innerHTML = `<img class="close__icon" src="Assets/cross.svg" alt="close icon" width="17px" height="17px">`
    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo__item').dataset.id
        removeTodo(id)
    }

    todoTextSpan.prepend(todoInputCheckbox)
    todoDiv.appendChild(todoTextSpan)
    todoDiv.appendChild(todoRemoveBtn)

    return todoDiv
}