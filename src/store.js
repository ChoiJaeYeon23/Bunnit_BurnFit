import { atom } from 'jotai'

export const currentDateAtom = atom(new Date())  // 현재 날짜 상태 atom
export const selectedDateAtom = atom(null)  // 선택된 날짜 상태 atom
