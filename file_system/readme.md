# Managing File System from a command.txt file

This small project is for **practicing the File System module of NodeJS and buffers.** Also, the code was **written using Callback API** provided by functions from `fs` module, which is faster than using promises with `fs/promises` library.

The `fs` module is written in C++, and C++ can communicate to Operational System, so having this skill in NodeJS is pretty good.

## Usage

You need NodeJS installed in your system and nothing else

Run these commands in your terminal:
```
git clone https://github.com/theervilha/nodejs-core-concepts.git . 
cd 4_file_system
node app.js
```

Now, put a command in the `command.txt` file. These are the possibilities:

| command | example |
----------|---------|
|create a file {file_path}| create a file ./creating.txt|
|rename the file {old_file_path} to {new_file_path}| rename the file ./creating.txt to ./renamed.txt|
|add to the file {file_path} this content: {text} | add to the file renamed.txt this content: new text|
|delete the file ${file_path} | delete the file renamed.txt|