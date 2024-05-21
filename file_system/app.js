const fs = require('fs');

const CREATE_FILE = 'create a file'
const DELETE_FILE = 'delete the file'
const RENAME_FILE = 'rename the file'
const ADD_TO_FILE = 'add to the file'

file = './command.txt'
// Watch every change on the 'command.txt' file
// When an event is triggered, handle operations in the File System
fs.watch(file, (eventType, _) => {
    if (eventType == 'change') {
        fs.readFile(file, (err, buff) => {
            file_content = buff.toString('utf-8')
            handle_command(file_content)
        })
    }
})


const handle_command = async (text) => {
    if (text.includes(CREATE_FILE)) {
        file_path = text.substring(CREATE_FILE.length + 1)
        createFile(file_path)
    }
    if (text.includes(RENAME_FILE)) {
        _idx_to = text.indexOf('to')
        original_file_path = text.substring(RENAME_FILE.length + 1, _idx_to - 1)
        new_file_path = text.substring(_idx_to + 3)
        renameFile(original_file_path, new_file_path)
    }
    if (text.includes(DELETE_FILE)) {
        file_path = text.substring(DELETE_FILE.length + 1)
        deleteFile(file_path)
    }
    if (text.includes(ADD_TO_FILE)) {
        _idx_to = text.indexOf('this content:')
        file_path = text.substring(ADD_TO_FILE.length + 1, _idx_to - 1)
        text_to_add = text.substring(_idx_to + 14)
        addToFile(file_path, text_to_add)
    }
}

const createFile = (path) => {
    // Verify whether file exists, if not, create it.
    fs.stat(path, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.writeFile(path, '', (err => console.log(err)))
            } else {
                console.log(`Error while creating file: ${err}`)
            }
        }
    })
}

const renameFile = (original_file_path, new_file_path) => {
    // Verify whether file exists, if so, rename it.
    fs.stat(original_file_path, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log(`File ${original_file_path} does not exists!`)
            } else {
                console.log(`Error while renaming file: ${err}`)
            }
        } else {
            fs.rename(original_file_path, new_file_path, (err => console.log(err)))
        }
    })
}

const deleteFile = (file_path) => {
    // Verify whether file exists, if so, delete it.
    fs.stat(file_path, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log(`File ${file_path} does not exists!`)
            } else {
                console.log(`Error while deleting file: ${err}`)
            }
        } else {
            fs.rm(file_path, (err => console.log(err)))
        }
    })
}


const addToFile = (file_path, text) => {
    // Verify whether file exists, if so, delete it.
    fs.stat(file_path, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log(`File ${file_path} does not exists!`)
            } else {
                console.log(`Error adding the text ${text} to ${file_path}`)
            }
        } else {
            fs.appendFile(file_path, text, (err => console.log(err)))
        }
    })
}