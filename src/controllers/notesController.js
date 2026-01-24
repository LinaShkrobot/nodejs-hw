import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { tag, search, page = 1, perPage = 10 } = req.query;
  const pageNumber = parseInt(page);
  const perPageNumber = parseInt(perPage);

  const filter = {};

  if (tag) {
    filter.tag = tag;
  }

  if (search) {
    filter.$text = { $search: search };
  }
  const totalNotes = await Note.countDocuments(filter);
  const totalPages = Math.ceil(totalNotes / perPageNumber);
  const skip = (pageNumber - 1) * perPageNumber;
  const notes = await Note.find(filter).skip(skip).limit(perPageNumber);

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
