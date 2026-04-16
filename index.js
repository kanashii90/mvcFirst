const colorMap = {
    red: '#F37D7D',
    green: '#C2F37D',
    blue: '#7DE1F3',
    yellow: '#F3DB7D',
    purple: '#E77DF3'
}

const MOCK_NOTES = []

const model = {
    notes: MOCK_NOTES,
    showOnlyFavorite: false,

    createNote(noteTitle, noteContent, noteColor) {
        const newNote = {
            id: crypto.randomUUID(), title: noteTitle, content: noteContent, isFavorite: false, color: noteColor
        }
        const nextStateNotes = [newNote, ...this.notes]
        this.notes = nextStateNotes;

    },


    deleteNotes(notesId) {
        const stateNotesAfterDelete = this.notes.filter((note) => note.id !== notesId)
        this.notes = stateNotesAfterDelete
    },

    toggleFavoriteId(id) {
        const note = this.notes.find(n => n.id === id)
        note.isFavorite = !note.isFavorite

    },
    getFilteredNotes() {
        if (this.showOnlyFavorite) {
            return this.notes.filter((n) => n.isFavorite)
        }
        return this.notes
    },
    toggleFilter() {
        this.showOnlyFavorite = !this.showOnlyFavorite
    }
}


const view = {
    init() {
        this.createForm()
        this.createNotesFilter(model.showOnlyFavorite)
        const list = document.querySelector('.notes-list')
        this.createListHandlers(list)
        this.renderNotes(model.notes)
        this.renderCount(model.notes.length)

    },

    createForm() {
        const form = document.querySelector('.note-form')
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const title = form.elements.title.value
            const content = form.elements.content.value
            const color = form.elements.color.value
            const result = controller.addNote(title, content, color)
            if (result) {
                form.reset()
            } else
            return false
        })
    },
    createNotesFilter(isChecked) {
        const filterContainer = document.querySelector(".filter-box")
        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.checked = isChecked
        checkbox.classList.add('checkbox-input')
        checkbox.addEventListener("change", e => {
            controller.toggleFilter()
        })
        //сделать условие с текстом
        filterContainer.textContent = "Показать только избранные заметки"
        filterContainer.append(checkbox)
        return filterContainer
    },
    renderNotes(notes) {
        const list = document.querySelector('.notes-list')

        if (notes.length === 0) {
            const empty = document.createElement("p")
            empty.classList.add("notes_empty")
            empty.innerHTML = "У вас нет еще ни одной заметки" +
                "<br>"+"Заполните поля выше и создайте свою первую заметку!"
            list.innerHTML = ""
            list.append(empty)

        } else {

            let notesHTML = ''
            for (const note of notes) {
                notesHTML += this.renderNote(note)
            }
            list.innerHTML = notesHTML
        }
        },
    renderNote(note) {
        return `
        <article id="${note.id}"
        class="note ${note.isFavorite ? 'favorite' : ''}">
          <div class="note-header" style="background-color: ${colorMap[note.color]}">
          <p class="note-title" >${note.title}</p>
          <button class="fav-button">
            ${note.isFavorite ? '<img src="./img/icon/heart_active.svg" alt="true">' : '<img src="./img/icon/heart_inactive.svg" alt="false">'}
          </button>
          <button class="del-button"><img src="./img/icon/trash.svg" alt="delete"></button>
          </div>
          <span class="note-content">${note.content}</span>
          
          
        </article>
    `
    },
    createListHandlers(list) {
        list.addEventListener('click', (e) => {
            e.stopPropagation()
            const note = e.target.closest('.note')
            const noteId = note?.id
            if (e.target.closest('.del-button')) {
                controller.deleteNotes(noteId)
            } else if (e.target.closest('.fav-button')) {
                controller.toggleFavorite(noteId)
            }
        })
    },
    renderCount(count) {
        const view = document.querySelector(".counter-text")
        view.textContent = "Всего заметок: " + count

    },
    showMessageBox(message, error = false) {
        const box = document.querySelector(".messages-box")
        const messageContainer = document.createElement("div")
        const img = document.createElement('img');
        const messageElement = document.createElement('span')
        if (error) {
            messageContainer.classList.add('message-err')
            img.src = './img/icon/warning.svg';
            img.alt = 'error';
            messageElement.textContent = message
        } else {
            messageContainer.classList.add('message-done')
            img.src = './img/icon/done.svg';
            img.alt = 'done';
            messageElement.textContent = message
        }

        box.append(messageContainer)
        messageContainer.append(img, messageElement)

        setTimeout(() => {
            messageContainer.remove()
        }, 2000)
    },
}


const controller = {

    addNote(noteTitle, noteContent, color) {

        if (noteTitle.trim() !== '' && noteContent.trim() !== '') {
            console.log(noteTitle.length)
            if (noteTitle.length > 50) {
                view.showMessageBox("Максимальная длина заголовка 50 символов", true)
                return false
            }
            else {
            model.createNote(noteTitle, noteContent, color)
            const notes = model.getFilteredNotes()
            view.renderCount(model.notes.length)
            view.renderNotes(notes)
            view.showMessageBox('Заметка добавлена')
                return true
            }
        } else {
            view.showMessageBox('Заполните все поля', true)
            return false
        }
    },

    deleteNotes(notesId) {
        model.deleteNotes(notesId)
        const notes = model.getFilteredNotes()
        view.renderCount(model.notes.length)
        view.renderNotes(notes)
        view.showMessageBox("Заметка удалена")
    },

    toggleFavorite(noteId) {
        model.toggleFavoriteId(noteId)
        const notes = model.getFilteredNotes()

        view.renderNotes(notes)
    },

    toggleFilter() {
        model.toggleFilter()
        const notes = model.getFilteredNotes()
        view.renderNotes(notes)
    }
}

function init() {
    view.init()
}

document.addEventListener('DOMContentLoaded', init)

