import { atom } from 'recoil'
export const urlAtom = atom({
  key: 'urlAtom', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
})
