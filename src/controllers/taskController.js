const taskStore = require('../data/taskStore');

function createTask(req, res) {
  const task = taskStore.create(req.body);
  return res.status(201).json(task);
}

function getTasks(req, res) {
  return res.json(taskStore.getAll());
}

function getTaskById(req, res) {
  const task = taskStore.getById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Görev bulunamadı.' });
  }

  return res.json(task);
}

function updateTask(req, res) {
  const task = taskStore.update(req.params.id, req.body);

  if (!task) {
    return res.status(404).json({ message: 'Görev bulunamadı.' });
  }

  return res.json(task);
}

function deleteTask(req, res) {
  const deleted = taskStore.remove(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: 'Görev bulunamadı.' });
  }

  return res.status(204).send();
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};
