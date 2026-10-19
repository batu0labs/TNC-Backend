const fs = require('fs');
const path = require('path');

const dataDirectory = __dirname;
const dataFile = path.join(dataDirectory, 'tasks.json');

function readTasks() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function writeTasks(tasks) {
  fs.writeFileSync(dataFile, `${JSON.stringify(tasks, null, 2)}\n`);
}

function create(data) {
  const tasks = readTasks();
  const now = new Date().toISOString();
  const task = {
    id: String(Date.now()),
    title: data.title,
    description: data.description,
    priority: data.priority,
    assignee: data.assignee,
    status: data.status || 'pending',
    createdAt: now,
    updatedAt: now
  };

  tasks.push(task);
  writeTasks(tasks);
  return task;
}

function getAll() {
  return readTasks();
}

function getById(id) {
  return readTasks().find((task) => task.id === id);
}

function update(id, data) {
  const tasks = readTasks();
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  tasks[index] = {
    ...tasks[index],
    ...data,
    id: tasks[index].id,
    createdAt: tasks[index].createdAt,
    updatedAt: new Date().toISOString()
  };

  writeTasks(tasks);
  return tasks[index];
}

function remove(id) {
  const tasks = readTasks();
  const remainingTasks = tasks.filter((task) => task.id !== id);

  if (remainingTasks.length === tasks.length) {
    return false;
  }

  writeTasks(remainingTasks);
  return true;
}

module.exports = { create, getAll, getById, update, remove };
