import AsyncStorage, {AsyncStorageStatic} from '@react-native-community/async-storage';

class AsyncStorageService {
	service : AsyncStorageStatic = AsyncStorage;

	async get(key: string): Promise<string> {
		const val = await this.service.getItem(key);
		return val || '';
	}

	async create(key: string, val: string): Promise<string> {
		await this.service.setItem(key,val);
		return await this.get(key)
	}

	async update(key: string, val: string): Promise<string> {
		await this.service.mergeItem(key, val);
		return await this.get(key);
	}

	async delete(key: string): Promise<void> {
		await this.service.removeItem(key);
		return;
	}

}


export default AsyncStorageService
