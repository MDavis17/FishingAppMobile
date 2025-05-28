import { DEV_API } from "./constants";

type Config = {
  symbol: string | null;
  api: string;
};

// export class ConfigurationManager {
//     constructor() {
//         if (configManager) {
//             throw 'This class is a singleton, call getInstance()';
//         }

//         // try {
//         //     // We conditionally will try to load the env.json, however
//         //     // this is not expected to exist. It is only a development
//         //     // environment file used to set the API information.
//         //     let path = '../../../../config/env.json';
//         //     config = import(path);
//         // } catch (e) {
//         config = getStore().getState().configuration;
//         // }

//         getStore().subscribe(() => {
//             // if data has changed, reset the configuration
//             config = getStore().getState().configuration;
//         });
//     }

//     static getInstance() {
//         return configManager;
//     }

//     getConfiguration() {
//         return config;
//     }

//     setConfiguration(newConfig) {
//         getStore().dispatch({
//             type: ACTIONS.SET_CONFIGURATION,
//             config: {
//                 ...newConfig,
//             },
//         });

//         config = newConfig;
//     }

//     setAlpha() {
//         this.setConfiguration(ALPHA_API);
//     }

//     setStaging() {
//         this.setConfiguration(STAGING_API);
//     }

//     setProduction() {
//         this.setConfiguration(PROD_API);
//     }

//     setCustomConfiguration(api, liveApi, symbol = null) {
//         this.setConfiguration({
//             api,
//             liveApi,
//             symbol,
//         });
//     }
// }

export let config: Config = DEV_API;
// export let configManager = new ConfigurationManager();
