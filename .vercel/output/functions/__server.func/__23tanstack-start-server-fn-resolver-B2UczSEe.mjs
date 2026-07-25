//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-B2UczSEe.js
var manifest = {
	"54d70ed88108a51fa8b0937945c76d00d57555b66db04e17e04b28aaf5188370": {
		functionName: "initDbFn_createServerFn_handler",
		importer: () => import("./_ssr/db-server-n5XiRGg6.mjs")
	},
	"88de60bd1331c985d8e63eab3551aebb3bcb5b031adaf04c4bb8d6b87e2e00e3": {
		functionName: "verifyAdminPasscodeFn_createServerFn_handler",
		importer: () => import("./_ssr/db-server-n5XiRGg6.mjs")
	},
	"aacd6e0fc668b9f197fb589b0e2d69db7646f5e62bd16da19d4c91fd633acfa0": {
		functionName: "requestTempPinFn_createServerFn_handler",
		importer: () => import("./_ssr/db-server-n5XiRGg6.mjs")
	},
	"b999ba7cab68cd4c85afacfae01e4742a5bb6c11c9a16fdbc426b55396af3798": {
		functionName: "syncStudentsFn_createServerFn_handler",
		importer: () => import("./_ssr/db-server-n5XiRGg6.mjs")
	},
	"d736a226007aca51d82c9b9d2b994e5caf3de76a203dd98f2bf61ae298454cd4": {
		functionName: "updateStudentStatusFn_createServerFn_handler",
		importer: () => import("./_ssr/db-server-n5XiRGg6.mjs")
	},
	"e7865490e76a0860472b433edc72e4e689e9ee48666d409d6c02ce798f0fc644": {
		functionName: "deleteStudentFn_createServerFn_handler",
		importer: () => import("./_ssr/db-server-n5XiRGg6.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
