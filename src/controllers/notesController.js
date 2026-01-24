import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { tag, search, page = 1, perPage = 10 } = req.query;

  const pageNumber = parseInt(page);
  const perPageNumber = parseInt(perPage);

  const skip = (pageNumber - 1) * perPageNumber;

  let notesQuery = Note.find();

  if (tag) {
    notesQuery = notesQuery.where('tag').equals(tag);
  }

  if (search) {
    notesQuery = notesQuery.where({ $text: { $search: search } });
  }

  notesQuery = notesQuery.skip(skip).limit(perPageNumber);

  let countQuery = Note.countDocuments();

  if (tag) {
    countQuery = countQuery.where('tag').equals(tag);
  }

  if (search) {
    countQuery = countQuery.where({ $text: { $search: search } });
  }

  const [notes, totalNotes] = await Promise.all([
    notesQuery.exec(),
    countQuery.exec(),
  ]);

  const totalPages = Math.ceil(totalNotes / perPageNumber);

  res.status(200).json({
    page: pageNumber,
    perPage: perPageNumber,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);
  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate({ _id: noteId }, req.body, {
    new: true,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
