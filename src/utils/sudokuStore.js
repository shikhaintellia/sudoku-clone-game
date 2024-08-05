import { create } from 'zustand'

const sudokuStore = create((set) => ({
    board: [],
    setBoard: (data) => set(() => ({ board: data })),
    initialCells: [],
    setInitialCells: (data) => set(() => ({ initialCells: data })),
    selectedCell: null,
    setSelectedCell: (data) => set(() => ({ selectedCell: data })),
    difficulty: 'easy',
    setDifficulty: (data) => set(() => ({ difficulty: data })),
    invalidCells: [],
    setInvalidCells: (data) => set(() => ({ invalidCells: data })),
    moveHistory: [],
    setMoveHistory: (data) => set(() => ({ moveHistory: data }))
}))

export default sudokuStore;