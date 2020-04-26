import {createContext, useContext} from 'react'
import {TodoListStore} from '../stores'

export const StoreContext = createContext<TodoListStore>({} as TodoListStore);
export const StoreProvider = StoreContext.Provider;

export const useStore = (): TodoListStore => {
	const store = useContext(StoreContext);
	return store
};