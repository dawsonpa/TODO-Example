import NetInfo from "@react-native-community/netinfo";
import CRUDService from "../local/CRUDService";
import RestService from "../remote/RestService";

class BaseManager<T> {
	remoteService: RestService<T>
	localService: CRUDService<T>

	constructor(remoteService: RestService<T>, localService: CRUDService<T>) {
		this.remoteService = remoteService
		this.localService = localService
	}

	async isConnected() {
		let isConnected = false;
		try {
			const netState = await NetInfo.fetch()
			isConnected = !!netState.isInternetReachable
		} catch (e) {}
		return false;
	}

	async getService() {
		const isConnected = await this.isConnected()

		return isConnected ? this.remoteService : this.localService;
	}


}

export default BaseManager
